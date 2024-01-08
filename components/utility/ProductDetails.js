import { useState, useEffect } from "react";
import Image from "next/image";
import ModalComponent from "@/components/utility/Modal";
import { NotificationManager } from "react-notifications";
import Link from "next/link";
import placeholder from "@/public/images/icon.jpg";
import ButtonComponent from "@/components/utility/Button";
import moment from "moment";

import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
} from "react-share";
function ProductDetails({
  open,
  onClose,
  data,
  fetchListings,
  imageOnly = false,
}) {
  const [showAll, setShowAll] = useState(false);
  const tagsToDisplay = showAll ? data?.tags : data?.tags.slice(0, 3);

  const [saveLoading, setLoadingSave] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const onSave = async () => {
    if (saveLoading) {
      return;
    }

    setLoadingSave(true);

    try {
      const res = await fetch(`/api/edit-listing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data?.id,
          matches: !data.matches,
        }),
      });

      if (res.status === 200) {
        NotificationManager.success("Listing saved successfully!");
        fetchListings();
      } else {
        const errorMessage = await res.text();
        console.error(
          `edit failed with status: ${res.status}, message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("An error occurred while edit listing:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  const downloadImage = (imageUrl, fileName) => {
    setDownloading(true);
    fetch(imageUrl, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`
          );
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName || "downloaded_image";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationManager.success("Image downloaded!");
        setDownloading(false);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        setDownloading(false);
        // Handle error appropriately (e.g., show a message to the user)
      });
  };
  const triggerOpenShareModal = () => {
    setOpenShareModal(true);
  };
  const productUrl = data.mainImageUrl;

  const handleShare = (platform) => {
    switch (platform) {
      case "url":
        copyToClipboard();
        break;
      case "textMessage":
        window.location.href = `sms:?body=${encodeURIComponent(productUrl)}`;
        break;
      default:
        break;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        NotificationManager.success("URL copied to clipboard!");
      })
      .catch((err) => {
        NotificationManager.error("Failed to copy URL. Please copy manually.");
      });
  };

  const closeShareModal = () => {
    setOpenShareModal(false);
  };
  return (
    <div>
      {open ? (
        <ModalComponent
          open={open}
          title={imageOnly ? "Full view" : "Details"}
          onClose={() => onClose()}
          footer={
            <div className="flex justify-end w-full">
              <button
                className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
                onClick={() => onClose()}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="flex justify-center relative">
            {" "}
            {/* relative to position arrows absolutely */}
            {activeImage === 1 && (
              <button
                onClick={() => setActiveImage(0)}
                className="absolute text-3xl left-0 top-1/2 transform -translate-y-1/2"
              >
                ←
              </button>
            )}
            {activeImage === 0 ? (
              <Image
                src={data?.mainImageUrl || placeholder}
                className="rounded-lg w-full"
                width="150"
                height="150"
                alt=""
              />
            ) : (
              <Image
                src={data?.brandImageUrl || placeholder}
                className="rounded-lg w-full"
                width="150"
                height="150"
                alt=""
              />
            )}
            {data?.brandImage && data?.brandImage?.url && activeImage === 0 && (
              <button
                onClick={() => setActiveImage(1)}
                className="absolute text-3xl right-0 top-1/2 transform -translate-y-1/2"
              >
                →
              </button>
            )}
          </div>
          {openShareModal && (
            <ModalComponent
              open={openShareModal}
              title="Share image"
              onClose={closeShareModal}
              footer={
                <div className="flex justify-end w-full">
                  <button
                    className="bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
                    onClick={closeShareModal}
                  >
                    Close
                  </button>
                </div>
              }
            >
              <div className="flex flex-wrap gap-3">
                <FacebookShareButton url={productUrl}>
                  <FacebookIcon
                    size={80}
                    round
                  />
                </FacebookShareButton>
                <FacebookMessengerShareButton url={productUrl}>
                  <FacebookMessengerIcon
                    size={80}
                    round
                  />
                </FacebookMessengerShareButton>
                <TwitterShareButton url={productUrl}>
                  <TwitterIcon
                    size={80}
                    round
                  />
                </TwitterShareButton>

                <WhatsappShareButton url={productUrl}>
                  <WhatsappIcon
                    size={80}
                    round
                  />
                </WhatsappShareButton>

                <PinterestShareButton
                  url={productUrl}
                  media={data?.mainImageUrl}
                >
                  <PinterestIcon
                    size={80}
                    round
                  />
                </PinterestShareButton>

                <button
                  className="bg-pink-400 !m-0 w-20 h-20 rounded-full flex justify-center items-center"
                  onClick={() => handleShare("url")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-white"
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      stroke="none"
                      d="M0 0h24v24H0z"
                      fill="none"
                    />

                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h3m9 -9v-5a2 2 0 0 0 -2 -2h-2" />
                    <path d="M13 17v-1a1 1 0 0 1 1 -1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1 -1 1h-1m-3 0h-1a1 1 0 0 1 -1 -1v-1" />
                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                  </svg>
                </button>
                <button
                  className="bg-green-400 !m-0 w-20 h-20 rounded-full flex justify-center items-center"
                  onClick={() => handleShare("textMessage")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-white"
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      stroke="none"
                      d="M0 0h24v24H0z"
                      fill="none"
                    />

                    <path d="M8 9h8" />
                    <path d="M8 13h6" />
                    <path d="M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3 -3z" />
                  </svg>
                </button>
              </div>

              <h3 className="text-center text-xl">OR</h3>

              <div className="flex justify-center">
                <ButtonComponent
                  onClick={() => downloadImage(data.mainImageUrl)}
                  rounded
                  loading={downloading}
                  padding="none"
                  className="!px-3 sm:!px-7 !py-1.5"
                >
                  Download Image
                </ButtonComponent>
              </div>
            </ModalComponent>
          )}

          {!imageOnly ? (
            <div>
              <h3 className="text-xl">Item Tags</h3>
              {tagsToDisplay.map((tag, tagIndex) => (
                <div
                  key={tagIndex}
                  className={`text-gray-800 font-light ${
                    tagIndex % 2 === 0 ? "bg-lightprimary" : "bg-white"
                  } rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                >
                  <span className="w-1/2">{tag}</span>
                </div>
              ))}

              {!showAll && data?.tags.length > 3 && (
                <button
                  className=" bg-primary px-3 py-1 text-sm !mt-3 rounded-md text-white"
                  onClick={() => setShowAll(true)}
                >
                  View all
                </button>
              )}

              <div className="flex justify-center !mt-3">
                <svg
                  onClick={() => triggerOpenShareModal()}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-2 cursor-pointer"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                </svg>

                <button
                  onClick={() => onSave()}
                  className={`mx-2 ${
                    saveLoading ? "opacity-70 cursor-progress" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-12 h-12 ${
                      data.matches ? "stroke-[#E44A1F] " : ""
                    }`}
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      stroke="none"
                      d="M0 0h24v24H0z"
                      fill="none"
                    />

                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mt-5">
                <Image
                  src={data?.brandTagPhoto}
                  className="w-28 rounded-full"
                  width="150"
                  height="150"
                  alt=""
                />

                <div className="ml-4">
                  <h3 className="text-base font-light">FashionPal Inc.</h3>
                  <h3 className="text-base font-light">
                    Naseer Complex, Miani Road, Sukkur, Pakistan
                  </h3>
                  <a
                    href="mailto:ibrahim@justibrahim.com"
                    className="text-primary text-base font-light block hover:underline"
                  >
                    ibrahim@justibrahim.com
                  </a>
                  <a
                    href="https://fashionpal.vercel.app/"
                    className="text-primary text-base font-light block hover:underline"
                  >
                    https://fashionpal.vercel.app/
                  </a>
                </div>
              </div>

              <div className="flex justify-center !mt-3">
                <Link href={`/store/${data?.id}`}>
                  <button className="bg-primary text-white px-5 py-1.5 rounded-lg">
                    View store
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between w-full">
                <div>
                  {data.price && (
                    <h3 className="text-2xl font-semibold">${data.price}</h3>
                  )}

                  <div className="mt-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-award"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#000000"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        stroke="none"
                        d="M0 0h24v24H0z"
                        fill="none"
                      />
                      <path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
                      <path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" />
                      <path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />
                    </svg>
                  </div>
                  {/* <div className="mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-chess-queen-filled"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#000000"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path
                    d="M12 2a2 2 0 0 1 1.572 3.236l.793 1.983l1.702 -1.702a2.003 2.003 0 0 1 1.933 -2.517a2 2 0 0 1 .674 3.884l-1.69 9.295a1 1 0 0 1 -.865 .814l-.119 .007h-8a1 1 0 0 1 -.956 -.705l-.028 -.116l-1.69 -9.295a2 2 0 1 1 2.607 -1.367l1.701 1.702l.794 -1.983a2 2 0 0 1 1.572 -3.236z"
                    stroke-width="0"
                    fill="currentColor"
                  />
                  <path
                    d="M18 18h-12a1 1 0 0 0 -1 1a2 2 0 0 0 2 2h10a2 2 0 0 0 1.987 -1.768l.011 -.174a1 1 0 0 0 -.998 -1.058z"
                    stroke-width="0"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-diamond"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#000000"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
                  <path d="M10 12l-2 -2.2l.6 -1" />
                </svg>
              </div>
              <div className="mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-discount-check"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#000000"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                  <path d="M9 12l2 2l4 -4" />
                </svg>
              </div>
              <div className="mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-square-rounded-letter-p"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#000000"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M10 12h2a2 2 0 1 0 0 -4h-2v8" />
                  <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                </svg>
              </div> */}
                  <div className="mt-3">
                    <h3 className="text-lg text-gray-800">{data.Barcode}</h3>
                  </div>
                </div>
                <h3 className="text-base text-gray-700">
                  {" "}
                  {moment(data.createdAt).fromNow()}
                </h3>
              </div>
              <div className="flex justify-center !mt-3">
                <svg
                  onClick={() => triggerOpenShareModal()}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-2 cursor-pointer"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                </svg>
              </div>
            </div>
          )}
        </ModalComponent>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProductDetails;
