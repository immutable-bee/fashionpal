import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import ButtonComponent from "@/components/utility/Button";
import { NotificationManager } from "react-notifications";

function Capture({ text, onCapture, loading = false }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .catch((error) => {
        setFacingMode("user");
        NotificationManager.error(error);
      });
  }, []);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: facingMode,
        }}
      />
      <ButtonComponent
        loading={loading}
        color="grey"
        className="bg-gray-300 px-5 py-2 rounded-lg mt-3"
        onClick={() => onCapture(webcamRef.current.getScreenshot())}
      >
        Capture {text}
      </ButtonComponent>
    </div>
  );
}

export default Capture;
