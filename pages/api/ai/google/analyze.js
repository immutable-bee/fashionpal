import { vision } from "@google-cloud/vision";

const handler = async (req, res) => {
  const client = new vision.ImageAnnotatorClient();
  const imageUrl = "IMAGE_URL";

  const request = {
    image: {
      source: {
        imageUri: imageUrl,
      },
    },
    features: [
      {
        type: "DOCUMENT_TEXT_DETECTION",
      },
      {
        type: "LOGO_DETECTION",
      },
    ],
  };

  const [result] = await client.annotateImage(request);
  const textDetections = result.textAnnotations;
  const logoDetections = result.logoAnnotations;
};

export default handler;
