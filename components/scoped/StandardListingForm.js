import { useState } from "react";
import ButtonComponent from "../utility/Button";
import LoadingComponent from "../utility/loading";
import Capture from "../utility/Capture";
import PrintBarcode from "../business/PrintBarcode";
import { NotificationManager } from "react-notifications";
import { Checkbox } from "@nextui-org/react";

const StandardListingForm = ({ onBack, onFecth }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState(5);

  const [mainImage, setMainImage] = useState();
  const [brandImage, setBrandImage] = useState();

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(5);

  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState("main");
  const [uploadFailed, setUploadFailed] = useState(false);

  const [newListingSku, setNewListingSku] = useState("");

  const resetListingForm = () => {
    setStep(1);
    setMainImage("");
    setBrandImage("");
    setCategory("");
    setPrice("");
    setNewListingSku("");
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const onCapture = async (e, type) => {
    const imageSrc = e;
    if (imageSrc) {
      if (type === "main") {
        setMainImage(imageSrc);
      } else if (type === "brandTag") {
        setBrandImage(imageSrc);
        setShowCamera(false);
        setStep(2);
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

  const pushListing = async (status) => {
    if (!price) {
      NotificationManager.error("price is required!");
      return;
    }
    console.log("Client Status: ", status);
    setUploadFailed(false);
    setLoading(true);

    const formData = new FormData();
    const mainFile = convertDataURLtoFile(mainImage, "main.jpg");
    formData.append("mainImage", mainFile);
    if (brandImage) {
      const brandFile = convertDataURLtoFile(brandImage, "brand.jpg");
      formData.append("brandImage", brandFile);
    }
    formData.append("price", price);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("defaultPrice", defaultPrice);
    formData.append("premium", isPremium);

    const response = await fetch("/api/business/listing/standard/add", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setUploadFailed(true);
      setLoading(false);
      return;
    }

    const newSku = await response.json();

    setNewListingSku(newSku);
    setLoading(false);
    setStep(3);
  };

  const skipBrandImage = () => {
    setStep(2);
  };
  const triggerToHomePage = () => {
    onFecth();
    onBack();
  };

  return (
    <div className="">
      <>
        {step === 1 && (
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

                    <div className="mt-5  mx-auto flex items-center justify-center  ">
                      <label className="block text-gray-600 text-xl ">
                        Default price
                      </label>
                      <div className="relative flex items-center justify-center ml-4">
                        <h3 className="absolute text-xl left-3 mt-1">$</h3>
                        <input
                          value={defaultPrice}
                          type="number"
                          className="w-36 mt-1 !text-xl rounded-xl pl-8 pr-2  !py-2.5 border-4 border-gray-400"
                          onChange={(e) => setDefaultPrice(e.target.value)}
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
                      <div className="flex  justify-center mt-8 rounded-2xl gap-2">
                        {showCamera ? (
                          !mainImage ? (
                            <Capture
                              onCapture={(e) => onCapture(e, "main")}
                              text="Main Image"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-5">
                              <Capture
                                onCapture={(e) => onCapture(e, "brandTag")}
                                text={"Brand Tag"}
                              />

                              <button
                                className="bg-gray-300 w-1/2 border border-gray-600 hover:opacity-90 rounded-xl px-4 text-lg py-1.5"
                                onClick={() => skipBrandImage()}
                              >
                                Skip
                              </button>
                            </div>
                          )
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
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
                      {mainImage ? (
                        <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
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
                    </div>
                  </div>
                  <div
                    id="onboarding-form-tc-row"
                    className="flex items-center justify-center mt-3"
                  >
                    <Checkbox
                      onChange={() => setIsPremium(!isPremium)}
                      id="onboarding-form-tc-checkbox"
                      className="mr-2"
                      size={"xl"}
                    ></Checkbox>
                    <h6
                      id="onboarding-form-tc-agree-text"
                      className="text-2xl"
                    >
                      Premium
                    </h6>
                  </div>

                  <div className="flex mx-1 justify-center w-full gap-5 mt-4">
                    <div className="mt-3 flex flex-col items-center  ">
                      <label className="block text-gray-600 text-3xl mb-2">
                        Your Price
                      </label>
                      <div className="relative flex items-center justify-center">
                        <h3 className="absolute text-4xl left-3 mt-1">$</h3>
                        <input
                          value={price}
                          type="number"
                          className="w-48 mt-1 !text-4xl rounded-2xl pl-10 pr-2  !py-3 border-4 border-gray-400"
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start ">
                      <button
                        onClick={() => setPrice(Number(Number(price) + 0.5))}
                        className="border-4 p-1 border-gray-400 rounded-2xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 h-10 text-green-500"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setPrice(Number(Number(price) - 0.5))}
                        className="border-4 p-1 mt-4 border-gray-400 rounded-2xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 h-10 text-red-500"
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
                  {uploadFailed && (
                    <div className="flex justify-center mt-5">
                      <h3>
                        An error occurred while adding your listing please try
                        again.
                      </h3>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => pushListing("DISPOSED")}
                      className={`hover:bg-red-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-red-500`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => pushListing("SALE")}
                      className={`hover:bg-green-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-green-500`}
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {step === 3 && (
          <div className="mt-5">
            <div className="flex justify-center">
              <div className="">
                <h3 className="text-xl sm:text-3xl  font-normal text-gray-700">
                  Your Listing has been added!
                </h3>
              </div>
            </div>

            {newListingSku ? (
              <>
                <PrintBarcode
                  sku={newListingSku}
                  price={price}
                />
              </>
            ) : (
              <LoadingComponent size={"xl"} />
            )}

            <div className="flex items-center justify-center mt-4">
              <div className="">
                <h3 className="text-2xl text-center">
                  Follow us on FashionPal
                </h3>
              </div>
            </div>

            <div className="flex justify-center gap-1 mt-1">
              <ButtonComponent
                rounded
                className="!w-48 mt-6"
                onClick={resetListingForm}
              >
                List More
              </ButtonComponent>
              <ButtonComponent
                rounded
                className="!w-48 mt-6"
                onClick={() => triggerToHomePage()}
              >
                Home page
              </ButtonComponent>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default StandardListingForm;
