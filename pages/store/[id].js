import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BackArrow from "../../assets/back-arrow.svg";
import BookStoreImage from "../../assets/bookstore-img.svg";
import Slidercomponent from "@/components/slidercomponent";
import { useRouter } from "next/router"; //

const Bookstoredetail = () => {
  const [bookstoresNearYou, setBookstoresNearYou] = useState([]);
  const router = useRouter();

  const handleBackClick = () => {
    // If there's more than one entry in the session history
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/customer");
    }
  };

  return (
    <div className=" bg-white h-screen px-5 w-screen overflow-hidden">
      <div className="pt-10">
        <h2 className="flex items-center">
          <svg
            onClick={handleBackClick}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-7 cursor-pointer hover:text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>

          <span className=" text-2xl font-semibold ml-3">Store Details</span>
        </h2>
      </div>

      <div className=" max-w-3xl w-full flex-wrap flex items-start justify-between">
        <div className="sm:!mt-3 !mt-4">
          <div className="flex pt-[6px]">
            <div className="pr-2">
              <Image
                width={102}
                height={102}
                src={BookStoreImage}
                alt="books_Image"
                className="!h-full !w-32"
              />
            </div>
            <div className="px-2">
              <h5 className="text-sm  my-1 font-semibold mb-0">
                Tamil Book Store
              </h5>
              <label className="text-sm font-semibold sm:my-2 text-gray-400 mb-0 my-2">
                Miani Road, sukkur, Pakistan
              </label>
              <a
                href="tel:(603)555-0123"
                className="flex text-sm text-sky-500 font-semibold my-1 mb-0 "
              >
                <div className="w-6 flex-shrink-0">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.47575 4.42L5.07946 1.65396C4.80321 1.33521 4.29675 1.33663 3.97588 1.65821L2.00529 3.63233C1.41879 4.21954 1.25092 5.0915 1.59021 5.79063C3.61719 9.98748 7.00191 13.3769 11.1959 15.4098C11.8943 15.7491 12.7656 15.5812 13.3521 14.994L15.3411 13.0015C15.6634 12.6792 15.6641 12.1699 15.3425 11.8936L12.5658 9.51008C12.2754 9.26075 11.8242 9.29333 11.5331 9.58517L10.5669 10.5528C10.5175 10.6046 10.4523 10.6388 10.3816 10.65C10.3108 10.6613 10.2383 10.649 10.1752 10.6151C8.59594 9.70565 7.28591 8.39391 6.37854 6.81346C6.34456 6.75024 6.33226 6.67762 6.34352 6.60674C6.35478 6.53585 6.38898 6.47062 6.44088 6.42104L7.40421 5.457C7.69604 5.16375 7.72792 4.71113 7.47575 4.42Z"
                      stroke="#2EAAED"
                      strokeWidth="1.41667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className=" mb-0">(603) 555-0123</span>
              </a>
              <a
                href="mailto:ibrahim@justibrahim.com"
                className="flex items-center text-sm text-sky-500 font-semibold my-1 mb-0 "
              >
                <div className="w-6 flex-shrink-0">
                  {" "}
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>

                <span className=" mb-0 font-semibold">
                  ibrahim@justibrahim.com
                </span>
              </a>

              <a
                href="//bookstoreseattle.com"
                className="font-normal flex text-sm text-sky-500 my-2 mb-0"
              >
                <div className="w-6 flex-shrink-0">
                  {" "}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.59369 6.40634C8.01349 5.82638 7.22672 5.50058 6.40636 5.50058C5.586 5.50058 4.79923 5.82638 4.21903 6.40634L2.03099 8.59367C1.45078 9.17388 1.12482 9.96082 1.12482 10.7814C1.12482 11.6019 1.45078 12.3888 2.03099 12.969C2.6112 13.5493 3.39813 13.8752 4.21867 13.8752C5.03922 13.8752 5.82615 13.5493 6.40636 12.969L7.50003 11.8754"
                      stroke="#2EAAED"
                      strokeWidth="1.41667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.40637 8.59366C6.98657 9.17362 7.77335 9.49942 8.5937 9.49942C9.41406 9.49942 10.2008 9.17362 10.781 8.59366L12.9691 6.40633C13.5493 5.82612 13.8753 5.03919 13.8753 4.21864C13.8753 3.3981 13.5493 2.61117 12.9691 2.03096C12.3889 1.45075 11.6019 1.12479 10.7814 1.12479C9.96085 1.12479 9.17392 1.45075 8.5937 2.03096L7.50004 3.12462"
                      stroke="#2EAAED"
                      strokeWidth="1.41667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className=" mb-0 font-semibold ">
                  bookstoreseattle.com
                </span>
              </a>
              <a
                href="bookstoreseattle.com"
                className="font-normal flex text-sm text-sky-500 my-2 mb-0"
              >
                <div className="w-6 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 -ml-0.5 stroke-sky-500"
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
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                </div>

                <span className=" mb-0 font-semibold ">12</span>
              </a>
            </div>
          </div>

          <div className="flex sm:justify-start justify-center !mt-8">
            <button className="bg-primary text-white px-8 py-1.5 rounded-lg">
              Follow
            </button>
          </div>
        </div>
      </div>

      <Slidercomponent storesNearYou={bookstoresNearYou} />
    </div>
  );
};

export default Bookstoredetail;
