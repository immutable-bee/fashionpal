import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import HeaderComponent from "@/components/utility/Header";
import TooltipComponent from "@/components/utility/Tooltip";
import Loading from "@/components/utility/loading";
import ProductDetails from "@/components/utility/ProductDetails";
import PaginationComponent from "@/components/utility/Pagination";
import Shirt from '../../assets/shirt.png'
import Shirt2 from '../../assets/shirt-2.jpg'
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

  const onChangeType = (e) => {
    setType(e.target.value)

    setTimeout(() => {
      fetchListings(1)
    }, 1000);
  }
  const onChangeSize = (e) => {
    setSize(e.target.value)

    setTimeout(() => {
      fetchListings(1)
    }, 1000);
  }

  const arrayToMap = searchResults.length > 0 ? searchResults : listings;

  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;

  const testData = [
    {
      id: 1,
      mainPhoto: Shirt,
      brandTagPhoto: Shirt2,
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
      mainPhoto: Shirt,
      brandTagPhoto: Shirt2,
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
      mainPhoto: Shirt,
      brandTagPhoto: Shirt2,
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

      <div>
        {detailsModal ?
          <ProductDetails
            open={detailsModal}
            onClose={() => setDetailsModal(false)}
            data={listings[activeTagIndex]}
          /> : ''}

        <div class=" flex justify-between px-5 max-w-7xl mx-auto">
          <Inputcomponent
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="flex flex-shrink-0 items-center justify-end">

            <div className="ml-2 sm:ml-3">
              <button
                type="button"
                class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
                onClick={() => fetchListings(1)}
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
            <select className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600" onChange={(e) => onChangeType(e)}>
              <option value="">All</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
              <option value="Hats">Hats</option>
            </select>
          </div>

          <div className="mx-1">
            <label>Size</label>
            <select
              className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600"
              onChange={(e) => onChangeSize(e)}
            >
              <option value="">All</option>
              {sizes.filter(x => type === 'Footwear' ? x.type === 'Footwear' : x.type !== 'Footwear').map(x => (
                <option key={x.value} value={x.value}>{x.value}</option>
              ))}
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
                              className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-lg mx-2 my-2 w-full sm:w-32 border-2 shadow-lg border-[#E44A1F]"
                              key={row.id}
                              onClick={() => triggerDetailsModal(index)}
                            >
                              <div className="flex">
                                <div className="w-24 my-auto flex-shrink-0 mr-3 rounded-lg">
                                  <Image
                                    src={row.mainPhoto}
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
                  <h3 className="text-xl text-center mt-8">Newly listed In Hats</h3>
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
                              className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-lg mx-2 my-2 w-full sm:w-32 border-2 shadow-lg border-[#E44A1F]"
                              key={row.id}
                              onClick={() => triggerDetailsModal(index)}
                            >
                              <div className="flex">
                                <div className="w-24 my-auto flex-shrink-0 mr-3 rounded-lg">
                                  <Image
                                    src={row.mainPhoto}
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
      </div>

    </div>
  );
}
