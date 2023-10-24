import axios from "axios";
import FormData from "form-data";

const REMOVE_BG_API_KEY = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  // The frontend will send the image as a blob in the body.
  const imageBuffer = req.body;

  if (!imageBuffer) {
    res.status(400).json({ success: false, error: "No image provided" });
    return;
  }

  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_file", imageBuffer, "uploaded_image.jpg");

  try {
    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
    });

    if (response.status !== 200) {
      res.status(response.status).send(response.statusText);
      return;
    }

    // You can save the image or send it back to the frontend.
    // For now, I'll send it back to the frontend as a blob.
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("API responded with:", error.response.data); // For logging
      res.status(500).json({
        success: false,
        error: error.response.data.message || "Unknown error",
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
