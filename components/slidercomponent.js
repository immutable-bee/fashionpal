import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./slidercomponent.module.css";
import Image from "next/image";
import BookSVG from "../assets/book.svg";

import "swiper/css";
import { useState } from "react";
import Link from "next/link";

const Slidercomponent = ({ storesNearYou }) => {
  const [stores, setStores] = useState([]);

  const [listings, setListings] = useState([{}, {}, {}, {}, {}]);

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isLiked = !updatedListings[index].isLiked;
    updatedListings[index].isUnLiked = false;

    setListings(updatedListings);
  };

  const toggleUnLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isUnLiked = !updatedListings[index].isUnLiked;
    updatedListings[index].isLiked = false;

    setListings(updatedListings);
  };

  useEffect(() => {
    setStores(storesNearYou);
  }, [storesNearYou]);

  return (
    <div className=" mt-10">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-900 text-base">
          {listings.length + 1} Results found
        </p>
      </div>

      <Swiper
        breakpoints={{
          240: {
            slidesPerView: 1.8,
            centeredSlidesBounds: true,
          },
          768: {
            direction: "horizontal",
            slidesPerView: 4,
            spaceBetween: 14,
          },
          1200: {
            direction: "horizontal",
            slidesPerView: 7,
            spaceBetween: 14,
          },
        }}
        spaceBetween={14}
        navigation
      >
        {listings.map((row, key) => {
          return (
            <SwiperSlide
              key={key}
              className="border border-gray-300 h-96 rounded-xl p-[11px]"
            >
              <div>
                <div>
                  <div className="bg-sky-200 mx-auto py-8 rounded-xl">
                    <Image
                      src={BookSVG}
                      alt="icon"
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-0 font-serif text-xs mt-[12px]">
                    The Lords of the Rings
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Store Vermont
                  </label>
                </div>
                <div className="flex items-center justify-between w-36 pr-2 mt-1 mx-auto">
                  <button
                    onClick={(e) => toggleLike(key, e)}
                    className="cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-12 h-12 ${
                        row.isLiked ? "stroke-yellow-400 " : ""
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
                      <path d="M10.363 20.405l-8.106 -13.534a1.914 1.914 0 0 1 1.636 -2.871h16.214a1.914 1.914 0 0 1 1.636 2.871l-8.106 13.534a1.914 1.914 0 0 1 -3.274 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => toggleUnLike(key, e)}
                    className="cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-12 h-12 ${
                        row.isUnLiked ? "stroke-green-400 " : ""
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
                      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slidercomponent;
