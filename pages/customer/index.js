import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerFilters from "@/components/customer/CustomerFilters";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import ProductDetails from "@/components/utility/ProductDetails";
import ListingItem from "@/components/utility/ListingItem";
import { Swiper, SwiperSlide } from "swiper/react";
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

  // pagination


  const onSave = async (row) => {
    setLoadingSave(true);

    try {
      const res = await fetch(`/api/edit-listing`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: row.id
        })
      });

      if (res.status === 200) {
        alert('Listing saved successfully!')
        fetchListings(1)

      } else {
        const errorMessage = await res.text();
        console.error(`edit failed with status: ${res.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while edit listing:', error);
    } finally {
      setLoadingSave(false);
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
                              className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-lg mx-2 my-2 w-full border-2 shadow-lg border-[#E44A1F]"
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
