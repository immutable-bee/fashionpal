import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerFilters from "@/components/consumer/CustomerFilters";
import Loading from "@/components/utility/loading";
import ProductDetails from "@/components/utility/ProductDetails";
import PaginationComponent from "@/components/utility/Pagination";

import moment from "moment";
import Image from "next/image";

import placeholder from "@/public/images/icon.jpg";

export default function Home() {
  const [store, setStore] = useState("");
  const [chance, setChance] = useState("");
  const [activeListingdetailsModal, setActiveListingDetailsModal] =
    useState(false);
  const [activeListingIndex, setActiveIndex] = useState(0);
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
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
  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;

  const loadingMessage = () => {
    if (loadingListings === true) {
      return "Loading";
    } else if (loadingSearchResults === true) {
      return "Searching";
    }
  };

  const fetchVotes = async (e) => {
    try {
      const res = await fetch(`/api/consumer/getVotes`);

      if (res.status === 200) {
        const data = await res.json();
        setUserVotes(data);
      } else {
        const errorMessage = await res.text();
        console.error(
          `Fetch failed with status: ${res.status}, message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching votes", error);
    }
  };

  const voteUIHandler = (listingId) => {
    const vote = userVotes.find((vote) => vote.listingId === listingId);

    let voteType;

    if (vote) {
      voteType = vote.type;
    }
    return voteType;
  };

  const fetchListings = useCallback(
    async (e) => {
      setLoadingListings(true);

      try {
        const res = await fetch(
          `/api/common/fetch-listings?limit=15&page=${e}&apparel=${store}&chance=${chance}`
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
    [chance, store]
  ); // Only re-create if filter, type or size changes

  useEffect(() => {
    const initialFetch = async () => {
      await fetchVotes();
      await fetchListings(1);
    };
    initialFetch();
  }, [store, chance, fetchListings]);

  const triggerDetailsModal = (index) => {
    setActiveListingDetailsModal(true);
    setActiveIndex(index);
  };

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isLiked = !updatedListings[index].isLiked;
    updatedListings[index].isUnLiked = false;

    onSave(updatedListings[index]);
    setListings(updatedListings);
  };

  const toggleUnLike = (index, event) => {
    event.stopPropagation();

    const updatedListings = [...listings];
    updatedListings[index].isUnLiked = !updatedListings[index].isUnLiked;
    updatedListings[index].isLiked = false;

    onSave(updatedListings[index]);
    setListings(updatedListings);
  };

  const onSave = async (row) => {
    try {
      const res = await fetch(`/api/consumer/updateLikes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: row.id,
          isLiked: row.isLiked,
          isUnLiked: row.isUnLiked,
        }),
      });

      if (res.status === 200) {
        fetchVotes();
      } else {
        const errorMessage = await res.text();
        console.error(
          `edit failed with status: ${res.status}, message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("An error occurred while edit listing:", error);
    }
  };

  const onPaginationChange = (e) => {
    setNotMatchesPage(e);
    fetchListings(e);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      <div>
        {activeListingdetailsModal ? (
          <ProductDetails
            open={activeListingdetailsModal}
            data={listings[activeListingIndex]}
            fetchListings={() => fetchListings(1)}
            onClose={() => setActiveListingDetailsModal(false)}
          />
        ) : (
          ""
        )}

        <CustomerFilters
          fetchListings={() => fetchListings(1)}
          changeStore={(e) => setStore(e)}
          changeChance={(e) => setChance(e)}
        />

        <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
          <div className="">
            <div className="">
              <p className="text-gray-900 text-base">
                {resultCount} Results found
              </p>
              <p className="text-gray-900 mt-1 text-base">
                ({resultCount} of 745) voted
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
                <div className="w-full overflow-hidden">
                  <div className=" mt-2">
                    <div className="flex overflow-x-auto gap-3 medium-x-scrollbar">
                      {listings &&
                        listings.map((row, index) => {
                          return (
                            <div
                              key={index}
                              className="flex-shrink-0 !w-80"
                            >
                              <div
                                style={{
                                  boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                                }}
                                className="px-4 py-4 relative cursor-pointer hover:opacity-90 rounded-3xl mx-2 my-2 w-full "
                                key={row.id}
                                onClick={() => triggerDetailsModal(index)}
                              >
                                <Image
                                  src={row.mainImageUrl || placeholder}
                                  width={100}
                                  height={100}
                                  className="rounded !w-full !h-64 object-cover"
                                  alt="image not found"
                                />

                                <div className="flex items-center justify-between w-40 pr-2 mt-6 mb-3 mx-auto">
                                  <button
                                    onClick={(e) => toggleLike(index, e)}
                                    className=" cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class={`w-12 h-12 ${
                                        voteUIHandler(row.id) === "UP"
                                          ? "stroke-yellow-400 "
                                          : ""
                                      }`}
                                      width="44"
                                      height="44"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="#2c3e50"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                      />
                                      <path d="M10.363 20.405l-8.106 -13.534a1.914 1.914 0 0 1 1.636 -2.871h16.214a1.914 1.914 0 0 1 1.636 2.871l-8.106 13.534a1.914 1.914 0 0 1 -3.274 0z" />
                                    </svg>
                                  </button>

                                  <button
                                    onClick={(e) => toggleUnLike(index, e)}
                                    className=" cursor-pointer hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class={`w-12 h-12 ${
                                        voteUIHandler(row.id) === "DOWN"
                                          ? "stroke-green-400 "
                                          : ""
                                      }`}
                                      width="44"
                                      height="44"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="#2c3e50"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                      />
                                      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                                    </svg>
                                  </button>
                                  <h3 className="text-gray-500 font-base absolute right-4 bottom-2">
                                    {moment(row.createdAt).fromNow()}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div
                    id="inventory-matches-pagination"
                    className="flex justify-center"
                  >
                    {pagination &&
                      pagination.total_pages > 1 &&
                      !loadingListings && (
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
