import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import ButtonComponent from "@/components/utility/Button";
import Image from "next/image";
import LoadingComponent from "@/components/utility/loading";

function Capture({ text, onCapture, skip = false, loading = false }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [capturedImage, setCapturedImage] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .catch((error) => {
        console.log(error);
        setFacingMode("user");
      });
  }, []);

  const capture = () => {
    setCapturedImage(webcamRef.current.getScreenshot());
    onCapture(webcamRef.current.getScreenshot());
  };

  return (
    <div>
      {loading ? (
        <Image
          src={capturedImage}
          width={400}
          height={400}
          alt=""
        />
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
      <div className="flex gap-3 sm:justify-start justify-center">
        {!loading ? (
          <>
            <ButtonComponent
              loading={loading}
              color="grey"
              className="bg-gray-300 px-5 py-2 rounded-lg mt-3 w-[70%] sm:w-auto"
              onClick={() => capture()}
            >
              Capture {text}
            </ButtonComponent>
            {skip ? (
              <ButtonComponent
                loading={loading}
                color="grey"
                className="bg-gray-300 px-5 py-2 rounded-lg mt-3 w-[70%] sm:w-auto"
                onClick={() => onCapture(null)}
              >
                Skip
              </ButtonComponent>
            ) : (
              ""
            )}
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </div>
  );
}

export default Capture;
