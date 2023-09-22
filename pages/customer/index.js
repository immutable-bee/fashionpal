import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerFilters from "@/components/customer/CustomerFilters";
import Loading from "@/components/utility/loading";
import { NotificationManager } from 'react-notifications';
import ProductDetails from "@/components/utility/ProductDetails";
import PaginationComponent from "@/components/utility/Pagination";
import ModalComponent from "@/components/utility/Modal";
import ListingItem from "@/components/utility/ListingItem";
import { Swiper, SwiperSlide } from "swiper/react";
import moment from 'moment'
import Image from "next/image";
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
  }, [filter, type, size]);  // Only re-create if filter, type or size changes

  useEffect(() => {
    const initialFetch = async () => {
      await fetchListings(1);
    };
    initialFetch();
  }, [type, size, fetchListings]);



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

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isLiked = !updatedListings[index].isLiked
    updatedListings[index].isUnLiked = false

    onSave(updatedListings[index])
    setListings(updatedListings);
  };

  const toggleUnLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isUnLiked = !updatedListings[index].isUnLiked
    updatedListings[index].isLiked = false

    onSave(updatedListings[index])
    setListings(updatedListings);
  };

  const onSave = async (row) => {
    try {
      const res = await fetch(`/api/edit-listing`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: row.id,
          isLiked: row.isLiked,
          isUnLiked: row.isUnLiked,
        })
      });

      if (res.status === 200) {


      } else {
        const errorMessage = await res.text();
        console.error(`edit failed with status: ${res.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while edit listing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      <div>
        {detailsModal ?
          <ProductDetails
            open={detailsModal}
            onClose={() => setDetailsModal(false)}
            data={listings[activeTagIndex]}
            fetchListings={() => fetchListings(1)}
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


                  <div className="sm:flex flex-wrap justify-center mt-2">
                    <Swiper
                      slidesPerView='auto'
                      spaceBetween={14}
                      navigation
                    >


                      {listings.map((row, index) => {
                        return (
                          <SwiperSlide key={index} className="!w-64">
                            <div
                              style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                              className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-3xl mx-2 my-2 w-full "
                              key={row.id}
                              onClick={() => triggerDetailsModal(index)}
                            >

                              <Image
                                src={row.mainImage?.url}
                                width={100}
                                height={100}
                                className="rounded !w-full !h-64 object-cover"
                                alt=""
                              />

                              <div className="flex items-center justify-between w-40 pr-2 mt-6 mb-3 mx-auto">

                                <button onClick={(e) => toggleLike(index, e)} className=" cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center">

                                  <svg xmlns="http://www.w3.org/2000/svg" class={`w-12 h-12 ${row.isLiked ? 'stroke-yellow-400 ' : ''}`} width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M10.363 20.405l-8.106 -13.534a1.914 1.914 0 0 1 1.636 -2.871h16.214a1.914 1.914 0 0 1 1.636 2.871l-8.106 13.534a1.914 1.914 0 0 1 -3.274 0z" />
                                  </svg>
                                </button>

                                <button onClick={(e) => toggleUnLike(index, e)} className=" cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center">

                                  <svg xmlns="http://www.w3.org/2000/svg" class={`w-12 h-12 ${row.isUnLiked ? 'stroke-yellow-400 ' : ''}`} width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                                  </svg>
                                </button>
                                <h3 className="text-gray-500 font-base absolute right-4 bottom-2">
                                  {moment(row.createdAt).fromNow()}
                                </h3>
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
              )}
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
