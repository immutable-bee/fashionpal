import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import Image from "next/image";
import axios from "axios";
import ButtonComponent from "@/components/utility/Button";
import LoadingComponent from "@/components/utility/loading";
import TagsInput from "react-tagsinput";
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";
import cloneDeep from "lodash.clonedeep";
import EditTagsModalOffline from "@/components/utility/EditTagsModalOffline";
import ListingItem from "@/components/utility/ListingItem";

import "react-tagsinput/react-tagsinput.css";

function SimpleListingForm({ onBack, onFecth }) {
  const [tagFetching, setTagFetching] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategoryOne, setSubCategoryOne] = useState("");
  const [subCategoryTwo, setSubCategoryTwo] = useState("");

  const subCategoryClothingOptions = [
    { name: "Men's Wear", value: "mens_wear" },
    { name: "Women's Wear", value: "womens_wear" },
    { name: "Kid's Wear", value: "kids_wear" },
    { name: "Activewear", value: "activewear" },
    { name: "Formal Wear", value: "formal_wear" },
  ];
  const subCategoryFootwearOptions = [
    { name: "Running Shoes", value: "running_shoes" },
    { name: "Sandals", value: "sandals" },
    { name: "Boots", value: "boots" },
    { name: "Formal Shoes", value: "formal_shoes" },
    { name: "Heels", value: "heels" },
  ];
  const subCategoryHatsOptions = [
    { name: "Baseball Caps", value: "baseball_caps" },
    { name: "Beanies", value: "beanies" },
    { name: "Fedora", value: "fedora" },
    { name: "Sun Hats", value: "sun_hats" },
    { name: "Berets", value: "berets" },
  ];

  const subCategoryTwoClothingOptions = [
    { name: "Winter Collection", value: "winter_collection" },
    { name: "Summer Collection", value: "summer_collection" },
    { name: "Fall Collection", value: "fall_collection" },
  ];
  const subCategoryTwoFootwearOptions = [
    { name: "Sneakers Edition", value: "sneakers_edition" },
    { name: "Formal Edition", value: "formal_edition" },
    { name: "Limited Edition", value: "limited_edition" },
  ];
  const subCategoryTwoHatsOptions = [
    { name: "Vintage Hats", value: "vintage_hats" },
    { name: "Modern Caps", value: "modern_caps" },
    { name: "Special Edition", value: "special_edition" },
  ];

  const [image, setImage] = useState({ url: null, file: null });
  const [uploadedImages, setUploadedImages] = useState({
    main: null,
    brandTag: null,
  });
  const [listings, setListings] = useState([]);
  const [activeTagEditModal, setActiveTagEditModal] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [editGeneratedTags, setEditGeneratedTags] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);

  // Computed
  const computedSubCategoryOneOptions = () => {
    if (category === "Hats") {
      return subCategoryHatsOptions;
    } else if (category === "Clothing") {
      return subCategoryClothingOptions;
    } else if (category === "Footwear") {
      return subCategoryFootwearOptions;
    }
    return []; // or some default value
  };

  const computedSubCategoryTwoOptions = () => {
    if (category === "Hats") {
      return subCategoryTwoHatsOptions;
    } else if (category === "Clothing") {
      return subCategoryTwoClothingOptions;
    } else if (category === "Footwear") {
      return subCategoryTwoFootwearOptions;
    }
    return []; // or some default value
  };

  // Methods
  const uploadMainOrBrandTagPhoto = async (e) => {
    const file = e.target.files[0];
    setPhotoUploading(true);

    try {
      const mainImageBase64 = await convertFileToBase64(file);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: step === 2 ? "mainImage" : "brandImage", //
          image: mainImageBase64,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setImage({ url: data.url, file: file });
        if (step === 1) {
          setStep(2);
        }
      } else {
        // Handle the case when the upload was not successful
        console.error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Set loading back to false after the upload is complete
      setPhotoUploading(false);
    }
  };

  const deleteMainOrBrandTagPhoto = (e) => {
    setImage({ url: null, file: null });
  };

  const onAddPhoto = (key) => {
    if (image.url && key) {
      let newUploadedImages = uploadedImages;
      newUploadedImages[key] = {
        image: image.url,
        file: image.file,
        type: image.type,
      };
      setUploadedImages(newUploadedImages);
      setImage({ url: null, file: null });
      setStep(step === 2 ? 3 : 4);
    }
  };

  const triggerEditTagsModalOffline = (index) => {
    setActiveTagEditModal(true);
    setActiveTagIndex(index);
  };

  const deleteMainOrBrandTagPhotoFromUploadedImages = (key) => {
    let newUploadedImages = cloneDeep(uploadedImages);

    newUploadedImages[key] = null;

    setUploadedImages(newUploadedImages);
    if (key === "main") {
      setStep(2);
    }
  };

  const onListMore = () => {
    const newListing = listings;
    newListing.push({
      tags: [],
      items: uploadedImages,
    });

    setListings(newListing);
    setUploadedImages({
      main: null,
      brandTag: null,
    });
    setStep(1);
  };

  const onFinishListing = () => {
    const newListing = listings;
    newListing.push({
      tags: [],
      items: uploadedImages,
    });

    setListings(newListing);
    setUploadedImages({
      main: null,
      brandTag: null,
    });
    setStep(5);
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

  const triggerToTagsScreen = async () => {
    setTagFetching(true);
    const requests = [];

    for (let listing of listings) {
      if (listing.items.main && listing.items.main.image) {
        const mainImageBase64 = listing.items.main.image;

        await requests.push(getTagsFromGoogleVision(mainImageBase64, "main"));
      }

      if (listing.items.brandTag && listing.items.brandTag.image) {
        const brandTagImageBase64 = listing.items.brandTag.image;

        await requests.push(
          getTagsFromGoogleVision(brandTagImageBase64, "brandTag")
        );
      }
    }

    const responses = await axios.all(requests);

    setListings((prevListings) => {
      let responseIndex = 0;
      const updatedListings = prevListings.map((listing) => {
        // Merge tags from 'main' and 'brandTag' (if present).
        listing.tags = [...responses[responseIndex]];

        responseIndex++;

        if (listing.items.brandTag && listing.items.brandTag.image) {
          listing.tags = [...listing.tags, ...responses[responseIndex]];

          responseIndex++;
        }

        return listing;
      });

      return updatedListings;
    });

    setTagFetching(false);

    // Execute the additional logic after updating the tags:
    if (editGeneratedTags) {
      setStep(6);
    } else {
      onUploadAll();
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // split to get only Base64 value
      reader.onerror = (error) => reject(error);
    });
  };

  const onUploadAll = async () => {
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

      await axios.all(requests);

      onFecth();
      NotificationManager.success("Listing added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      onBack();
    }
  };

  const onTagsEdited = (listingIndex, newTags) => {
    const newListing = [...listings];
    newListing[listingIndex].tags = newTags;
    setListings(newListing);
  };

  function onSetTags(newTags, listingIndex) {
    // Since newTags is already the array of updated tags
    const updatedTags = newTags;

    // Create a copy of listings and update the specific listing's tags
    const updatedListings = [...listings];
    updatedListings[listingIndex].tags = updatedTags;

    // Update the listings state (assuming you have a setState method for listings)
    setListings(updatedListings);
  }

  return (
    <div className="">
      <>
        {[1, 2, 3, 4].includes(step) ? (
          <div className=" mx-auto">
            {!image.url && [1, 2, 3].includes(step) ? (
              <div className="flex justify-center mt-8 rounded-2xl mx-auto gap-2">
                {!photoUploading ? (
                  <label className="rounded-2xl px-2   cursor-pointer hover:opacity-70 flex items-center justify-center w-56 border-2 shadow-md h-56">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="sr-only"
                        onChange={(e) => uploadMainOrBrandTagPhoto(e)}
                      />
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
                  </label>
                ) : (
                  <LoadingComponent size="xl" />
                )}
              </div>
            ) : (
              ""
            )}
            {step !== 1 && step !== 4 ? (
              <>
                {image.url ? (
                  <div className="mt-8 mx-auto border-2 border-primary rounded-2xl px-4 py-10 w-64 relative">
                    <Image
                      src={image.url}
                      alt="Uploaded preview"
                      width={250}
                      height={250}
                      className="rounded w-full"
                    />
                    <DeleteModalComponent
                      title="Are you sure you want to delete image?"
                      onConfirmed={() => deleteMainOrBrandTagPhoto()}
                    >
                      <button className="mt-4 bg-red-600 hover:bg-opacity-90 text-white font-bold py-1.5 absolute -top-2 right-2 z-10 px-1.5 rounded">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </DeleteModalComponent>
                  </div>
                ) : (
                  ""
                )}
                <div className="mt-4">
                  {step === 2 ? (
                    <ButtonComponent
                      full
                      onClick={() => onAddPhoto("main")}
                      className={`!my-2 mx-auto !w-64 rounded-lg  !text-black`}
                    >
                      Main Photo
                    </ButtonComponent>
                  ) : (
                    ""
                  )}
                  {step === 3 ? (
                    <>
                      <ButtonComponent
                        disabled={!image.url}
                        full
                        onClick={() => onAddPhoto("brandTag")}
                        className={`!my-2 mx-auto !w-64 rounded-lg !bg-green-600 !text-black`}
                      >
                        Brand Tag Photo
                      </ButtonComponent>
                      <ButtonComponent
                        color="light"
                        full
                        onClick={() => setStep(4)}
                        className={`!my-2 mx-auto !w-64 rounded-lg !text-black`}
                      >
                        Skip Brand Tag
                      </ButtonComponent>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}

            {step === 4 ? (
              <>
                <div className="flex flex-wrap justify-center gap-3  mb-4">
                  {uploadedImages.main ? (
                    <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src={uploadedImages.main.image}
                          alt={"Main Photo"}
                          width={250}
                          height={250}
                          className="rounded max-w-full max-h-full"
                        />
                      </div>

                      <DeleteModalComponent
                        title="Are you sure you want to delete image?"
                        onConfirmed={() =>
                          deleteMainOrBrandTagPhotoFromUploadedImages("main")
                        }
                      >
                        <button className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-4 h-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </DeleteModalComponent>
                    </div>
                  ) : (
                    ""
                  )}
                  {uploadedImages.brandTag ? (
                    <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src={uploadedImages.brandTag.image}
                          alt={"Brand Tag Photo"}
                          width={250}
                          height={250}
                          className="rounded max-w-full max-h-full"
                        />
                      </div>

                      <DeleteModalComponent
                        title="Are you sure you want to delete image?"
                        onConfirmed={() =>
                          deleteMainOrBrandTagPhotoFromUploadedImages(
                            "brandTag"
                          )
                        }
                      >
                        <button className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-4 h-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </DeleteModalComponent>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="w-64 mx-auto">
                  <label>Category</label>
                  <select
                    value={category}
                    className="w-full mt-1 rounded-xl px-3 py-3 border border-gray-600"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select type
                    </option>
                    <option value="Clothing">Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Hats">Hats</option>
                  </select>
                </div>
                {/* Sub-category 01 */}
                <div className="w-64 mx-auto mt-4">
                  <label>Sub-category 01</label>
                  <select
                    value={subCategoryOne}
                    className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                    onChange={(e) => setSubCategoryOne(e.target.value)}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select sub-category 01
                    </option>
                    {computedSubCategoryOneOptions().map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-category 02 */}
                <div className="w-64 !mb-6 mx-auto mt-4">
                  <label>Sub-category 02</label>
                  <select
                    value={subCategoryTwo}
                    className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                    onChange={(e) => setSubCategoryTwo(e.target.value)}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select sub-category 02
                    </option>
                    {computedSubCategoryTwoOptions().map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <ButtonComponent
                  color="secondary"
                  full
                  onClick={() => onListMore()}
                  className={`!my-2 mx-auto !w-64 rounded-lg !bg-green-600 !text-black`}
                >
                  List More
                </ButtonComponent>
                <ButtonComponent
                  full
                  onClick={() => onFinishListing()}
                  className={`!my-2 mx-auto !w-64 rounded-lg !text-black`}
                >
                  Finish Listing
                </ButtonComponent>
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {step === 5 ? (
          <div className="px-5 mt-6 w-full">
            <div className="">
              {listings.map((row, rowIndex) => (
                <>
                  <div
                    key={rowIndex}
                    className="flex flex-wrap justify-center sm:justify-start"
                  >
                    {row.items.main ? (
                      <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                        <div className="w-full flex items-center justify-center">
                          <Image
                            src={row.items.main.image}
                            alt={"Main Photo"}
                            width={250}
                            height={250}
                            className="rounded max-w-full max-h-full"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {row.items.brandTag ? (
                      <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                        <div className="w-full flex items-center justify-center">
                          <Image
                            src={row.items.brandTag.image}
                            alt={"Brand Tag Photo"}
                            width={250}
                            height={250}
                            className="rounded max-w-full max-h-full"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ))}
            </div>

            {listings.length > 0 ? (
              <div className="mt-10 ml-3">
                <div className="flex justify-center sm:justify-start mt-1">
                  <label className="relative mb-4 flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={editGeneratedTags}
                      onChange={() => setEditGeneratedTags(!editGeneratedTags)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Edit generated tags?
                    </span>
                  </label>
                </div>
                <div className="flex justify-center sm:justify-start mt-1">
                  <ButtonComponent
                    rounded
                    loading={tagFetching}
                    className="!w-48"
                    onClick={() => triggerToTagsScreen()}
                  >
                    Generate Tags
                  </ButtonComponent>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {step === 6 ? (
          <div>
            {listings.map((row, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-center sm:justify-start">
                  {row.items.main ? (
                    <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src={row.items.main.image}
                          alt={"Main Photo"}
                          width={250}
                          height={250}
                          className="rounded max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {row.items.brandTag ? (
                    <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src={row.items.brandTag.image}
                          alt={"Brand Tag Photo"}
                          width={250}
                          height={250}
                          className="rounded max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-6 mb-5">
                  <TagsInput
                    value={row.tags}
                    onChange={(e) => onSetTags(e, index)}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center sm:justify-start mt-1">
              <ButtonComponent
                rounded
                className="!w-48 !mt-6"
                onClick={() => setStep(7)}
              >
                Review All
              </ButtonComponent>
            </div>
          </div>
        ) : (
          ""
        )}
        {step === 7 ? (
          <>
            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center hidden">
              {listings.map((row, key) => {
                return (
                  <ListingItem
                    key={key}
                    mainPhoto={row.items?.main?.image}
                    brandPhoto={row.items?.brandTag?.image}
                    status={row.status}
                  >
                    <button
                      onClick={() => triggerEditTagsModalOffline(key)}
                      className=" bg-lightprimary px-3 py-1 text-xs mt-1 rounded"
                    >
                      Edit Tags
                    </button>
                  </ListingItem>
                );
              })}
            </div>
            <div className="flex justify-center sm:justify-start mt-1">
              <ButtonComponent
                rounded
                className="!w-48 mt-6"
                loading={uploading}
                onClick={onUploadAll}
              >
                Upload All
              </ButtonComponent>
            </div>
          </>
        ) : (
          ""
        )}
        <EditTagsModalOffline
          open={activeTagEditModal}
          onClose={() => setActiveTagEditModal(false)}
          setTags={(e) => onTagsEdited(activeTagIndex, e)}
          data={listings[activeTagIndex] && listings[activeTagIndex].tags}
        />
      </>
    </div>
  );
}

export default SimpleListingForm;
