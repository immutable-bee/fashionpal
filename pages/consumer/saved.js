import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerFilters from "@/components/consumer/CustomerFilters";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import ProductDetails from "@/components/utility/ProductDetails";
import Image from "next/image";
import "swiper/css";
export default function Home() {
  const [store, setStore] = useState("");
  const [chance, setChance] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [activeTagIndex, setActiveIndex] = useState(0);
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);
  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const arrayToMap = searchResults.length > 0 ? searchResults : listings;
  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;
  const [inventoryMatchesPage, setInventoryMatchesPage] = useState(1);
  const openRequestsItemsPerPage = 7;

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

  const loadingMessage = () => {
    if (loadingListings === true) {
      return "Loading";
    } else if (loadingSearchResults === true) {
      return "Searching";
    }
  };

  const fetchListings = useCallback(
    async (e) => {
      setLoadingListings(true);

      try {
        const res = await fetch(
          `/api/common/fetch-listings?limit=15&page=${e}&store=${store}&chance=${chance}`
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
    [store, chance]
  ); // Only re-create if filter, type or size changes

  useEffect(() => {
    const initialFetch = async () => {
      await fetchListings(1);
    };
    initialFetch();
  }, [store, chance, fetchListings]);

  const triggerDetailsModal = (index) => {
    setDetailsModal(true);
    setActiveIndex(index);
  };

  const onPaginationChange = (e) => {
    setNotMatchesPage(e);
    fetchListings(e);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />
      <div>
        <CustomerFilters
          fetchListings={() => fetchListings(1)}
          changeStore={(e) => setStore(e)}
          changeChance={(e) => setChance(e)}
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
                              src={row.mainImage}
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
                        );
                      })}
                  </div>

                  <div
                    id="inventory-matches-pagination"
                    className="flex justify-center"
                  >
                    {arrayToMap?.length > 0 && !loadingListings && (
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
      <ProductDetails
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        data={listings[activeTagIndex]}
        fetchListings={() => fetchListings(1)}
      />
    </div>
  );
}
