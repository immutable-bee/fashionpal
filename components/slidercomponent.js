import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./slidercomponent.module.css";
import Image from "next/image";
import BookSVG from '../assets/book.svg'
// import Link from 'next/link';
// import "bootstrap/dist/css/bootstrap.css";
import "swiper/css";
import { useState } from "react";
import Link from "next/link";

// import 'swiper/css/navigation';

const Slidercomponent = ({ storesNearYou }) => {
  const [stores, setStores] = useState([]);

  const [listings, setListings] = useState([
    {},
    {},
    {},
    {},
    {},
  ])

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isLiked = !updatedListings[index].isLiked
    updatedListings[index].isUnLiked = false

    // onSave(updatedListings[index])
    setListings(updatedListings);
  };

  const toggleUnLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isUnLiked = !updatedListings[index].isUnLiked
    updatedListings[index].isLiked = false

    // onSave(updatedListings[index])
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
        // install Swiper modules
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
        //   slidesPerView={1}

        navigation
      >
        {listings.map((row, key) => {
          return (
            <SwiperSlide key={key} className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    Bookstore Vermont
                  </label>
                </div>
                <div className="flex items-center justify-between w-36 pr-2 mt-1 mx-auto">
                  <button onClick={(e) => toggleLike(key, e)} className="cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-12 h-12 ${row.isLiked ? 'text-yellow-400 fill-yellow-400' : ''}`}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" class={`w-12 h-12 ${row.isLiked ? 'stroke-yellow-400 ' : ''}`} width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10.363 20.405l-8.106 -13.534a1.914 1.914 0 0 1 1.636 -2.871h16.214a1.914 1.914 0 0 1 1.636 2.871l-8.106 13.534a1.914 1.914 0 0 1 -3.274 0z" />
                    </svg>
                  </button>

                  <button onClick={(e) => toggleUnLike(key, e)} className="cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-12 h-12 ${row.isUnLiked ? 'text-green-400 fill-green-400' : ''}`}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" class={`w-12 h-12 ${row.isUnLiked ? 'stroke-yellow-400 ' : ''}`} width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          )
        })
        }

        {/* {stores.length > 0 ? (
          stores.map((store) => (
            <SwiperSlide
              key={store.id}
              className="border border-gray-300 h-96 rounded-xl p-[11px]"
            >
              <div>
                <Link
                  href={`/listingdetail?id=${store.listingId}`}
                  style={{ textDecoration: "none" }}
                >
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
                      {store.title.length < 20
                        ? store.title
                        : store.title.slice(0, 20) + "..."}
                    </p>
                    <label className="font-serif text-xs mt-[6px] text-gray-400">
                      {store.business_name}
                    </label>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <>
            
          </>
        )} */}
      </Swiper>
    </div>
  );
};

export default Slidercomponent;
