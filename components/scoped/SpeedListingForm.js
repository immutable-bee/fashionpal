import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import ButtonComponent from "@/components/utility/Button";
import SpeedCapture from "@/components/utility/SpeedCapture";

function EmployeeListingForm({ onBack, onFetch }) {
  const [employeeName, setEmployeeName] = useState("");
  const [step, setStep] = useState(1);
  const [listedAmount, setListedAmount] = useState(0);
  const [disposedAmount, setDisposedAmount] = useState(0);
  const [damagedAmount, setDamagedAmount] = useState(0);
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {}, []);

  const uploadMainOrBrandTagPhoto = async (imageSrc, type) => {
    if (imageSrc) {
      const file = convertDataURLtoFile(imageSrc, `main-${Date.now()}.jpg`);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", "speed");

      setPhotoUploading(true);

      try {
        const response = await fetch("/api/business/listing/addToQueue", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const image = {
            image: imageSrc,
            file: file,
            type: type,
            url: data?.url,
          };
          await createListing(image);
        } else {
          const errorData = await response.json();
          console.error("Server response error:", errorData);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setPhotoUploading(false);
      }
    }
  };

  const convertDataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const createListing = async (image) => {
    try {
      await axios.post("/api/business/listing/add-listing", {
        listing: {
          employeeName: employeeName,
          type: "employee",
          listType: image.type,
          mainImage: image.url,
          tags: [],
          category: "Clothing",
          status: image.type,
          barcode: "barcode",
        },
      });
      switch (image.type) {
        case "DISPOSED":
          setDisposedAmount(disposedAmount + 1);
          break;
        case "SALE":
          setListedAmount(listedAmount + 1);
          break;
        case "DAMAGED":
          setDamagedAmount(damagedAmount + 1);
          break;
      }
      NotificationManager.success("Complete");
    } catch (error) {
      console.error(error);
    } finally {
      setPhotoUploading(false);
    }
  };

  const openCamera = () => {
    if (!employeeName) {
      NotificationManager.error("Employee name is required!");
    } else {
      setStep(2);
    }
  };

  const showResults = () => {
    setStep(3);
  };

  return (
    <div className="">
      <>
        {step === 1 ? (
          <div className="sm:w-96 mx-auto">
            <div className="flex justify-center mt-12">
              <div className="w-full">
                <label className="text-lg mb-1 block text-gray-700 font-medium">
                  Employee name:
                </label>
                <input
                  type="text"
                  className="bg-white w-full mx-auto form-input  focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500  rounded-lg  px-4 py-2.5"
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </div>
            <div className="border-4 border-black mx-auto mt-8 min-w-[288px] rounded-xl max-w-fit px-4 py-3">
              <h3 className="text-xl font-semibold">Instructions</h3>
              <ul className=" list-decimal ml-4 text-lg">
                <li>
                  Take a photo of the front of the item by selecting the
                  appropriate button. Dispose, Damaged or Keep
                </li>
                <li>Add to the appropriate pile</li>
              </ul>
            </div>
            <div className="flex justify-center mt-8 rounded-2xl mx-auto gap-2">
              <div>
                <div
                  onClick={() => {
                    openCamera();
                  }}
                  className="rounded-2xl px-2 cursor-pointer hover:opacity-70 flex items-center justify-center w-72 border-2 shadow-md h-56"
                >
                  <div>
                    <h1 className="text-xl text-center font-medium font-mono ">
                      Take Photo
                    </h1>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-16 h-16 mt-4 mx-auto"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 2 ? (
          <div className="px-5 mt-6 w-full">
            <SpeedCapture
              onCapture={uploadMainOrBrandTagPhoto}
              onDone={showResults}
              totalAmount={listedAmount + disposedAmount + damagedAmount}
              loading={photoUploading}
            />
          </div>
        ) : (
          ""
        )}

        {step === 3 ? (
          <>
            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Disposed
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Listed
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Damaged
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4">{disposedAmount}</td>
                      <td className="px-6 py-4">{listedAmount}</td>
                      <td className="px-6 py-4">{damagedAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center sm:justify-start mt-1">
              <ButtonComponent
                rounded
                className="!w-48 mt-6"
                onClick={() => onBack()}
              >
                Home page
              </ButtonComponent>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    </div>
  );
}

export default EmployeeListingForm;
