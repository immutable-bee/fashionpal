import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import ButtonComponent from "@/components/utility/Button";
import Capture from "@/components/utility/Capture";
import { QRCode } from "react-qrcode-logo";
import LoadingComponent from "../utility/loading";
import moment from "moment";

function ImageUploader({ onBack, onFecth }) {
  const [price, setPrice] = useState(0);

  const [defaultPriceSuggestion, setDefaultPriceSuggestion] = useState(-1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [fetchingSimilarProducts, setFetchingSimilarProducts] = useState(false);

  const [similarProducts, setSimilarProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  const [listType, setListType] = useState("dispose");
  const [subCategoryOne, setSubCategoryOne] = useState("");
  const [subCategoryTwo, setSubCategoryTwo] = useState("");

  const [tagFetching, setTagFetching] = useState(false);

  const resetAllVariables = () => {
    setPrice(0);

    setStartTime("");
    setEndTime("");

    setFetchingSimilarProducts(false);

    setSimilarProducts([]);
    setCategory("");
    setTags([]);
    setListType("dispose");
    setSubCategoryOne("");
    setSubCategoryTwo("");
    setCurrentPhotoType("main");
    setUploadedImages({
      main: null,
      brandTag: null,
    });
  };

  const [activeResultIndex, setActiveResultIndex] = useState(0);

  const [uploadedImages, setUploadedImages] = useState({
    main: null,
    brandTag: null,
  });

  const [listings, setListings] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);

  const [imageUploading, setImageUploading] = useState(false);

  const [currentPhotoType, setCurrentPhotoType] = useState("main");

  //

  useEffect(() => {
    setStartTime(moment().format("HH:mm:ss"));
  }, []);

  const [showCamera, setShowCamera] = useState(false); // Control the visibility of the camera

  const onCapture = async (e) => {
    const imageSrc = e;
    if (imageSrc) {
      const file = dataURLtoFile(imageSrc, `${currentPhotoType}.jpg`);

      // Set loading to true while uploading
      setImageUploading(true);

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
            fetchSimilarProducts();

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
        setImageUploading(false);
      }
    } else if (currentPhotoType === "brandTag") {
      setShowCamera(false); // Hide the camera
      setStep(2); // Move to the next step
      fetchSimilarProducts();

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

  const dataURLtoFile = (dataurl, filename) => {
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

  const fetchSimilarProducts = async () => {
    setFetchingSimilarProducts(true);
    try {
      const url = `/api/getSimilarProducts?url=${uploadedImages.main.url}`;

      const response = await fetch(url);
      setFetchingSimilarProducts(false);
      if (response.ok) {
        const data = await response.json();
        setSimilarProducts(data);
      } else {
        console.error(
          "Failed to fetch similar products:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      setFetchingSimilarProducts(false);
      console.error(
        "An error occurred while fetching similar products:",
        error
      );
    }
  };

  const uploadListingOrPrintSKU = async () => {
    setUploading(true);
    let JSON = {
      type: "admin",
      list_type: listType,
      tags: uploadedImages.tags,
      mainImage: uploadedImages.main.url,
    };

    if (uploadedImages.brandTag && uploadedImages.brandTag.url) {
      JSON.brandImage = uploadedImages.brandTag.url;
    }

    const newListing = listings;
    newListing.push(JSON);

    setListings(newListing);

    try {
      const response = await axios.post("/api/add-listing", { listing: JSON });
      const result = response.data;

      const newListing = listings;
      newListing.push(result);

      setListings(newListing);

      resetAllVariables();

      setStep(3);

      NotificationManager.success("Listing added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // This function will send the image to the server-side endpoint for processing.
  const getTagsFromGoogleVision = async (base64Image, imageType) => {
    setTagFetching(true);
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
      setTagFetching(false);
      const data = await response.json();
      if (data && data.tags) {
        return data.tags;
      } else {
        console.error("Error fetching tags:", data.error);
        return [];
      }
    } catch (error) {
      setTagFetching(false);
      console.error("Failed to get tags:", error);
      return [];
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // split to get only Base64 value
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAdminUploadAll = async () => {
    setStep(4);
  };

  const handleUploadAll = async () => {
    setUploading(true);

    const convertedListings = await Promise.all(
      listings.map(async (listing) => {
        const mainImageUrl = listing.items.main.image;
        const brandImageUrl = listing.items.brandTag
          ? listing.items.brandTag.image
          : null;

        return {
          type: "simple",
          mainImage: mainImageUrl,
          brandImage: brandImageUrl,
          category: category,
          subCategoryOne: subCategoryOne,
          subCategoryTwo: subCategoryTwo,
          tags: listing.tags,
        };
      })
    );

    try {
      const requests = convertedListings.map((listing) =>
        axios.post("/api/add-listing", { listing })
      );

      const responses = await axios.all(requests);
      const results = responses.map((response) => response.data);

      onFecth();
      NotificationManager.success("Listing added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      onBack();
    }
  };

  const openCameraForAdmin = () => {
    setShowCamera(true);
  };

  const viewProduct = (link) => {
    window.open(link, "blank");
  };

  const downloadCustomerQRCode = () => {
    const canvas = document.querySelector("#customer-qrcode");

    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "customer-qrcode.png";
      link.click();
    }
  };

  const downloadAdminQRCode = () => {
    const canvas = document.querySelector("#admin-qrcode");

    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "admin-qrcode.png";
      link.click();
    }
  };

  return (
    <div className="">
      {!uploading ? (
        <>
          {step === 1 ? (
            <div className="sm:w-96 mx-auto">
              <div className="sm:w-96 mx-auto">
                <label className="text-lg">Category</label>
                <select
                  value={category}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Hats">Hats</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>

              <div className=" flex items-center mt-5">
                <label className="text-lg">Default price suggestion %</label>
                <div className="relative w-32 flex items-center ml-3">
                  <h3 className="absolute text-base right-8 mt-1">%</h3>
                  <input
                    value={defaultPriceSuggestion}
                    type="number"
                    className="w-32 mt-1 rounded-xl px-3  py-2 border border-gray-600"
                    onChange={(e) => setDefaultPriceSuggestion(e.target.value)}
                  />
                </div>
              </div>

              <div className="mx-auto">
                <h3 className="text-2xl text-center font-semibold mt-8 mb-2">
                  Start Listing!
                </h3>
                <div className="border border-gray-500 rounded-xl w-72 mx-auto px-4 py-3">
                  <h3 className="text-xl font-semibold">Instructions</h3>

                  <ul className=" list-decimal ml-4 text-lg">
                    <li>Photo of the front</li>
                    <li>Photo of the item tag</li>
                    <li>Add to the appropriate pile</li>
                  </ul>
                </div>
                <div className="flex justify-center mt-8 rounded-2xl gap-2">
                  {showCamera ? (
                    <Capture
                      onCapture={onCapture}
                      loading={imageUploading}
                      skip={currentPhotoType === "main" ? false : true}
                      text={
                        currentPhotoType === "main" ? "Main Image" : "BrandTag"
                      }
                    />
                  ) : (
                    <div>
                      <div
                        onClick={() => openCameraForAdmin()}
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
                          onClick={() => handleAdminUploadAll()}
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
            </div>
          ) : (
            ""
          )}

          {step === 2 ? (
            <div className="px-5 mt-6 w-[480px] mx-auto">
              {/* <div className="flex flex-wrap items-center gap-3 justify-center mt-5">
                    <button
                      onClick={() => setListType("dispose")}
                      className={`${
                        listType === "dispose"
                          ? "bg-red-500 text-white"
                          : "bg-white"
                      } duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
                    >
                      Dispose
                    </button>
                    <button
                      onClick={() => setListType("list")}
                      className={`${
                        listType === "list"
                          ? "bg-green-500 text-white"
                          : "bg-white"
                      } duration-250 min-w-[100px] ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
                    >
                      List
                    </button>
                  </div> */}

              <div className="mt-6 mb-4">
                <div className="flex gap-4 flex-wrap justify-center items-center ">
                  {uploadedImages.main ? (
                    <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                      <div className="w-full flex items-center justify-center">
                        <img
                          src={uploadedImages.main.image}
                          alt={"Main Photo"}
                          className="rounded-xl max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* {isOptionToEdit ? (
                        <>
                          {!tagFetching ? (
                            <>
                              <EditTagsModalOffline
                                open={tagEditModal}
                                onClose={() => setTagEditModal(false)}
                                setTags={(e) => changeTagsAdmin(e)}
                                data={uploadedImages?.tags}
                              />
                              <button
                                onClick={() => onManageTags()}
                                className="underline text-xl ml-3"
                              >
                                Manage Tags
                              </button>
                            </>
                          ) : (
                            <LoadingComponent size="sm" />
                          )}
                        </>
                      ) : (
                        ""
                      )} */}
                </div>

                <div className="mt-6">
                  <div className="flex items-center">
                    <h3 className="!text-2xl">Similar Online Listings: </h3>
                  </div>

                  {!fetchingSimilarProducts ? (
                    <div className="mt-3 flex overflow-x-auto">
                      {similarProducts.map((row, key) => (
                        <div
                          key={key}
                          className="mx-2 w-48 cursor-pointer"
                          onClick={() => {
                            setActiveResultIndex(key);

                            setPrice(
                              (
                                Math.round(
                                  (row.price
                                    ? row.price +
                                      (row.price * defaultPriceSuggestion) / 100
                                    : 0) * 100
                                ) / 100
                              ).toFixed(2)
                            );
                          }}
                        >
                          <div
                            className={`${
                              activeResultIndex === key
                                ? "border-[3px] border-green-600"
                                : "border-2 border-primary"
                            } flex items-center justify-center rounded-2xl px-4 py-5 !w-48 !h-48 flex-shrink-0 my-1 relative`}
                          >
                            <img
                              src={row.image}
                              alt={"Main Photo"}
                              className="rounded max-w-full max-h-full"
                            />
                          </div>
                          <div
                            key={key}
                            className="mt-2 mx-1 w-full"
                          >
                            <h3 className="text-2xl text-center truncate">
                              {row.name}
                            </h3>
                            <h3 className="text-2xl text-center">
                              {row.price ? "$" + row.price : "No price"}
                            </h3>
                            <div className="flex justify-center">
                              <button
                                onClick={() => viewProduct(row.link)}
                                className="underline text-2xl"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <LoadingComponent size="sm" />
                  )}
                </div>
              </div>

              <div className="flex mx-1 justify-between">
                <div>
                  {/* <div className="mt-3">
                        <label className="block text-gray-600 text-xl mb-2">
                          Default price suggestion
                        </label>
                        <div className="relative flex items-center">
                          <h3 className="absolute text-4xl left-3 mt-1">$</h3>
                          <input
                            value={defaultPrice}
                            type="number"
                            className="w-48 mt-1 !text-4xl rounded-2xl pl-10 pr-2  !py-3 border-4 border-gray-400"
                            onChange={(e) => setDefaultPrice(e.target.value)}
                          />
                        </div>
                      </div> */}

                  <div className="">
                    <label className="block text-gray-600 text-3xl mb-2">
                      % Off
                    </label>
                    <div className="relative w-32 flex items-center">
                      <h3 className="absolute text-4xl right-8 mt-1">%</h3>
                      <input
                        value={defaultPriceSuggestion}
                        type="number"
                        className="w-48 mt-1 !text-4xl rounded-2xl pl-4 pr-2  !py-3 border-4 border-gray-400"
                        onChange={(e) =>
                          setDefaultPriceSuggestion(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-600 text-3xl mb-2">
                      Your Price
                    </label>
                    <div className="relative flex items-center">
                      <h3 className="absolute text-4xl left-3 mt-1">$</h3>
                      <input
                        value={price}
                        type="number"
                        className="w-48 mt-1 !text-4xl rounded-2xl pl-10 pr-2  !py-3 border-4 border-gray-400"
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <button
                    onClick={() =>
                      setDefaultPriceSuggestion(
                        Number(Number(defaultPriceSuggestion) + 5)
                      )
                    }
                    className="border-4 p-1 border-gray-400 rounded-2xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-24 h-24 text-green-500"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setDefaultPriceSuggestion(
                        Number(Number(defaultPriceSuggestion) - 5)
                      )
                    }
                    className="border-4 p-1 border-gray-400 rounded-2xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-24 h-24 text-red-500"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => uploadListingOrPrintSKU()}
                  className={` hover:bg-red-500 hover:text-white duration-300 min-w-[100px] ease-in-out  rounded px-10 text-xl py-2.5  border border-gray-300`}
                >
                  Dispose
                </button>
                <button
                  onClick={() => uploadListingOrPrintSKU()}
                  className={` hover:bg-green-500 hover:text-white duration-300 min-w-[100px] ease-in-out rounded px-10 text-xl py-2.5  border border-gray-300`}
                >
                  Sell
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {step === 3 && (
            <div className="mt-5">
              <div className="flex justify-center">
                <div className="border-[5px] border-gray-700 rounded-3xl px-8 py-2">
                  <h3 className="text-5xl font-normal text-gray-700">
                    Our Price: $8.99
                  </h3>
                </div>
              </div>
              <h3 className="text-center text-lg italic text-gray-600">
                {" "}
                Check FashionPal for the updated price
              </h3>
              <div className="flex items-center justify-center mt-5">
                <div className="w-[260px] mr-20">
                  <h3 className="text-2xl text-center">
                    Follow us on FashionPal
                  </h3>
                  <QRCode
                    id="customer-qrcode" // Set a unique id for this QR code
                    value={`https://fashionpal.vercel.app/store/KalisKloset-${
                      listings[listings.length - 1]?.id
                    }`}
                    logoImage={
                      "https://afmipzwmfcoduhcmwowr.supabase.co/storage/v1/object/public/listings/fav.jpg"
                    }
                    enableCORS={true}
                    size="250"
                    qrStyle="dots"
                    bgColor="#FFFFFF"
                    fgColor="#808080"
                    eyeColor="#FF5733"
                  />

                  <div className="flex justify-center">
                    <button
                      className="underline text-lg"
                      onClick={downloadCustomerQRCode}
                    >
                      Download QR Code (Customer)
                    </button>
                  </div>
                </div>

                <div className="w-[260px]">
                  <h3 className="text-2xl text-center">Product SKU</h3>
                  <QRCode
                    id="admin-qrcode" // Set a unique id for this QR code
                    value={`https://fashionpal.vercel.app/store/KalisKloset`}
                    logoImage={
                      "https://afmipzwmfcoduhcmwowr.supabase.co/storage/v1/object/public/listings/fav.jpg"
                    }
                    enableCORS={true}
                    size="250"
                    bgColor="#FFFFFF"
                    fgColor="#808080"
                    eyeColor="#FF5733"
                  />

                  <div className="flex justify-center">
                    <button
                      className="underline text-lg"
                      onClick={downloadAdminQRCode}
                    >
                      Download QR Code (Admin)
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center  mt-1">
                <ButtonComponent
                  rounded
                  className="!w-48 mt-6"
                  onClick={() => setStep(1)}
                >
                  List
                </ButtonComponent>
              </div>
            </div>
          )}

          {step === 4 ? (
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
                          {
                            listings.filter((x) => x.list_type === "list")
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
      ) : (
        <div className="mt-16">
          <LoadingComponent size="xl" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;