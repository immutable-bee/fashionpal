import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Inputcomponent from "@/components/utility/Input";
import HeaderComponent from "@/components/utility/Header";
import TooltipComponent from "@/components/utility/Tooltip";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import Shirt from '../../assets/shirt.png'
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import AddCloths from "@/components/scoped/AddCloths";
import Shirt2 from '../../assets/shirt-2.jpg';
import ProductDetails from "@/components/utility/ProductDetails";
import ModalComponent from "@/components/utility/Modal";
import "swiper/css";
import ListingItem from "@/components/utility/ListingItem";
import BookSVG from '../../assets/book.svg'
// import Link from 'next/link';
// import "bootstrap/dist/css/bootstrap.css";
import "swiper/css";
import { useState } from "react";
import Link from "next/link";

// import 'swiper/css/navigation';

const Slidercomponent = ({ storesNearYou }) => {
    const [stores, setStores] = useState([]);

    const [image, setImage] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [inputVisible, setInputVisible] = useState(true);
    const [detailsModal, setDetailsModal] = useState(false);
    const [activeTagIndex, setActiveIndex] = useState(0);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [size, setSize] = useState('');
    const [type, setType] = useState('');
    const [sizes, setSizes] = useState([
        { value: 'XS', type: '' },
        { value: 'S', type: '' },
        { value: 'M', type: '' },
        { value: 'L', type: '' },
        { value: 'XL', type: '' },
        { value: 'XXL', type: '' },
        { value: 1, type: 'Footwear' },
        { value: 2, type: 'Footwear' },
        { value: 3, type: 'Footwear' },
        { value: 4, type: 'Footwear' },
        { value: 5, type: 'Footwear' },
        { value: 6, type: 'Footwear' },
        { value: 7, type: 'Footwear' },
        { value: 8, type: 'Footwear' },
        { value: 9, type: 'Footwear' },
        { value: 10, type: 'Footwear' },
        { value: 11, type: 'Footwear' },
        { value: 12, type: 'Footwear' },
        { value: 13, type: 'Footwear' },
        { value: 14, type: 'Footwear' },
        { value: 15, type: 'Footwear' },
    ])

    const [tagEditModal, setTagEditModal] = useState(false);
    const [active, setActive] = useState("clothingorfootwear");
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const blobURL = URL.createObjectURL(file);
        setImage(blobURL);
        setSelectedTag(null);
        setInputVisible(false);
    };

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
    };

    const triggerDetailsModal = (index) => {
        setDetailsModal(true)
        setActiveIndex(index)
    };





    // add end
    const [loadingListings, setLoadingListings] = useState(false);
    const [listings, setListings] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [mode, setMode] = useState("view");

    const [loadingSearchResults, setLoadingSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // pagination

    const [inventoryMatchesPage, setInventoryMatchesPage] = useState(1);

    const openRequestsItemsPerPage = 7;

    const fetchListings = async (e) => {
        console.log('fetch')
        setLoadingListings(true);

        try {
            const res = await fetch(`/api/customer-fetch-listings?limit=15&page=${e}&searchText=${filter}&apparel=${type}&size=${size}`);

            if (res.status === 200) {
                const data = await res.json();
                setListings(data.results);
                setPagination(data.pagination);
            } else {
                const errorMessage = await res.text();
                console.error(`Fetch failed with status: ${res.status}, message: ${errorMessage}`);
            }
        } catch (error) {
            console.error('An error occurred while fetching listings:', error);
        } finally {
            setLoadingListings(false);
        }
    };


    useEffect(() => {
        const initialFetch = async () => {
            // setLoadingListings(true);
            await fetchListings(1);
            //   setLoadingListings(false);
        };
        initialFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchSearchResults = async () => {
        setLoadingSearchResults(true);
        const res = await fetch("/api/fetch-searchResults", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ searchTerm, filter }),
        });

        if (res.status === 200) {
            const data = await res.json();
            setSearchResults(data);
            setLoadingSearchResults(false);
        }
    };

    const loadingMessage = () => {
        if (loadingListings === true) {
            return "Loading";
        } else if (loadingSearchResults === true) {
            return "Searching";
        }
    };

    const arrayToMap = searchResults.length > 0 ? searchResults : listings;

    const resultCount =
        searchResults.length > 0 ? searchResults.length : listings.length;

    const testData = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},


    ];


    const triggerDetailsChildModal = (index) => {
        setDetailsChildModal(true)
        setActiveChildIndex(index)
    };

    // useEffect(() => {
    //     setStores(storesNearYou);
    // }, [storesNearYou]);

    return (
        <div className="min-h-screen bg-white w-screen">
            <HeaderComponent />
            {detailsModal ?
                <ProductDetails
                    open={detailsModal}
                    onClose={() => setDetailsModal(false)}
                    data={listings[activeTagIndex]}
                /> : ''}
            <div>
                <div class="flex justify-between px-5 max-w-7xl mx-auto">
                    <Inputcomponent
                        handleSearch={fetchSearchResults}
                        filter={filter}
                        setFilter={setFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <div className="flex flex-shrink-0 items-center justify-end">

                        <div className="ml-2 sm:ml-3">
                            <button
                                type="button"
                                class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
                                //onClick={fetchSearchResults}
                                onClick={() => handleSearch(searchTerm, filter)}
                            >
                                <div>
                                    <svg
                                        class="text-white w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
                <ul className=" mt-2 flex justify-center items-center ml-2">
                    <div className="mx-1">
                        <label>Apparel</label>
                        <select className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600" onChange={(e) => setType(e.target.value)}>
                            <option value="Clothing">Clothing</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Hats">Hats</option>
                        </select>
                    </div>

                    <div className="mx-1">
                        <label>Size</label>
                        <select
                            className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600"
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {sizes.filter(x => type === 'Footwear' ? x.type === 'Footwear' : x.type !== 'Footwear').map(x => (
                                <option key={x.value} value={x.value}>{x.value}</option>
                            ))}
                        </select>

                    </div>
                </ul>

                <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">

                </section>
            </div>



            <div className="pt-8 px-6">


                <Swiper
                    // install Swiper modules
                    breakpoints={{
                        240: {
                            slidesPerView: 1.1,
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
                                className="border border-gray-300 sm:h-96 rounded-xl p-[11px]"
                            >
                                <div>
                                    <Link
                                        href={`/listingdetail?id=${store.listingId}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div>
                                            <div className="">
                                                <Image
                                                    src={Shirt2}
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
                            {listings.map((row, index) => {
                                return (
                                    <SwiperSlide onClick={() => triggerDetailsModal(index)} className="border border-gray-300 cursor-pointer hover:bg-gray-50 sm:h-96 rounded-xl p-[11px]">
                                        <div>
                                            <div>
                                                <div className="">
                                                    <Image
                                                        src={row.mainImage?.url}
                                                        width={100}
                                                        height={100}
                                                        alt="icon"
                                                        className="rounded-lg !w-full sm:!h-64 object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>

                                                <div className="flex items-center justify-between w-40 pr-2 mt-6 mb-3 mx-auto">
                                                    <button className="bg-yellow-300 cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                                                        </svg>


                                                    </button>
                                                    <button className="bg-green-300 cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                                        </svg>

                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}


                        </>
                    )}
                </Swiper>
            </div>
        </div>
    );
};

export default Slidercomponent;
