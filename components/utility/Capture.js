import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import ButtonComponent from "@/components/utility/Button";
import Image from "next/image";
import LoadingComponent from "@/components/utility/loading";
import { NotificationManager } from "react-notifications";

function Capture({ text, onCapture, skip = false, loading = false }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [capturedImage, setCapturedImage] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .catch((error) => {
        setFacingMode("user");
      });
  }, []);

  const capture = () => {
    setCapturedImage(webcamRef.current.getScreenshot());
    onCapture(webcamRef.current.getScreenshot());
    NotificationManager.success("Captured");
  };

  return (
    <div>
      {loading ? (
        <Image src={capturedImage} width={400} height={400} alt="" />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: facingMode,
          }}
        />
      )}
      <div className="flex gap-3 sm:justify-center justify-center">
        {!loading ? (
          <>
            <ButtonComponent
              loading={loading}
              color="grey"
              className={`px-5 py-2 hover:opacity-90 rounded-lg mt-3 w-[70%] sm:w-auto bg-gray-300 text-black}`}
              onClick={() => capture()}
            >
              Capture {text}
            </ButtonComponent>
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </div>
  );
}

export default Capture;
