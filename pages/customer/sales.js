import ModalComponent from "@/components/utility/Modal";
import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerSalesFilters from "@/components/customer/CustomerSalesFilters";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import ProductDetails from "@/components/utility/ProductDetails";
import ListingItem from "@/components/utility/ListingItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { NotificationManager } from 'react-notifications';
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
export default function Home() {

  const [filter, setFilter] = useState("");
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');
  // add
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [detailsModal, setDetailsModal] = useState(false);
  const [activeTagIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState("clothing");
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

  const handleAdd = () => {
    if (image && selectedTag) {
      setUploadedImages([...uploadedImages, { image, tag: selectedTag }]);
      setImage(null);
      setSelectedTag(null);
      setInputVisible(true);
    }
  };

  const handleDelete = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const onChangeType = (e) => {
    setType(e.target.value)


  }

  const triggerDetailsModal = (index) => {
    setDetailsModal(true)
    setActiveIndex(index)
  };
  const handleActiveChange = (newActive) => {
    setActive(newActive);
    setFilter(newActive.toLowerCase());
  };

  // add end
  const [saveLoading, setLoadingSave] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    previous_page: 1,
    current_page: 1,
    next_page: 0,
    items: [1],
    total_pages: 2,
    has_prev_page: true,
    limit_per_page: 15,
    has_next_page: false,
  });
  const [notMatchesPage, setNotMatchesPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [mode, setMode] = useState("view");

  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // pagination

  const [inventoryMatchesPage, setInventoryMatchesPage] = useState(1);

  const openRequestsItemsPerPage = 7;

  const paginateData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return data.slice(startIndex, endIndex);
  };
  // pagination end

  const calculateDaysAgo = (dateListed) => {
    const listedDate = new Date(dateListed);

    const currentDate = new Date();

    const diffTime = Math.abs(currentDate - listedDate);

    // Calculate the difference in days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If the difference is more than one day, return it as "x days ago"
    // If it's exactly one day, return "1 day ago"
    // Else if it's less than a day, return "Today"
    if (diffDays > 1) {
      return `${diffDays} days ago`;
    } else if (diffDays === 1) {
      return `1 day ago`;
    } else {
      return "Today";
    }
  };


  const fetchListings = useCallback(async (e) => {
    console.log('fetch');
    setLoadingListings(true);

    try {
      const res = await fetch(`/api/customer-fetch-listings?limit=15&page=${e}&searchText=${filter}`);
      // &apparel=${type}&size=${size}

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
  }, [filter, type, size]);  // Only re-create if filter, type or size changes

  useEffect(() => {
    const initialFetch = async () => {
      await fetchListings(1);
    };
    initialFetch();
  }, [type, size, fetchListings]);

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isLiked = !updatedListings[index].isLiked
    setListings(updatedListings);
  };

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

  const onChangeSize = (e) => {
    setSize(e.target.value)
  }

  const arrayToMap = searchResults.length > 0 ? searchResults : listings;

  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;



  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      <div>
        <CustomerSalesFilters
          fetchListings={() => fetchListings(1)}
          changeFilter={(e) => setFilter(e)}
          changeType={(e) => setType(e)}
          changeSize={(e) => setSize(e)}
          changeZipCode={(e) => setZipCode(e)}
          changeRadius={(e) => setRadius(e)}
        />

        <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
          <div className="">
            {/* <div className="flex justify-between items-center">
              <p className="text-gray-900 text-base">
                {resultCount} Results found
              </p>


            </div> */}

            <div className="">
              {loadingListings || loadingSearchResults ? (
                <div className="sm:flex justify-center pb-10">
                  <div>
                    <p className="me-1">{loadingMessage()}</p>
                    <div className="pt-2.5">
                      <Loading />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="">
                    <h3 className="mt-4 text-xl">Current Sales</h3>
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      <Swiper
                        slidesPerView='auto'
                        spaceBetween={14}
                        navigation
                      >



                        {listings.map((row, index) => {
                          return (
                            <SwiperSlide key={index} className="!w-96">
                              <div
                                className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 shadow-lg"
                                style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                                key={row.id}
                              >
                                <button onClick={(e) => toggleLike(index, e)} className="hover:bg-green-200 cursor-pointer hover:opacity-90 w-10 h-10 absolute top-2 right-2 rounded-full flex items-center justify-center">
                                  <svg onClick={(e) => toggleLike(index, e)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-6 h-6 ${row.isLiked ? 'fill-green-400 text-green-400' : ''}`}>
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                  </svg>
                                </button>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Business name:</span> <span className="w-1/2">Softronet Inc</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Name of sale:</span> <span className="w-1/2">Summer sale</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">Cloths, Footware</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Discount amount:</span> <span className="w-1/2">$50</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Start date:</span> <span className="w-1/2">14th sep 2021</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">End date:</span> <span className="w-1/2">11th oct 2022</span>
                                </div>

                                <div className="flex justify-center !mt-5">
                                  <Link href="/store/id">
                                    <button className="bg-primary text-white px-5 py-1.5 rounded-lg">View store</button>
                                  </Link>
                                </div>

                              </div>
                            </SwiperSlide>

                          );
                        })}

                      </Swiper>

                    </div>

                    <div
                      id="inventory-matches-pagination"
                      className="flex justify-center"
                    >
                      {arrayToMap?.length > 0 && !loadingListings && (
                        <PaginationComponent
                          total={Math.ceil(
                            arrayToMap.length / openRequestsItemsPerPage
                          )}
                          current={inventoryMatchesPage}
                          onChange={(page) => setInventoryMatchesPage(page)}
                        />
                      )}
                    </div>

                  </div>
                  <div className="">
                    <h3 className="mt-4 text-xl">Upcoming Sales</h3>
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      <Swiper
                        slidesPerView='auto'
                        spaceBetween={14}
                        navigation
                      >



                        {listings.map((row, index) => {
                          return (
                            <SwiperSlide key={index} className="!w-96">
                              <div
                                className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 shadow-lg"
                                style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                                key={row.id}
                              >
                                <button onClick={(e) => toggleLike(index, e)} className="hover:bg-green-200 cursor-pointer hover:opacity-90 w-10 h-10 absolute top-2 right-2 rounded-full flex items-center justify-center">
                                  <svg onClick={(e) => toggleLike(index, e)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-6 h-6 ${row.isLiked ? 'fill-green-400 text-green-400' : ''}`}>
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                  </svg>
                                </button>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Business name:</span> <span className="w-1/2">Softronet Inc</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Name of sale:</span> <span className="w-1/2">Summer sale</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">Cloths, Footware</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Discount amount:</span> <span className="w-1/2">$50</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">Start date:</span> <span className="w-1/2">14th sep 2021</span>
                                </div>
                                <div
                                  className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">End date:</span> <span className="w-1/2">11th oct 2022</span>
                                </div>

                                <div className="flex justify-center !mt-5">
                                  <Link href="/store/id">
                                    <button className="bg-primary text-white px-5 py-1.5 rounded-lg">View store</button>
                                  </Link>
                                </div>

                              </div>
                            </SwiperSlide>

                          );
                        })}

                      </Swiper>

                    </div>

                    <div
                      id="inventory-matches-pagination"
                      className="flex justify-center"
                    >
                      {arrayToMap?.length > 0 && !loadingListings && (
                        <PaginationComponent
                          total={Math.ceil(
                            arrayToMap.length / openRequestsItemsPerPage
                          )}
                          current={inventoryMatchesPage}
                          onChange={(page) => setInventoryMatchesPage(page)}
                        />
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div >

      {
        detailsModal ?
          <ModalComponent
            open={detailsModal}
            title="Matches Details"
            width="90vw"
            onClose={() => setDetailsModal(false)}
            footer={
              <div className="flex justify-end w-full">
                <button className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => setDetailsModal(false)}>Close</button>
              </div>
            }
          >
            <div className="sm:flex flex-wrap justify-center mt-2">
              {testData[activeTagIndex].results.map((row, key) => {
                return (
                  <ListingItem key={key} mainPhoto={row.mainPhoto} tags={row.tags}>
                    <button onClick={() => triggerDetailsChildModal(key)} className="bg-secondary mr-2 text-white hover:opacity-90 px-3 py-1 text-xs mt-1 rounded">
                      View details
                    </button>
                  </ListingItem>



                );
              })}

            </div>
          </ModalComponent > : ""
      }



    </div >
  );
}
