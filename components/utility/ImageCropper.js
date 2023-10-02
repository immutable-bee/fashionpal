import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import axios from 'axios';
import ModalComponent from "@/components/utility/Modal";
import ButtonComponent from "@/components/utility/Button";
import 'react-image-crop/dist/ReactCrop.css';



const REMOVE_BG_API_KEY = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;

const convertBlobToBase64 = async (blobUrl) => {
  const blob = await fetch(blobUrl).then(r => r.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result.split(',')[1]);  // Return only Base64 content
    };
    reader.readAsDataURL(blob);
  });
};

export default function CropperModal({ imageSrc, onClose, onCrop }) {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100, unit: '%' });

  const [removeBackground, setRemoveBackground] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);

  // const onImageLoad = image => {
  //   imageRef.current = image;
  // };
  const onImageLoad = image => {
    imageRef.current = image;
    setCrop({
      x: 0,
      y: 0,
      width: image.naturalWidth,
      height: image.naturalHeight,
      unit: 'px' // Use pixels since we're setting it to the natural size of the image
    });
  };


  const getCroppedImgBlob = async () => {
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleFinalCrop = async () => {
    if (imageRef.current) {
      const croppedImageBlob = await getCroppedImgBlob();
      const croppedImageFile = new File([croppedImageBlob], "croppedImage.jpeg", { type: "image/jpeg" });

      if (removeBackground) {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("image_file", croppedImageFile);

          // Make the request and set responseType to 'blob'
          const response = await axios.post("https://sdk.photoroom.com/v1/segment", formData, {
            headers: {
              "x-api-key": REMOVE_BG_API_KEY
            },
            responseType: 'blob'
          });

          // Convert the blob response to an object URL
          const newImageSrc = URL.createObjectURL(response.data);
          onCrop({ url: newImageSrc, file: croppedImageFile });

        } catch (error) {
          console.error("Failed to remove background:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        const blobURL = URL.createObjectURL(croppedImageBlob);
        onCrop({ url: blobURL, file: croppedImageFile });
      }
    } else {
      console.warn("Image has not been loaded yet.");
    }
  };





  return (
    <ModalComponent
      open={true}
      title={'Crop Image'}
      onClose={onClose}
      footer={
        <div className="flex justify-end w-full">
          <ButtonComponent rounded className="!mx-1" loading={loading} onClick={handleFinalCrop}>Crop</ButtonComponent>
          <ButtonComponent rounded className="!mx-1" onClick={onClose}>Close</ButtonComponent>
        </div>
      }
    >
      <ReactCrop
        src={imageSrc.url}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onImageLoaded={onImageLoad}
      >
        <img src={imageSrc.url} alt="Crop" ref={imageRef} />
      </ReactCrop>
      <label>
        <input
          type="checkbox"
          checked={removeBackground}
          onChange={() => setRemoveBackground(!removeBackground)}
        />
        Remove Background
      </label>
    </ModalComponent>
  );
}
