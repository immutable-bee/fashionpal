import { useState, useEffect } from "react";
import CustomerFilters from "@/components/customer/CustomerFilters";
import HeaderComponent from "@/components/utility/Header";
import Loading from "@/components/utility/loading";
import ProductDetails from "@/components/utility/ProductDetails";
import PaginationComponent from "@/components/utility/Pagination";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { NotificationManager } from 'react-notifications';

export default function Home() {

  // add

  const [detailsModal, setDetailsModal] = useState(false);
  const [activeTagIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState("");
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');



  const triggerDetailsModal = (index) => {
    setDetailsModal(true)
    setActiveIndex(index)
  };





  // clothes
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);
  const [notMatchesPage, setNotMatchesPage] = useState(1);
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

  const onPaginationChange = (e) => {
    console.log(e)
    setNotMatchesPage(e)
    fetchClothesListings(e)
  }

  const fetchClothesListings = async (e) => {
    console.log('fetch')
    setLoadingListings(true);

    try {
      const res = await fetch(`/api/customer-fetch-listings?limit=15&page=1&apparel=Clothing`);

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
  // end
  // Footwear
  const [hatsloadingListings, setHatsLoadingListings] = useState(false);
  const [hatsListings, setHatsListings] = useState([]);
  const [notHatsMatchesPage, setHatsNotMatchesPage] = useState(1);
  const [hatspagination, setHatsPagination] = useState({
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

  const onHatsPaginationChange = (e) => {
    console.log(e)
    setHatsNotMatchesPage(e)
    fetchHatsListings(e)
  }

  const fetchHatsListings = async (e) => {
    console.log('fetch')
    setHatsLoadingListings(true);

    try {
      const res = await fetch(`/api/customer-fetch-listings?limit=15&page=1&apparel=Hats`);

      if (res.status === 200) {
        const data = await res.json();
        setHatsListings(data.results);
        setHatsPagination(data.pagination);
      } else {
        const errorMessage = await res.text();
        console.error(`Fetch failed with status: ${res.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while fetching listings:', error);
    } finally {
      setHatsLoadingListings(false);
    }
  };
  // end
  // Footwear
  const [footwearloadingListings, setFootwearLoadingListings] = useState(false);
  const [footwearListings, setFootwearListings] = useState([]);
  const [notFootwearMatchesPage, setFootwearNotMatchesPage] = useState(1);
  const [footwearpagination, setFootwearPagination] = useState({
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

  const onFootwearPaginationChange = (e) => {
    console.log(e)
    setFootwearNotMatchesPage(e)
    fetchFootwearListings(e)
  }

  const fetchFootwearListings = async (e) => {
    console.log('fetch')
    setFootwearLoadingListings(true);

    try {
      const res = await fetch(`/api/customer-fetch-listings?limit=15&page=1&apparel=Footwear`);

      if (res.status === 200) {
        const data = await res.json();
        setFootwearListings(data.results);
        setFootwearPagination(data.pagination);
      } else {
        const errorMessage = await res.text();
        console.error(`Fetch failed with status: ${res.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while fetching listings:', error);
    } finally {
      setFootwearLoadingListings(false);
    }
  };
  // end





  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // pagination




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
      await fetchClothesListings(1);
      await fetchHatsListings(1);
      await fetchFootwearListings(1);
      //   setLoadingListings(false);
    };
    initialFetch();
  }, []);



  const loadingMessage = () => {
    if (loadingListings === true) {
      return "Loading";
    } else if (loadingSearchResults === true) {
      return "Searching";
    }
  };
  useEffect(() => {
    if (type !== "") { // Only fetch if type is changed to a non-empty value
      fetchListings(1);
    } else if (type == "") { // Only fetch if type is changed to a non-empty value

      fetchClothesListings(1);

      fetchHatsListings(1);

      fetchFootwearListings(1);
    }
  }, [type]); // Dependency array with type, so the effect runs whenever type changes.
  useEffect(() => {
    if (type !== "") { // Only fetch if type is changed to a non-empty value
      fetchListings(1);
    } else if (type == "") { // Only fetch if type is changed to a non-empty value

      fetchClothesListings(1);

      fetchHatsListings(1);

      fetchFootwearListings(1);
    }
  }, [size]); // Dependency array with type, so the effect runs whenever type changes.


  const arrayToMap = searchResults.length > 0 ? searchResults : listings;

  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;


  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      <div>
        {detailsModal ?
          <ProductDetails
            open={detailsModal}
            onClose={() => setDetailsModal(false)}
            data={listings[activeTagIndex]}
          /> : ''}


        <CustomerFilters
          fetchListings={() => fetchListings(1)}
          changeFilter={(e) => setFilter(e)}
          changeType={(e) => setType(e)}
          changeSize={(e) => setSize(e)}
          changeZipCode={(e) => setZipCode(e)}
          changeRadius={(e) => setRadius(e)}
        />


        <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
          <div className="">
            <div className="flex justify-between items-center">
              <p className="text-gray-900 text-base">
                {resultCount} Results found
              </p>
            </div>

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
                <div className="w-screen overflow-hidden">
                  {/* Clothing */}
                  <div className="">
                    <h3 className="text-xl text-center">Newly listed Clothes</h3>
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      <Swiper
                        slidesPerView='auto'
                        spaceBetween={14}
                        navigation
                      >


                        {listings.map((row, index) => {
                          return (
                            <SwiperSlide key={index} className="!w-56">
                              <div
                                className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-lg mx-2 my-2 w-full border-2 shadow-lg border-[#E44A1F]"
                                key={row.id}
                                onClick={() => triggerDetailsModal(index)}
                              >
                                <div className="flex">
                                  <div className="w-full my-auto flex-shrink-0 mr-3 rounded-lg">
                                    <Image
                                      src={row.mainImage?.url}
                                      width={100}
                                      height={100}
                                      className="rounded !w-full !h-64 object-cover"
                                      alt=""
                                    />
                                  </div>

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

                      {pagination && pagination.total_pages > 1 && !loadingListings && (
                        <PaginationComponent
                          total={pagination.total}
                          current={notMatchesPage}
                          pageSize={pagination.limit_per_page}
                          onChange={(e) => onPaginationChange(e)}
                        />
                      )}
                    </div>



                  </div>
                  {/* Clothing end */}
                  {
                    type === '' ? (
                      <>
                        {/* Footwear */}
                        <div className="mt-6">
                          <h3 className="text-xl text-center">Newly listed Footwear</h3>
                          <div className="sm:flex flex-wrap justify-center mt-2">

                            <Swiper
                              slidesPerView='auto'
                              spaceBetween={14}
                              navigation
                            >


                              {footwearListings.map((row, index) => {
                                return (
                                  <SwiperSlide key={index} className="!w-56">
                                    <div
                                      className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-lg mx-2 my-2 w-full border-2 shadow-lg border-[#E44A1F]"
                                      key={row.id}
                                      onClick={() => triggerDetailsModal(index)}
                                    >
                                      <div className="flex">
                                        <div className="w-full my-auto flex-shrink-0 mr-3 rounded-lg">
                                          <Image
                                            src={row.mainImage?.url}
                                            width={100}
                                            height={100}
                                            className="rounded !w-full !h-64 object-cover"
                                            alt=""
                                          />
                                        </div>

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

                            {footwearpagination && footwearpagination.total_pages > 1 && !footwearloadingListings && (
                              <PaginationComponent
                                total={footwearpagination.total}
                                current={notFootwearMatchesPage}
                                pageSize={footwearpagination.limit_per_page}
                                onChange={(e) => onFootwearPaginationChange(e)}
                              />
                            )}
                          </div>



                        </div>
                        {/* Footwear end */}

                        {/* Hats */}
                        <div className="mt-6">
                          <h3 className="text-xl text-center">Newly listed Hats</h3>
                          <div className="sm:flex flex-wrap justify-center mt-2">

                            <Swiper
                              slidesPerView='auto'
                              spaceBetween={14}
                              navigation
                            >


                              {hatsListings.map((row, index) => {
                                return (
                                  <SwiperSlide key={index} className="!w-56">
                                    <div
                                      className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-lg mx-2 my-2 w-full border-2 shadow-lg border-[#E44A1F]"
                                      key={row.id}
                                      onClick={() => triggerDetailsModal(index)}
                                    >
                                      <div className="flex">
                                        <div className="w-full my-auto flex-shrink-0 mr-3 rounded-lg">
                                          <Image
                                            src={row.mainImage?.url}
                                            width={100}
                                            height={100}
                                            className="rounded !w-full !h-64 object-cover"
                                            alt=""
                                          />
                                        </div>

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

                            {hatspagination && hatspagination.total_pages > 1 && !hatsloadingListings && (
                              <PaginationComponent
                                total={hatspagination.total}
                                current={notHatsMatchesPage}
                                pageSize={hatspagination.limit_per_page}
                                onChange={(e) => onHatsPaginationChange(e)}
                              />
                            )}
                          </div>



                        </div>
                        {/* Footwear end */}
                      </>
                    ) : ''
                  }
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
