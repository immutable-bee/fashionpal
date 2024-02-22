import { prisma } from "../../../../../db/prismaDB";
import { supabase } from "../../../../../supabase/client";
import fs from "fs";
import { IncomingForm } from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { nanoid } from "nanoid";

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateUniqueTinyUrl = async () => {
  let unique = false;
  let tinyUrl;
  while (!unique) {
    const hash = nanoid(10);
    tinyUrl = `https://faspl.co/${hash}`;
    const existing = await prisma.listing.findUnique({ where: { tinyUrl } });
    if (!existing) {
      unique = true;
    }
  }
  return tinyUrl;
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
  let newTinyUrl;

  const form = new IncomingForm();
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  try {
    await prisma.$transaction(
      async (tx) => {
        const business = await tx.business.findUnique({
          where: { email: session.user.email },
        });
        if (!business) {
          throw new Error("Business record not found");
        }

        businessId = business.id;

        const categoryParams = JSON.parse(fields.categoryParams);
        const price = parseFloat(fields.price);
        const purchasePrice = parseFloat(fields.purchasePrice);
        const status = fields.status[0];
        const isPremium = fields.premium == "true";

        const timestampSku = new Date()
          .toISOString()
          .replace(/[-T:]/g, "")
          .slice(0, 14);

        // including suffix nanoid to prevent edge case of multiple listings
        //uploaded in the same second having duplicate sku
        newListingSku = timestampSku + nanoid(3);

        newTinyUrl = await generateUniqueTinyUrl();

        const createCategoryData = {
          taxonomicPath: categoryParams.taxonomicPath,
          top: categoryParams.top,
          name: categoryParams.name,
          sub: categoryParams.sub ? categoryParams.sub : null,
        };

        const newListing = await tx.listing.create({
          data: {
            price,
            status,
            cost: purchasePrice,
            Barcode: newListingSku,
            businessId: business.id,
            isPremiun: isPremium,
            tinyUrl: newTinyUrl,
            categories: {
              create: {
                category: {
                  connectOrCreate: {
                    where: {
                      taxonomicPath: categoryParams.taxonomicPath,
                    },
                    create: {
                      ...createCategoryData,
                    },
                  },
                },
              },
            },
          },
        });

        newListingId = newListing.id;

        const uploadPromises = Object.keys(files).map(async (key) => {
          const fileArray = files[key];
          if (fileArray && fileArray.length > 0) {
            const file = fileArray[0];
            const filePath = file.filepath;
            const fileData = fs.readFileSync(filePath);
            const uploadPath = `${businessId}/${newListingId}/${key}`;

            const { error } = await supabase.storage
              .from("standard-listings")
              .upload(uploadPath, fileData, {
                contentType: file.mimetype,
                upsert: true,
              });

            fs.unlinkSync(filePath);
            if (error) {
              throw new Error(error.message);
            }

            return {
              key: key,
              url: `${process.env.SUPABASE_STORAGE_URL}standard-listings/${businessId}/${newListingId}/${key}`,
            };
          }
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        const imageData = uploadedFiles.reduce((acc, { key, url }) => {
          if (key && url) {
            acc[`${key}Url`] = url;
          }
          return acc;
        }, {});

        if (Object.keys(imageData).length > 0) {
          await tx.listing.update({
            where: { id: newListingId },
            data: imageData,
          });
        }
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    res.status(200).json({ newListingSku, newTinyUrl });
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
