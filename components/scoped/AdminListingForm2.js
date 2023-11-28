import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import ButtonComponent from "@/components/utility/Button";
import SimilarProducts from "@/components/scoped/SimilarProducts";
import Capture from "@/components/utility/Capture";
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";

import Image from "next/image";
import moment from "moment";
import LoadingComponent from "../utility/loading";

function AdminListingForm({ onFecth }) {
  const [price, setPrice] = useState(0);
  const [defaultPriceSuggestion, setDefaultPriceSuggestion] = useState(-10);
  const [startTime, setStartTime] = useState("");
  const [listingQueue, setListingQueue] = useState([]);
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("");
  const [count, setCount] = useState(1);
  const [tagFetching, setTagFetching] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({
    main: null,
    brandTag: null,
  });

  const [listings, setListings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState("main");

  const [mainImage, setMainImage] = useState();
  const [brandImage, setBrandImage] = useState();
  const [brandImageSkipped, setBrandImageSkipped] = useState(false);

  const [pendingListingId, setPendingListingId] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);

  const skipBrandImage = () => {
    setBrandImageSkipped(true);
    setStep(4);
  };

  useEffect(() => {
    setStartTime(moment().format("HH:mm:ss"));
  }, []);

  useEffect(() => {
    if (similarProducts.length > 0) {
      setPriceOnDiscount();
    }
  }, [defaultPriceSuggestion, similarProducts]);

  const [showCamera, setShowCamera] = useState(false); // Control the visibility of the camera

  const resetAllVariables = () => {
    setPrice(0);
    setStartTime("");
    setEndTime("");
    setCategory("");
    setCurrentPhotoType("main");
    setUploadedImages({
      main: null,
      brandTag: null,
    });
  };

  const onCaptureBrandTag = async (e) => {
    setUploadedImages({
      main: {
        image:
          "https://afmipzwmfcoduhcmwowr.supabase.co/storage/v1/object/public/listings/brandImage-1698842707957.png?t=2023-11-23T15:45:20.094Z",
      },
      brandTag: {
        image:
          "https://afmipzwmfcoduhcmwowr.supabase.co/storage/v1/object/public/listings/brandImage-1698842707957.png?t=2023-11-23T15:45:20.094Z",
      },
    });
  };

  const onCapture = async (e) => {
    setUploadedImages({
      main: {
        image:
          "https://afmipzwmfcoduhcmwowr.supabase.co/storage/v1/object/public/listings/brandImage-1698842707957.png?t=2023-11-23T15:45:20.094Z",
      },
      brandTag: null,
    });
    setStep(2);
  };

  // const onCapture = async (e) => {
  //   const imageSrc = e;
  //   if (imageSrc) {
  //     if (currentPhotoType === "main") {
  //       setMainImage(imageSrc);
  //       setCurrentPhotoType("brandTag");
  //     }

  //     if (currentPhotoType === "brandTag") {
  //       setBrandImage(imageSrc);
  //       setShowCamera(false);
  //     }

  //     //const file = convertDataURLtoFile(imageSrc, `${currentPhotoType}.jpg`);

  //     // Set loading to true while uploading
  //   }
  // };

  const setPriceOnDiscount = () => {
    const averagePrice = calulateAvgPrice();
    const adjustedPrice = averagePrice * (1 + defaultPriceSuggestion / 100);
    setPrice(parseFloat(adjustedPrice.toFixed(2)));
  };

  const calulateAvgPrice = () => {
    const total = similarProducts.reduce((sum, item) => {
      return sum + (item.extractedPrice || 0);
    }, 0);

    const average =
      similarProducts.length > 0
        ? parseFloat((total / similarProducts.length).toFixed(2))
        : 0;

    return average;
  };

  const addToQueue = async (formData) => {
    const baseUrl = window.location.origin;
    formData.append("baseUrl", baseUrl);

    setLoading(true);
    setImageUploading(true);
    try {
      const response = await fetch("/api/business/listing/addToQueue", {
        method: "POST",
        body: formData,
      });

      const { queuedListingId, data } = await response.json();
      setSimilarProducts(data);
      setPendingListingId(queuedListingId);
      setLoading(false);
      setImageUploading(false);
    } catch (error) {
      setLoading(false);
      setImageUploading(false);
    }
  };

  useEffect(() => {
    if (similarProducts.length > 0) {
      setStep(2);
    }
  }, [similarProducts]);

  useEffect(() => {
    if (similarProducts.length === 0) {
      if (mainImage && (brandImage || brandImageSkipped)) {
        const formData = new FormData();
        const mainFile = convertDataURLtoFile(mainImage, "main.jpg");
        formData.append("mainImage", mainFile);

        if (brandImage) {
          const brandFile = convertDataURLtoFile(brandImage, "brand.jpg");
          formData.append("brandImage", brandFile);
        }

        addToQueue(formData);
      }
    }
  }, [mainImage, brandImage, brandImageSkipped]);

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

  const onUploadAll = async () => {
    setUploading(true);
    let JSON = {
      type: "admin",
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

      NotificationManager.success("Listing added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setEndTime(moment().format("HH:mm:ss"));
      onFecth();

      resetAllVariables();

      //setStep(3);

      setUploading(false);
    }
  };

  const pushQueuedListing = async (status) => {
    setLoading(true);
    setUploading(true);

    const payload = {
      data: {
        id: pendingListingId,
        price: parseFloat(price),
        status: status,
      },
    };

    const response = await fetch("/api/business/listing/pushQueuedListing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }

    onFecth();
    resetAllVariables();
    setStep(3);
    setLoading(false);
    setUploading(false);

    return;
  };

  const onStop = async () => {
    setStep(4);
  };

  const onAdd = () => {
    const newListingQueue = listingQueue;
    newListingQueue.push(uploadedImages);
    console.log(newListingQueue);
    setListingQueue(newListingQueue);
    setStep(5);
  };

  const openCamera = () => {
    setShowCamera(true);
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

  const downloadQRCode = () => {
    const canvas = document.querySelector("#admin-qrcode");

    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "admin-qrcode.png";
      link.click();
    }
  };

  const onSelectSimilarProduct = (row) => {
    setPrice(
      (
        Math.round(
          (row.price
            ? row.price + (row.price * defaultPriceSuggestion) / 100
            : 0) * 100
        ) / 100
      ).toFixed(2)
    );
  };

  return (
    <div className="">
      <>
        {step === 1 ? (
          <div>
            {loading ? (
              <LoadingComponent
                className="mt-6"
                size="xl"
              />
            ) : (
              <div>
                <div>
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
                      <label className="text-lg">
                        Default price suggestion %
                      </label>
                      <div className="relative w-32 flex items-center ml-3">
                        <h3 className="absolute text-base right-8 mt-1">%</h3>
                        <input
                          value={defaultPriceSuggestion}
                          type="number"
                          className="w-32 mt-1 rounded-xl px-3  py-2 border border-gray-600"
                          onChange={(e) =>
                            setDefaultPriceSuggestion(e.target.value)
                          }
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
                            loading={loading}
                            skip={false}
                            text="Main Image"
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
                            {listings.length !== 0 ? (
                              <ButtonComponent
                                loading={uploading}
                                full
                                onClick={() => onStop()}
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
                </div>
              </div>
            )}
          </div>
        ) : (
          ""
        )}

        {step === 2 ? (
          <div className="sm:w-96 mx-auto">
            <div className="flex items-center justify-between">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
                onClick={() => setStep(1)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>

              <button className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                Review List
              </button>
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #
              {listingQueue.length + 1 < 10
                ? `00${listingQueue.length + 1}`
                : `${listingQueue.length + 1}`}
            </div>

            {uploadedImages.main ? (
              <div className=" border-2 mx-auto mt-8 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
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

            <div className="flex justify-end mt-8">
              <button
                className="bg-green-400 border border-green-600 rounded-xl px-8 text-lg py-1.5"
                onClick={() => setStep(3)}
              >
                Main
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 3 ? (
          <div className="sm:w-96 mx-auto">
            <div className="flex items-center justify-between">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
                onClick={() => setStep(2)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>

              <button className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                Review List
              </button>
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{count}
            </div>
            <div className="mt-8">
              {uploadedImages.brandTag ? (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={uploadedImages.brandTag.image}
                      alt={"brandTag Photo"}
                      width={250}
                      height={250}
                      className="rounded-xl max-w-full max-h-full"
                    />
                  </div>
                </div>
              ) : (
                <Capture
                  onCapture={onCaptureBrandTag}
                  loading={loading}
                  skip={true}
                  onSkip={skipBrandImage}
                  text={"Brand Tag"}
                />
              )}
            </div>

            <div className="flex justify-end mt-8 w-2/3 mx-auto gap-3">
              <button
                className="bg-gray-300 w-1/2 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                onClick={() => setStep(4)}
              >
                Skip
              </button>
              <button
                className={`bg-green-400 w-1/2 border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5 ${
                  uploadedImages.brandTag && uploadedImages.brandTag.image
                    ? ""
                    : "pointer-events-none bg-green-300"
                }`}
                onClick={() => setStep(4)}
              >
                Tag
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 4 ? (
          <div className="sm:w-96 mx-auto">
            <div className="flex items-center justify-between">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
                onClick={() => setStep(3)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>

              <button className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                Review List
              </button>
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{count}
            </div>
            <div
              className={`mt-8 grid gap-2 ${
                uploadedImages.brandTag ? "grid-cols-2" : "grid-cosl-1"
              }`}
            >
              {uploadedImages.main ? (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
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
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={uploadedImages.brandTag.image}
                      alt={"brandTag Photo"}
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

            <div className="grid grid-cols-2 mt-8 w-2/3 mx-auto gap-3">
              <div>
                <DeleteModalComponent
                  heading="Cancel confirmation"
                  title="Are you sure you want to cancel it?"
                  btnText="Cancel"
                  onConfirmed={() => setStep(1)}
                >
                  <button className="bg-red-400 w-full border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                    Cancel
                  </button>
                </DeleteModalComponent>
              </div>

              <button
                className={`bg-green-400 w-full border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5`}
                onClick={() => onAdd()}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 5 ? (
          <div className="sm:w-96 mx-auto">
            <div className="flex items-center justify-end">
              <button className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                Review List
              </button>
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{count}
            </div>
            <div
              className={`mt-8 grid gap-2 ${
                uploadedImages.brandTag ? "grid-cols-2" : "grid-cosl-1"
              }`}
            >
              {uploadedImages.main ? (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
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
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={uploadedImages.brandTag.image}
                      alt={"brandTag Photo"}
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

            <div className="grid grid-cols-2 mt-8 mx-auto gap-3">
              <button
                className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                onClick={() => setStep(6)}
              >
                Finish
              </button>

              <button
                className={`bg-green-400 w-full border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5`}
                onClick={() => setStep(1)}
              >
                Next Listing
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 6 ? (
          <div className="">
            <div className="flex flex-wrap">
              {listingQueue.map((listing) => (
                <>
                  <div
                    className={`px-4 py-4 sm:!w-64 overflow-hidden border w-[calc(100%-15px)] relative rounded-3xl group [perspective:1000px] mx-auto my-2 `}
                  >
                    <div
                      class={`relative h-[255px] w-full rounded-xl transition-all duration-500 ease-in-out ${
                        listing.brandTag && listing.brandTag.image
                          ? "[transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={listing.main.image}
                          width={100}
                          height={100}
                          className="rounded-xl !w-full !h-64 object-cover"
                          alt=""
                        />
                      </div>
                      {listing.brandTag && listing.brandTag.image ? (
                        <div className="absolute inset-0 h-full w-full rounded-xl text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                          <Image
                            src={listing.brandTag.image}
                            width={100}
                            height={100}
                            className="rounded-xl !w-full !h-64 object-cover"
                            alt=""
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <LoadingComponent
                      className="mt-6"
                      size="md"
                    />
                  </div>
                </>
              ))}
            </div>
            <div className="mt-8 ml-4">
              <button
                className={`bg-green-400 w-32 border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5`}
                onClick={() => setStep(7)}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {step === 7 ? (
          <div>
            {loading ? (
              <LoadingComponent
                className="mt-6"
                size="xl"
              />
            ) : (
              <div>
                <div className="px-5 mt-6 w-[480px] mx-auto">
                  <div className="mt-6 mb-4">
                    <div className="flex gap-4 flex-wrap justify-center items-center ">
                      {uploadedImages.main ? (
                        <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
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
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center">
                        <h3 className="!text-2xl">Similar Online Listings: </h3>
                      </div>
                      <SimilarProducts
                        onSelect={onSelectSimilarProduct}
                        similarProducts={similarProducts}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-3">
                    <h6 className="text-2xl">
                      Average Price: ${calulateAvgPrice()}
                    </h6>
                  </div>

                  <div className="flex mx-1 justify-between">
                    <div>
                      {}
                      <div className="">
                        <label className="block text-gray-600 text-3xl mb-2">
                          % Off
                        </label>
                        <div className="relative w-32 flex items-center">
                          <h3 className="absolute text-2xl right-8 mt-1">%</h3>
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
                          className="w-24 h-24 text-green-500"
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
                          className="w-24 h-24 text-red-500"
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

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => pushQueuedListing("DISPOSED")}
                      className={`${
                        tagFetching ? " pointer-events-none bg-gray-300" : ""
                      } hover:bg-red-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-red-500`}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={tagFetching}
                      onClick={() => pushQueuedListing("SALE")}
                      className={`${
                        tagFetching ? " pointer-events-none bg-gray-300" : ""
                      } hover:bg-green-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-green-500`}
                    >
                      Print
                    </button>
                  </div>

                  <div className="flex justify-center mt-5">
                    <button
                      className={`bg-green-400 w-72 border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-2`}
                      onClick={() => setStep(7)}
                    >
                      List all
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        {/* {step === 3 && (
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
                    onClick={downloadQRCode}
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
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        Disposed
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        Listed
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        Start time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        End time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4">
                        {
                          listings.filter((x) => x.list_type === "dispose")
                            .length
                        }
                      </td>
                      <td className="px-6 py-4">
                        {listings.filter((x) => x.list_type === "list").length}
                      </td>
                      <td className="px-6 py-4">{startTime}</td>
                      <td className="px-6 py-4">{endTime}</td>
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
        )} */}
      </>
    </div>
  );
}
export default AdminListingForm;
