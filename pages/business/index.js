import { useState, useEffect, useCallback } from "react";
import BusinessFilters from "@/components/consumer/BusinessFilters";
import { useSession } from "next-auth/react";
import HeaderComponent from "@/components/utility/BusinessHeader";
import { NotificationManager } from "react-notifications";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import EditTagsModal from "@/components/utility/EditTagsModal";
import ProductDetails from "@/components/utility/ProductDetails";
import ModalComponent from "@/components/utility/Modal";
import ListingItem from "@/components/utility/ListingItem";
import ButtonComponent from "@/components/utility/Button";
import AddListing from "@/components/scoped/AddListing";

export default function Home() {
  const { data: session } = useSession();

  console.log(session);

  const [searchText, setSearchText] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("view");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);
  const [tagEditModal, setTagEditModal] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [notMatchesPage, setNotMatchesPage] = useState(1);
  const [detailsModal, setDetailsModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
  const fetchListings = useCallback(
    async (e) => {
      setLoadingListings(true);

      try {
        const res = await fetch(
          `/api/common/fetch-listings?limit=15&page=${e}&searchText=${searchText}&apparel=${category}&status=${status}&size=${size}`
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
    [searchText, category, status, size]
  );

  // useEffect(() => {
  //   const initialFetch = async () => {
  //     await fetchListings(1);
  //   };
  //   initialFetch();
  // }, [size, fetchListings]);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchListings(1);
    };
    initialFetch();
  }, [category, status, size, fetchListings]);

  const onPaginationChange = (e) => {
    setNotMatchesPage(e);
    fetchListings(e);
  };

  const triggerDetailsModal = (index) => {
    setDetailsModal(true);
    setActiveIndex(index);
  };

  const triggerDeleteModal = (index) => {
    setActiveDeleteIndex(index);
    setDeleteModal(true);
  };

  const triggerEditTagsModal = (index) => {
    setTagEditModal(true);
    setActiveTagIndex(index);
  };

  const onConfirmDeleteListing = async () => {
    setDeleteLoading(true);
    const id = listings[activeDeleteIndex] && listings[activeDeleteIndex].id;
    try {
      const res = await fetch(`/api/business/listing/delete-listing/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const errorData = await res.json();
      setDeleteLoading(false);
      if (res.status === 200) {
        setDeleteModal(false);
        fetchListings();
        NotificationManager.success(errorData.message);
      } else {
        // Handle error
        const errorData = await res.json();
        NotificationManager.error(errorData);
      }
    } catch (error) {
      console.error("An error occurred while deleting the listing", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      {detailsModal ? (
        <ProductDetails
          open={detailsModal}
          imageOnly={true}
          onClose={() => setDetailsModal(false)}
          data={listings[activeIndex]}
          fetchListings={() => fetchListings(1)}
        />
      ) : (
        ""
      )}

      {mode === "view" ? (
        <div>
          <BusinessFilters
            fetchListings={() => fetchListings(1)}
            changeSearchText={(e) => setSearchText(e)}
            changeCategory={(e) => setCategory(e)}
            changeStatus={(e) => setStatus(e)}
            changeSize={(e) => setSize(e)}
          />
          <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3 w-full">
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="text-gray-900 text-base">
                  {pagination.total} Results found
                </p>

                <ButtonComponent
                  onClick={() => setMode("adding")}
                  rounded
                  className="!px-7 !py-1.5"
                >
                  Add listing
                </ButtonComponent>
              </div>

              <div className="w-full">
                {loadingListings ? (
                  <div className="sm:flex justify-center pb-10">
                    <div>
                      <div className="pt-2.5 mt-10">
                        <Loading size="xl" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="sm:flex flex-wrap justify-center w-full">
                      {listings.map((row, key) => {
                        return (
                          <div
                            key={key}
                            onClick={() => triggerDetailsModal(key)}
                          >
                            <ListingItem
                              mainPhoto={row?.mainImage}
                              brandPhoto={row?.brandImage}
                              tags={row?.tags}
                              clickable={true}
                            >
                              <button
                                onClick={() => triggerEditTagsModal(key)}
                                className="bg-primary mr-2 text-white px-3 py-1 text-xs mt-1 rounded"
                              >
                                Edit Tags
                              </button>
                              <button
                                onClick={() => triggerDeleteModal(key)}
                                className="bg-primary absolute top-3 right-4 text-white px-1 py-1 text-xs mt-1 rounded"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="w-5 h-5"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </ListingItem>
                          </div>
                        );
                      })}

                      {listings.length === 0 ? (
                        <p className="text-2xl mt-5">No Listings</p>
                      ) : (
                        ""
                      )}
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
      ) : (
        <AddListing
          onBack={() => setMode("view")}
          onFecth={() => fetchListings(1)}
        />
      )}

      <ModalComponent
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Confirm delete listing"
        footer={
          <div className="flex justify-end w-full">
            <ButtonComponent
              rounded
              id="close-unsubscribe-modal-btn"
              className="!mx-1 !px-5"
              loading={deleteLoading}
              onClick={() => onConfirmDeleteListing()}
            >
              Delete
            </ButtonComponent>
          </div>
        }
      >
        <>
          <h4 className="text-base">
            Are you sure you want to delete listing?
          </h4>
        </>
      </ModalComponent>

      <EditTagsModal
        open={tagEditModal}
        listingId={listings[activeTagIndex]?.id}
        tags={listings[activeTagIndex] && listings[activeTagIndex].tags}
        onFecth={() => fetchListings(1)}
        onClose={() => setTagEditModal(false)}
      />
    </div>
  );
}
