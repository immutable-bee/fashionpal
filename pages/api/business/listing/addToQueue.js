import { prisma } from "../../../../db/prismaDB";
import { supabase } from "../../../../supabase/client";
import fs from "fs";
import { IncomingForm } from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  let businessQueue;
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
      include: {
        listingQueue: true,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: `Business record not found for email:  ${session.user.email}`,
      });
    }

    const form = new IncomingForm();
    const [fields, files] = await form.parse(req).catch(() => {
      return res.status(500).json({ error: "Error parsing the files" });
    });

    if (fields?.mode?.includes("speed")) {
      const uploadedFiles = await uploadFiles(
        files,
        `${business.id}/${new Date().toISOString()}`
      );
      res.status(200).json(uploadedFiles[0]);
    } else {
      if (!business.listingQueue) {
        businessQueue = await prisma.listingQueue.create({
          data: {
            owner: {
              connect: {
                id: business.id,
              },
            },
          },
        });
      } else {
        businessQueue = business.listingQueue;
      }
      const queueListing = await prisma.queuedListing.create({
        data: {
          queue: {
            connect: {
              id: businessQueue.id,
            },
          },
        },
      });
      const updateQueuedListing = await prisma.queuedListing.update({
        where: { id: queueListing.id },
        data: {
          bucketPath: `${businessQueue.id}/${queueListing.id}/`,
        },
      });
      const uploadedFiles = await uploadFiles(
        files,
        `${businessQueue.id}/${queueListing.id}`
      );

      res.status(200).json("Listing added to queue");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function uploadFiles(files, uploadPathPrefix) {
  const uploadedFiles = [];
  for (const key in files) {
    const file = files[key][0];
    const filePath = file.filepath;
    const fileData = fs.readFileSync(filePath);
    const uploadPath = `${uploadPathPrefix}/${key}`;

    const { data, error } = await supabase.storage
      .from("queued-listings")
      .upload(uploadPath, fileData, {
        contentType: file.mimetype,
        upsert: false,
      });

    fs.unlinkSync(filePath);
    if (error) {
      throw new Error(error.message);
    }
    const publicURL = `${process.env.SUPABASE_STORAGE_URL}queued-listings/${uploadPath}`;
    uploadedFiles.push({ key, path: uploadPath, url: publicURL });
  }
  return uploadedFiles;
}

export default handler;
