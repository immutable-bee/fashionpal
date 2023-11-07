import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import ButtonComponent from "@/components/utility/Button";
import { NotificationManager } from "react-notifications";

function Capture({ onCapture, loading = false, onDone, totalAmount }) {
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
      <div className="flex gap-3 sm:justify-start justify-center">
        <ButtonComponent
          loading={loading}
          color="grey"
          className="bg-red-600 px-5 py-2 rounded-lg mt-3 w-[70%] sm:w-auto"
          onClick={() => onDone()}
        >
          DONE
        </ButtonComponent>
      </div>
      <div className="border-2 border-black rounded-2xl px-2 content-center text-4xl">
        # {totalAmount}
      </div>

      <div
        className={`border-2 rounded-2xl px-2 sm:px-4 py-2 sm:py-5 sm:w-64 my-1 relative ${
          loading ? "border-green-400" : "border-black"
        }`}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-xl max-w-full max-h-full"
          videoConstraints={{
            facingMode: facingMode,
          }}
        />
      </div>
      <div className="flex gap-3 sm:justify-start justify-center">
        <ButtonComponent
          loading={loading}
          color="grey"
          className="bg-gray-300 px-5 py-2 rounded-lg mt-3 w-[70%] sm:w-auto"
          onClick={() =>
            onCapture(webcamRef.current.getScreenshot(), "DAMAGED")
          }
        >
          Damaged
        </ButtonComponent>
      </div>
      <div className="flex gap-3 sm:justify-start justify-center">
        <ButtonComponent
          loading={loading}
          color="grey"
          className="bg-gray-300 px-5 py-2 rounded-lg mt-3 w-[70%] sm:w-auto"
          onClick={() =>
            onCapture(webcamRef.current.getScreenshot(), "DISPOSED")
          }
        >
          Dispose
        </ButtonComponent>
        <ButtonComponent
          loading={loading}
          color="grey"
          className="bg-green-500 px-5 py-2 rounded-lg mt-3 w-[70%] sm:w-auto"
          onClick={() => onCapture(webcamRef.current.getScreenshot(), "SALE")}
        >
          Keep
        </ButtonComponent>
      </div>
    </div>
  );
}

export default Capture;
