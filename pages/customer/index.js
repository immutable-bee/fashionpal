import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import HeaderComponent from "@/components/utility/Header";
import TooltipComponent from "@/components/utility/Tooltip";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import Shirt from '../../assets/shirt.png'
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import AddCloths from "@/components/scoped/AddCloths";
import ModalComponent from "@/components/utility/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
export default function Home() {

  // add
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [tagEditModal, setTagEditModal] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
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

  const triggerEditTagsModal = (index) => {
    setTagEditModal(true)
    setActiveTagIndex(index)
  };
  const handleActiveChange = (newActive) => {
    setActive(newActive);
    setFilter(newActive.toLowerCase());
  };

  // add end
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("title");
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

  const fetchListings = async () => {
    const res = await fetch("/api/fetch-listings");

    if (res.status === 200) {
      const data = await res.json();
      setListings(data);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setLoadingListings(true);
      await fetchListings();
      setLoadingListings(false);
    };
    initialFetch();
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
    {
      id: 1,
      image_url: Shirt,
      tags: [
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
      ]
    },
    {
      id: 1,
      image_url: Shirt,
      tags: [
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
      ]
    },
    {
      id: 1,
      image_url: Shirt,
      tags: [
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
        { name: 'size', value: 'medium' },
        { name: 'sleeve length', value: 'short' },
        { name: 'color', value: 'pink' },
      ]
    },

  ];
  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />
      {mode === 'view' ?
        <div>
          <div class=" sm:flex justify-between px-5 max-w-7xl mx-auto">
            <Inputcomponent
              handleSearch={fetchSearchResults}
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <div className="flex flex-shrink-0 items-center justify-end mt-2 sm:mt-0">

              <div className="ml-2 sm:ml-3">
                <button
                  type="button"
                  class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl"
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
              <label>Clothing Or Footwear</label>
              <select className="w-full mx-1 mt-1 rounded-lg px-3 py-1.5 border border-gray-600">
                <option value="1">1</option>
                <option value="2">1</option>
              </select>
            </div>
            <div className="mx-1">
              <label>Size</label>
              <select className="w-full mx-1 mt-1 rounded-lg px-3 py-1.5 border border-gray-600">
                <option value="1">1</option>
                <option value="2">1</option>
              </select>
            </div>
          </ul>

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
                  <div className="">
                    <h3 className="text-xl text-center">Newly listed Clothes</h3>
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      <Swiper
                        slidesPerView='auto'
                        spaceBetween={14}
                        navigation
                      >


                        {testData.map((row, index) => {
                          return (
                            <SwiperSlide key={index} className="!w-32">
                              <div
                                className="px-4 py-4 relative rounded-lg mx-2 my-2 w-32 border-2 shadow-lg border-[#E44A1F]"
                                key={row.id}
                              >
                                <div className="flex">
                                  <div className="w-24 my-auto flex-shrink-0 mr-3 rounded-lg">
                                    <Image
                                      src={row.image_url}
                                      className="rounded"
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
                    <h3 className="text-xl text-center mt-8">Newly listed In Footwear</h3>
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      <Swiper
                        slidesPerView='auto'
                        spaceBetween={14}
                        navigation
                      >
                        {testData.map((row, index) => {
                          return (
                            <SwiperSlide key={index} className="!w-32">
                              <div
                                className="px-4 py-4 relative rounded-lg mx-2 my-2 w-full sm:w-32 border-2 shadow-lg border-[#E44A1F]"
                                key={row.id}
                              >
                                <div className="flex">
                                  <div className="w-24 my-auto flex-shrink-0 mr-3 rounded-lg">
                                    <Image
                                      src={row.image_url}
                                      className="rounded"
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
                )}
              </div>
            </div>
          </section>
        </div> :
        <AddCloths onBack={() => setMode('view')} />

      }

    </div>
  );
}
