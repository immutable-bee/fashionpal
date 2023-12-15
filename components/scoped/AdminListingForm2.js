import React, { useState, useEffect } from "react";

import ButtonComponent from "@/components/utility/Button";
import Capture from "@/components/utility/Capture";
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";

import LoadingComponent from "../utility/loading";
import { useRouter } from "next/router";

function AdminListingForm() {
  const router = useRouter();
  const [defaultPriceSuggestion, setDefaultPriceSuggestion] = useState(-10);
  const [listingQueue, setListingQueue] = useState([]);
  const [category, setCategory] = useState("");

  const [listings, setListings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [mainImage, setMainImage] = useState();
  const [brandImage, setBrandImage] = useState();
  const [brandImageSkipped, setBrandImageSkipped] = useState(false);

  const [pendingListingId, setPendingListingId] = useState();

  const skipBrandImage = () => {
    setBrandImageSkipped(true);
    setStep(4);
  };

  const [showCamera, setShowCamera] = useState(false); // Control the visibility of the camera

  const onCapture = async (e, type) => {
    const imageSrc = e;
    if (imageSrc) {
      if (type === "main") {
        setMainImage(imageSrc);
        setStep(2);
      } else if (type === "brandTag") {
        setBrandImage(imageSrc);
        setShowCamera(false);
      }
    }
  };

  const onNextListing = () => {
    setMainImage("");
    setBrandImage("");
    setCategory("");
    setStep(1);
  };

  const onBackListing = () => {
    setMainImage("");
    setBrandImage("");
    setCategory("");
    setStep(1);
  };

  const addToQueue = async (formData) => {
    const baseUrl = window.location.origin;
    formData.append("baseUrl", baseUrl);

    setLoading(true);

    try {
      const response = await fetch("/api/business/listing/addToQueue", {
        method: "POST",
        body: formData,
      });

      const { queuedListingId, data } = await response.json();
      setPendingListingId(queuedListingId);
      setLoading(false);

      setStep(5);
    } catch (error) {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (mainImage && (brandImage || brandImageSkipped)) {
  //     const formData = new FormData();
  //     const mainFile = convertDataURLtoFile(mainImage, "main.jpg");
  //     formData.append("mainImage", mainFile);

  //     if (brandImage) {
  //       const brandFile = convertDataURLtoFile(brandImage, "brand.jpg");
  //       formData.append("brandImage", brandFile);
  //     }

  //     addToQueue(formData);
  //   }
  // }, [mainImage, brandImage, brandImageSkipped]);

  const triggerAddToQueue = () => {
    if (mainImage && (brandImage || brandImageSkipped)) {
      onAdd();
      const formData = new FormData();
      const mainFile = convertDataURLtoFile(mainImage, "main.jpg");
      formData.append("mainImage", mainFile);

      if (brandImage) {
        const brandFile = convertDataURLtoFile(brandImage, "brand.jpg");
        formData.append("brandImage", brandFile);
      }

      addToQueue(formData);
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

  const onStop = async () => {
    setStep(4);
  };

  const onAdd = () => {
    const newListingQueue = listingQueue;
    const queueItem = {
      main: mainImage,
      brandTag: brandImage,
    };
    newListingQueue.push(queueItem);
    console.log(newListingQueue);
    setListingQueue(newListingQueue);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const computedCount = () => {
    return listingQueue.length + 1 < 10
      ? `00${listingQueue.length + 1}`
      : `${listingQueue.length + 1}`;
  };

  const redirectToQueue = () => {
    router.push("/business/listing-queue");
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
                    <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
                      #{computedCount()}
                    </div>
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
                            onCapture={(e) => onCapture(e, "main")}
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
                    {listingQueue.length > 0 && (
                      <div className="grid grid-cols-2 mt-4 mx-auto gap-3">
                        <button
                          onClick={() => setStep(6)}
                          className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                        >
                          Review List
                        </button>
                        <button
                          className="bg-green-400 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                          onClick={redirectToQueue}
                        >
                          Finish
                        </button>
                      </div>
                    )}
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
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{computedCount()}
            </div>

            {mainImage ? (
              <div className=" border-2 mx-auto mt-8 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                <div className="w-full flex items-center justify-center">
                  <img
                    src={mainImage}
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

            <div className="flex justify-center mt-8">
              <button
                className="bg-green-400 border border-green-600 rounded-xl w-full max-w-[250px] text-lg py-1.5"
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

              {/* <button className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                Review List
              </button> */}
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{computedCount()}
            </div>
            <div className="mt-8">
              {brandImage ? (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={brandImage}
                      alt={"brandTag Photo"}
                      width={250}
                      height={250}
                      className="rounded-xl max-w-full max-h-full"
                    />
                  </div>
                </div>
              ) : (
                <Capture
                  onCapture={(e) => onCapture(e, "brandTag")}
                  text={"Brand Tag"}
                />
              )}
            </div>

            <div className="flex justify-center mt-8 w-2/3 mx-auto gap-3">
              {!brandImage && (
                <button
                  className="bg-gray-300 w-1/2 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                  onClick={() => skipBrandImage()}
                >
                  Skip
                </button>
              )}
              <button
                className={`bg-green-400 w-1/2 border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5 ${
                  brandImage ? "" : "pointer-events-none bg-green-300"
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

              {/* <button className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5">
                Review List
              </button> */}
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{computedCount()}
            </div>
            <div
              className={`mt-8 grid gap-2 ${
                brandImage ? "grid-cols-2" : "grid-cosl-1"
              }`}
            >
              {mainImage ? (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={mainImage}
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
              {brandImage ? (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={brandImage}
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
                  onConfirmed={() => onBackListing()}
                >
                  <button
                    className={`bg-red-400 w-full border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5 ${
                      loading && "pointer-events-none opacity-70"
                    }`}
                  >
                    Cancel
                  </button>
                </DeleteModalComponent>
              </div>

              <button
                className={`bg-green-400 w-full border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5 ${
                  loading && "pointer-events-none opacity-70"
                }`}
                onClick={() => triggerAddToQueue()}
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
              <button
                onClick={() => setStep(6)}
                className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
              >
                Review List
              </button>
            </div>

            <div className="border-2 mx-auto mt-10 w-40 py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
              #{computedCount()}
            </div>
            <div
              className={`mt-8 grid gap-2 ${
                brandImage ? "grid-cols-2" : "grid-cosl-1"
              }`}
            >
              {mainImage && (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={mainImage}
                      alt={"Main Photo"}
                      width={250}
                      height={250}
                      className="rounded-xl max-w-full max-h-full"
                    />
                  </div>
                </div>
              )}
              {brandImage && (
                <div className=" border-2 mx-auto  border-primary rounded-2xl px-4 py-5  my-1 relative">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={brandImage}
                      alt={"brandTag Photo"}
                      width={250}
                      height={250}
                      className="rounded-xl max-w-full max-h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 mt-8 mx-auto gap-3">
              <button
                className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                onClick={redirectToQueue}
              >
                Finish
              </button>

              <button
                className={`bg-green-400 w-full border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5`}
                onClick={onNextListing}
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
            <div className="flex flex-wrap justify-center">
              {listingQueue.map((listing) => (
                <>
                  <div
                    className={`px-4 py-4 sm:!w-64 overflow-hidden border w-[calc(100%-15px)] relative rounded-3xl group [perspective:1000px]  my-2 `}
                  >
                    <div
                      class={`relative h-[255px] w-full rounded-xl transition-all duration-500 ease-in-out ${
                        listing.brandTag
                          ? "[transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-0">
                        <img
                          src={listing.main}
                          width={100}
                          height={100}
                          className="rounded-xl !w-full !h-64 object-cover"
                          alt=""
                        />
                      </div>
                      {listing.brandTag ? (
                        <div className="absolute inset-0 h-full w-full rounded-xl text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                          <img
                            src={listing.brandTag}
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

                    {/* <LoadingComponent
                      className="mt-6"
                      size="md"
                    /> */}
                  </div>
                </>
              ))}
            </div>

            <div className="grid grid-cols-2 mt-8 mx-auto gap-3 max-w-md">
              <button
                className="bg-gray-300 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                onClick={redirectToQueue}
              >
                Finish
              </button>

              <button
                className={`bg-green-400 w-full border border-green-600 hover:opacity-90 rounded-xl px-8 text-lg py-1.5`}
                onClick={onNextListing}
              >
                Next Listing
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    </div>
  );
}
export default AdminListingForm;
