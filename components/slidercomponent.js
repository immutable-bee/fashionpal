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

  useEffect(() => {
    setStores(storesNearYou);
  }, [storesNearYou]);

  return (
    <div className="mt-10">


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

        {stores.length > 0 ? (
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

            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="border border-gray-300 h-96 rounded-xl p-[11px]">
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
                    The Little Prince
                  </p>
                  <label className="font-serif text-xs mt-[6px] text-gray-400">
                    Bookstore San Diego
                  </label>
                </div>
              </div>
            </SwiperSlide>
          </>
        )}
      </Swiper>
    </div>
  );
};

export default Slidercomponent;
