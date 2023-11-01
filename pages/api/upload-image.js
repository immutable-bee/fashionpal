import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { type, image } = req.body;

    if (!type || !image) {
      return res
        .status(400)
        .json({ message: "Invalid request, missing type or image data." });
    }

    const imageType =
      type === "mainImage"
        ? "mainImage"
        : type === "brandImage"
        ? "brandImage"
        : null;

    if (!imageType) {
      return res
        .status(400)
        .json({
          message:
            'Invalid image type provided. Use "mainImage" or "brandImage".',
        });
    }

    try {
      const uploadResponse = await supabase.storage
        .from("listings")
        .upload(
          `${imageType}-${Date.now()}.png`,
          Buffer.from(image, "base64"),
          {
            contentType: "image/png",
          }
        );

      if (uploadResponse.error) {
        throw new Error(uploadResponse.error.message);
      }

      const imagePath = uploadResponse.data.path;

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/listings/${imagePath}`;

      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
