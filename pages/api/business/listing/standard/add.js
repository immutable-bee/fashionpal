import { prisma } from "../../../../../db/prismaDB";
import { supabase } from "../../../../../supabase/client";
import fs from "fs";
import { IncomingForm } from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let businessId;
  let newListingId;
  let newListingSku;

  const form = new IncomingForm();
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  try {
    await prisma.$transaction(async (tx) => {
      const business = await tx.business.findUnique({
        where: { email: session.user.email },
      });
      if (!business) {
        throw new Error("Business record not found");
      }

      businessId = business.id;

      const category = fields.category[0];
      const price = parseFloat(fields.price);
      const status = fields.status[0];

      const skuCat = category === "" ? "apparel" : category;
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:]/g, "")
        .slice(0, 14);

      const sku = `${skuCat}-${status}-${timestamp}`;
      newListingSku = sku;

      const newListing = await tx.listing.create({
        data: {
          price,
          status,
          Barcode: sku,
          businessId: business.id,
          categories: {
            create: {
              category: {
                connectOrCreate: {
                  where: {
                    name: category,
                  },
                  create: {
                    name: category,
                  },
                },
              },
            },
          },
        },
      });

      newListingId = newListing.id;

      for (const key in files) {
        const file = files[key][0];
        const filePath = file.filepath;
        const fileData = fs.readFileSync(filePath);
        const uploadPath = `${business.id}/${newListing.id}/${key}`;

        const { error } = await supabase.storage
          .from("standard-listings")
          .upload(uploadPath, fileData, {
            contentType: file.mimetype,
            upsert: false,
          });

        fs.unlinkSync(filePath);
        if (error) {
          throw new Error(error.message);
        }
      }

      const data = files.brandImage
        ? {
            mainImageUrl: `${process.env.SUPABASE_STORAGE_URL}standard-listings/${business.id}/${newListing.id}/mainImage`,
            brandImageUrl: `${process.env.SUPABASE_STORAGE_URL}standard-listings/${business.id}/${newListing.id}/brandImage`,
          }
        : {
            mainImageUrl: `${process.env.SUPABASE_STORAGE_URL}standard-listings/${business.id}/${newListing.id}/mainImage`,
          };

      await tx.listing.update({
        where: { id: newListing.id },
        data,
      });
    });

    res.status(200).json(newListingSku);
  } catch (error) {
    for (const key in files) {
      const uploadPath = `${businessId}/${newListingId}/${key}`;
      const { error: deleteError } = await supabase.storage
        .from("standard-listings")
        .remove([uploadPath]);

      if (deleteError) {
        console.error(`Error cleaning up file: ${deleteError.message}`);
      }
    }
    res.status(500).json({ error: error.message });
  }
};

export default handler;
