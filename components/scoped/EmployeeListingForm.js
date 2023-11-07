import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import ButtonComponent from "@/components/utility/Button";
import Capture from "@/components/utility/Capture";
import Image from "next/image";
import moment from "moment";

function EmployeeListingForm({ onBack, onFecth }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [listType, setListType] = useState("dispose");
  const [uploadedImages, setUploadedImages] = useState({
    main: null,
    brandTag: null,
  });
  const [listings, setListings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [photoUploading, setphotoUploading] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState("main");
  const [showCamera, setShowCamera] = useState(false); // Control the visibility of the camera

  //
  useEffect(() => {
    setStartTime(moment().format("HH:mm:ss"));
  }, []);

  const resetAllVariables = () => {
    setStartTime("");
    setEndTime("");
    setEmployeeName("");
    setListType("dispose");
    setCurrentPhotoType("main");
    setUploadedImages({
      main: null,
      brandTag: null,
    });
  };

  const uploadMainOrBrandTagPhoto = async (e) => {
    const imageSrc = e;
    if (imageSrc) {
      const file = convertDataURLtoFile(imageSrc, `${currentPhotoType}.jpg`);

      // Set loading to true while uploading
      setphotoUploading(true);

      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: currentPhotoType === "main" ? "mainImage" : "brandImage", // Use the currentPhotoType as the image type
            image: imageSrc.split(",")[1], // Base64 image data
          }),
        });

        if (response.ok) {
          const data = await response.json();

          if (currentPhotoType === "main") {
            // Set main image in the uploadedImages state
            setUploadedImages((prevState) => ({
              ...prevState,
              main: {
                image: imageSrc,
                file: file,
                type: "main",
                url: data.url,
              },
            }));
            setCurrentPhotoType("brandTag");
          } else if (currentPhotoType === "brandTag") {
            // Set brandTag image in the uploadedImages state
            setUploadedImages((prevState) => ({
              ...prevState,
              brandTag: {
                image: imageSrc,
                file: file,
                type: "brandTag",
                url: data.url,
              },
            }));
            // After capturing the brandTag image:
            setShowCamera(false); // Hide the camera
            setStep(2); // Move to the next step

            const tags = [];

            if (uploadedImages.main && uploadedImages.main.url) {
              const mainTags = await getTagsFromGoogleVision(
                uploadedImages.main.url,
                "main"
              );
              tags.push(...mainTags);
            }

            if (uploadedImages.brandTag && uploadedImages.brandTag.url) {
              const brandTagTags = await getTagsFromGoogleVision(
                uploadedImages.brandTag.url,
                "brandTag"
              );
              tags.push(...brandTagTags);
            }

            setUploadedImages((prevState) => ({
              ...prevState,
              tags: tags, // Update 'tags' with combined tags from both 'main' and 'brandTag'
            }));
          }
        } else {
          // Handle the case when the upload was not successful
          console.error("Image upload failed.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        // Set loading back to false after the upload is complete
        setphotoUploading(false);
      }
    } else if (currentPhotoType === "brandTag") {
      setShowCamera(false); // Hide the camera
      setStep(2); // Move to the next step

      const tags = [];

      if (uploadedImages.main && uploadedImages.main.url) {
        const mainTags = await getTagsFromGoogleVision(
          uploadedImages.main.url,
          "main"
        );
        tags.push(...mainTags);
      }

      if (uploadedImages.brandTag && uploadedImages.brandTag.url) {
        const brandTagTags = await getTagsFromGoogleVision(
          uploadedImages.brandTag.url,
          "brandTag"
        );
        tags.push(...brandTagTags);
      }

      setUploadedImages((prevState) => ({
        ...prevState,
        tags: tags, // Update 'tags' with combined tags from both 'main' and 'brandTag'
      }));
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

  const onListMore = () => {
    const newListing = listings;
    newListing.push({
      employee_name: employeeName,
      type: "employee",
      list_type: listType,
      tags: [],
      items: uploadedImages,
    });

    setListings(newListing);
    setUploadedImages({
      main: null,
      brandTag: null,
    });
    setCurrentPhotoType("main");
    setStep(1);
    resetAllVariables();
  };

  // This function will send the image to the server-side endpoint for processing.
  const getTagsFromGoogleVision = async (base64Image, imageType) => {
    try {
      const response = await fetch("/api/getTags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          type: imageType,
        }),
      });

      const data = await response.json();
      if (data && data.tags) {
        return data.tags;
      } else {
        console.error("Error fetching tags:", data.error);
        return [];
      }
    } catch (error) {
      console.error("Failed to get tags:", error);
      return [];
    }
  };

  const onUploadAll = async () => {
    setUploading(true);

    const convertedListings = await Promise.all(
      listings.map(async (listing) => {
        const mainImageUrl = listing.items.main.url;
        const brandImageUrl = listing.items.brandTag
          ? listing.items.brandTag.url
          : null;

        let JSON = {
          employeeName: employeeName,
          type: "employee",
          listType: listType,
          mainImage: mainImageUrl,
          brandImage: brandImageUrl,
          tags: listing.items.tags,
        };

        return JSON;
      })
    );

    try {
      const requests = convertedListings.map((listing) =>
        axios.post("/api/add-listing", { listing })
      );

      await axios.all(requests);

      NotificationManager.success("Listing added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setEndTime(moment().format("HH:mm:ss"));
      setStep(3);

      onFecth();
      setUploading(false);
    }
  };

  const openCamera = () => {
    if (employeeName) {
      setShowCamera(true);
    } else {
      NotificationManager.error("Employee name is required!");
    }
  };

  return (
    <div className="">
      <>
        {step === 1 ? (
          <div className="sm:w-96 mx-auto">
            <div className="flex justify-center mt-12">
              <div>
                <label className="text-lg mb-1 block text-gray-700 font-medium">
                  Employee name:
                </label>
                <input
                  type="text"
                  className="bg-white w-72 mx-auto form-input  focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500  rounded-lg  px-4 py-2.5"
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </div>
            <div className="border border-gray-500 mx-auto mt-8 min-w-[288px] rounded-xl max-w-fit px-4 py-3">
              <h3 className="text-xl font-semibold">Instructions</h3>

              <ul className=" list-decimal ml-4 text-lg">
                <li>Photo of the front</li>
                <li>Photo of the item tag</li>
                <li>Add to the appropriate pile</li>
              </ul>
            </div>
            <div className="flex justify-center mt-8 rounded-2xl mx-auto gap-2">
              {showCamera ? (
                <Capture
                  onCapture={uploadMainOrBrandTagPhoto}
                  loading={photoUploading}
                  skip={currentPhotoType === "main" ? false : true}
                  text={currentPhotoType === "main" ? "Main Image" : "BrandTag"}
                />
              ) : (
                <div>
                  <div
                    onClick={() => openCamera()}
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
                        class="w-16 h-16 mt-4 mx-auto"
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
                  {listings.length !== 0 ? (
                    <ButtonComponent
                      loading={uploading}
                      full
                      onClick={() => onUploadAll()}
                      className={`!mt-12 mx-auto !w-64 rounded-lg !text-black`}
                    >
                      Stop
                    </ButtonComponent>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 2 ? (
          <div className="px-5 mt-6 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setListType("dispose")}
                className={`${
                  listType === "dispose" ? "bg-red-500 text-white" : "bg-white"
                } duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
              >
                Dispose
              </button>
              <button
                onClick={() => setListType("list")}
                className={`${
                  listType === "list" ? "bg-green-500 text-white" : "bg-white"
                } duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
              >
                List
              </button>
              <button
                onClick={() => setListType("auction")}
                className={`${
                  listType === "auction"
                    ? "bg-green-500 text-white"
                    : "bg-white"
                } duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
              >
                Auction
              </button>
            </div>

            <div className="flex gap-4 justify-center  mb-4 mt-6">
              {uploadedImages.main ? (
                <div className=" border-2 border-primary rounded-2xl px-2 sm:px-4 py-2 sm:py-5 sm:w-64 my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={uploadedImages.main.image}
                      alt={"Main Photo"}
                      width={250}
                      height={250}
                      className="rounded-xl max-w-full max-h-full"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {uploadedImages.brandTag ? (
                <div className=" border-2 border-primary rounded-2xl px-2 sm:px-4 py-2 sm:py-5 sm:w-64 my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={uploadedImages.brandTag.image}
                      alt={"Brand Tag Photo"}
                      width={250}
                      height={250}
                      className="rounded-xl max-w-full max-h-full"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={() => onListMore()}
                className={` hover:bg-red-400 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
              >
                Dispose
              </button>
              <button
                onClick={() => onListMore()}
                className={` hover-bg-primary hover:text-white duration-250 min-w-[100px] ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
              >
                Keep
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 3 ? (
          <>
            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        Disposed
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        Listed
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        Auctioned
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        Start time
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        End time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="px-6 py-4">
                        {
                          listings.filter((x) => x.list_type === "dispose")
                            .length
                        }
                      </td>
                      <td class="px-6 py-4">
                        {listings.filter((x) => x.list_type === "list").length}
                      </td>
                      <td class="px-6 py-4">
                        {
                          listings.filter((x) => x.list_type === "auction")
                            .length
                        }
                      </td>
                      <td class="px-6 py-4">{startTime}</td>
                      <td class="px-6 py-4">{endTime}</td>
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
