import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerFilters from "@/components/customer/CustomerFilters";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import ProductDetails from "@/components/utility/ProductDetails";
import ListingItem from "@/components/utility/ListingItem";
import Image from "next/image";
import "swiper/css";
export default function Home() {
  const [filter, setFilter] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
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
    setType(e.target.value);
  };

  const triggerDetailsModal = (index) => {
    setDetailsModal(true);
    setActiveIndex(index);
  };
  const handleActiveChange = (newActive) => {
    setActive(newActive);
    setFilter(newActive.toLowerCase());
  };

  // add end
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);

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

  const fetchListings = useCallback(
    async (e) => {

      setLoadingListings(true);

      try {
        const res = await fetch(
          `/api/fetch-listings?limit=15&page=${e}&searchText=${filter}&apparel=${type}&size=${size}`
        );

        if (res.status === 200) {
          const data = await res.json();
          setListings(data.results);
          setPagination(data.pagination);
        } else {
          const errorMessage = await res.text();
          console.error(
            `Fetch failed with status: ${res.status}, message: ${errorMessage}`
          );
        }
      } catch (error) {
        console.error("An error occurred while fetching listings:", error);
      } finally {
        setLoadingListings(false);
      }
    },
    [filter, type, size]
  ); // Only re-create if filter, type or size changes

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
    setSize(e.target.value);
  };

  const arrayToMap = searchResults.length > 0 ? searchResults : listings;

  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;

  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />
      <div>
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
                <div className="">
                  <div className="sm:flex flex-wrap justify-center mt-2">
                    {listings &&
                      listings.map((row, key) => {
                        return (
                          <div
                            style={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                            className="px-4 sm:!w-56 py-4 relative cursor-pointer hover:opacity-90 rounded-3xl mx-2 my-2 w-full "
                            key={row.id}
                            onClick={() => triggerDetailsModal(key)}
                          >
                            <Image
                              src={row.mainImage?.url}
                              width={100}
                              height={100}
                              className="rounded !w-full !h-64 object-cover"
                              alt=""
                            />
                            <div className="mt-2">
                              {row.tags.slice(0, 3).map((tag, tagIndex) => (
                                <p
                                  key={tagIndex}
                                  className="text-gray-800 text-base leading-5"
                                >
                                  {tag}
                                </p>
                              ))}
                            </div>
                          </div>
                          // <ListingItem key={key} mainPhoto={row?.mainImage?.url} tags={row?.tags}>
                          //   <div className="flex items-center">
                          //     <button onClick={() => triggerDetailsModal(key)} className="bg-secondary mr-2 text-white hover:opacity-90 px-3 py-1 text-xs mt-1 rounded">
                          //       View details
                          //     </button>

                          //   </div>
                          // </ListingItem>
                        );
                      })}
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
      <ProductDetails
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        data={listings[activeTagIndex]}
        fetchListings={() => fetchListings(1)}
      />
    </div>
  );
}
