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
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
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

    let businessQueue;

    if (!business.listingQueue) {
      const newListingQueue = await prisma.listingQueue.create({
        data: {
          owner: {
            connect: {
              id: business.id,
            },
          },
        },
      });
      businessQueue = newListingQueue;
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

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing the files" });
        return;
      }
      const baseUrl = fields.baseUrl;

      const fileUploads = Object.keys(files).map(async (key) => {
        const file = files[key][0];
        const filePath = file.filepath;
        const fileData = fs.readFileSync(filePath);
        const uploadPath = `${businessQueue.id}/${queueListing.id}/${key}`;

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

        return { key, path: uploadPath, url: publicURL };
      });

      let uploadedFiles;

      try {
        uploadedFiles = await Promise.all(fileUploads);

        const updateQueuedListing = await prisma.queuedListing.update({
          where: { id: queueListing.id },
          data: {
            bucketPath: `${businessQueue.id}/${queueListing.id}/`,
          },
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

      try {
        const ximilarReqBody = uploadedFiles.map((file) => ({
          url: file.url,
          id: `${queueListing.id}_${file.key}`,
        }));

        const ximilarReq = await fetch(`${baseUrl}/api/ai/ximilarTagging`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queuedListingId: queueListing.id,
            ximilarReqBody,
            baseUrl,
          }),
        });

        if (!ximilarReq.ok) {
          return res.status(500).json({ message: "Ximilar call failed" });
        }

        const data = await ximilarReq.json();

        res.status(200).json({ queuedListingId: queueListing.id, data });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
