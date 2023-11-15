import { prisma } from "../../../../db/prismaDB";
import { supabase } from "../../../../supabase/client";
import fs from "fs";
import formidable from "formidable";
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
      const newListingQueue = await prisma.ListingQueue.create({
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

    const queueListing = await prisma.queuedlisting.create({
      data: {
        owner: {
          connect: {
            id: businessQueue.id,
          },
        },
      },
    });

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing the files" });
        return;
      }

      const file = files.file[0];
      const filePath = file.filepath;

      const fileData = fs.readFileSync(filePath);

      const { data, error } = await supabase.storage
        .from("queued-listings")
        .upload(`${businessQueue.id}/${queueListing.id}`, fileData, {
          contentType: file.mimetype,
          upsert: false,
        });

      fs.unlinkSync(filePath);

      const { url, urlFetchError } = supabase.storage
        .from(`queued-listings`)
        .getPublicUrl(`${businessQueue.id}/${queueListing.id}`);

      if (urlFetchError) {
        console.log("Error retrieving public URL", error);
        return res
          .status(500)
          .json({ message: "Error retrieving public URL", error });
      }

      const updateQueuedListing = await prisma.queuedlisting.update({
        where: { id: queueListing.id },
        data: {
          url: url.publicUrl,
        },
      });

      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        const ximilarReq = await fetch("api/ai/ximilarTagging", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageId: queueListing.id,
            url: url.publicUrl,
          }),
        });

        if (!ximilarReq.ok) {
          return res.status(500).json({ message: "Ximilar call failed" });
        }

        const data = ximilarReq.json();

        res.status(200).json(data);
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
