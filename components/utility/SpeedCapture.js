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
    <div className="w-80">
      <div className="border-2 w-80 py-1 border-black rounded-2xl px-4 content-center text-4xl">
        # {totalAmount}
      </div>

      <div
        className={`border-4 mx-auto mt-8 rounded-2xl px-2 sm:px-4 py-2 sm:py-5 sm:w-64 my-1 relative ${
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

      <div className="flex w-80 mt-4 gap-3 sm:justify-center justify-center">
        <ButtonComponent
          disabled={loading}
          color="grey"
          className="bg-white px-5 py-2 rounded-lg mt-3 sm:w-auto"
          onClick={() =>
            onCapture(webcamRef.current.getScreenshot(), "DAMAGED")
          }
        >
          Damaged
        </ButtonComponent>
        <ButtonComponent
          disabled={loading}
          color="grey"
          className="bg-white px-5 py-2 rounded-lg mt-3  sm:w-auto"
          onClick={() =>
            onCapture(webcamRef.current.getScreenshot(), "DISPOSED")
          }
        >
          Dispose
        </ButtonComponent>
        <ButtonComponent
          disabled={loading}
          color="grey"
          className="bg-green-500 px-5 py-2 rounded-lg mt-3  sm:w-auto"
          onClick={() => onCapture(webcamRef.current.getScreenshot(), "SALE")}
        >
          Keep
        </ButtonComponent>
      </div>

      {totalAmount ? (
        <div className="flex mt-8 gap-3 w-80 sm:justify-center justify-center">
          <ButtonComponent
            disabled={loading}
            color="grey"
            className="bg-red-600 mx-auto text-white !px-20 py-2 rounded-lg mt-3  sm:w-auto"
            onClick={() => onDone()}
          >
            DONE
          </ButtonComponent>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Capture;
