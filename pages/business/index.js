import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import BusinessFilters from "@/components/consumer/BusinessFilters";
import { useSession } from "next-auth/react";
import { NotificationManager } from "react-notifications";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import EditTagsModal from "@/components/utility/EditTagsModal";
import ProductDetails from "@/components/utility/ProductDetails";
import ModalComponent from "@/components/utility/Modal";
import ListingItem from "@/components/utility/ListingItem";
import ButtonComponent from "@/components/utility/Button";
import AddListing from "@/components/scoped/AddListing";
import PrintBarcodeForModal from "../../components/business/PrintBarcodeForModal";
import { useUser } from "../../context/UserContext";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [searchText, setSearchText] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("view");
  const [deleteModal, setDeleteModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [printData, setPrintData] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);
  const [tagEditModal, setTagEditModal] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [detailsModal, setDetailsModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingListings, setLoadingListings] = useState(true);
  const [isAutoRefreshOn, setIsAutoRefreshOn] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);
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

  const currentPageRef = useRef(pagination.current_page);

  useEffect(() => {
    currentPageRef.current = pagination.current_page;
  }, [pagination.current_page]);

  // Cleanup the interval when the component is unmounted
  useEffect(() => {
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [autoRefreshInterval]);

  const fetchListings = useCallback(
    async (e) => {
      try {
        const res = await fetch(
          `/api/common/fetch-listings?isBusiness=${true}&limit=15&page=${e}&searchText=${searchText}&apparel=${category}&status=${status}&size=${size}`
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

  useEffect(() => {
    const initialFetch = async () => {
      await fetchListings(1);
      handleAutoRefresh(isAutoRefreshOn);
    };
    initialFetch();
  }, [category, status, size, fetchListings]);

  const onPaginationChange = (e) => {
    setLoadingListings(true);
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

  const setAutoRefreshOn = (isOn) => {
    setTimeout(() => {
      const isChecked = !isOn;
      setIsAutoRefreshOn(isChecked);
      handleAutoRefresh(isChecked);
    }, 100);
  };

  const handleAutoRefresh = (isOn) => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(0);
    }
    if (isOn) {
      const interval = setInterval(async () => {
        await fetchListings(currentPageRef.current);
      }, 5000);
      setAutoRefreshInterval(interval);
    }
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
        fetchListings(pagination.current_page);
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

  const printSKU = (e, Barcode, price, tinyUrl) => {
    e.stopPropagation();
    setPrintData({ Barcode, price, tinyUrl });
    setPrintModal(true);
  };

  return (
    <div className="bg-white">
      <Head>
        <title>Listings</title>
      </Head>

      <ProductDetails
        open={detailsModal}
        imageOnly={true}
        onClose={() => setDetailsModal(false)}
        data={listings[activeIndex]}
        fetchListings={() => fetchListings(pagination.current_page)}
      />

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
                <div className="flex items-center gap-4">
                  <p className="text-gray-900 text-xs sm:text-lg">
                    {pagination.total} Results found
                  </p>

                  <div
                    class="rounded flex items-center gap-2"
                    onClick={() => setAutoRefreshOn(isAutoRefreshOn)}
                  >
                    <h3 className=" text-xs sm:text-lg">Auto Refresh</h3>
                    <span
                      role="checkbox"
                      aria-checked=""
                      tabindex="0"
                      className={`mr-4 relative inline-flex flex-shrink-0 h-5 sm:h-6 w-10 sm:w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline ${
                        isAutoRefreshOn === true ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={` inline-block h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${
                          isAutoRefreshOn === true
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                        aria-hidden="true"
                      ></span>
                    </span>
                  </div>
                </div>

                <ButtonComponent
                  onClick={() => setMode("adding")}
                  rounded
                  padding="none"
                  className="!px-3 sm:!px-7 !py-1.5"
                  disabled={!user.business || !user.business.squareAccessToken}
                >
                  Add listing
                </ButtonComponent>
              </div>

              <div className="w-full mt-2">
                {loadingListings ? (
                  <div className=" w-full mt-10">
                    <div>
                      <div className="">
                        <Loading size="xl" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="sm:flex flex-wrap sm:gap-3 justify-center w-full">
                      {listings.map((row, key) => {
                        return (
                          <div
                            key={key}
                            onClick={() => triggerDetailsModal(key)}
                          >
                            <ListingItem
                              mainPhoto={
                                row?.mainImage
                                  ? row.mainImage
                                  : row.mainImageUrl
                              }
                              brandPhoto={
                                row?.brandImage
                                  ? row.brandImage
                                  : row.brandImageUrl
                              }
                              tags={[
                                row.status === "SALE" ? "Active" : row.status,
                              ]}
                              status={row.status}
                              clickable={true}
                              Barcode={row.Barcode}
                              price={row.price}
                              printSKU={printSKU}
                              tinyUrl={row.tinyUrl}
                            >
                              <button
                                onClick={() => triggerEditTagsModal(key)}
                                className="bg-primary mr-2 text-white px-3 py-1 text-xs mt-1 rounded hidden"
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
                                  className="w-5 h-5"
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
                        user.business.squareAccessToken ? (
                          <p className="text-2xl mt-5">No Listings</p>
                        ) : (
                          <div className="flex justify-center w-1/2 bg-white shadow mt-5 px-4 py-4 rounded-3xl">
                            <div>
                              <p className="text-xl mt-5 text-center">
                                Square account not authorized, please navigate
                                to the profile page and authorize Square to
                                begin listing products.
                              </p>
                              <div className="max-w-[20rem] mx-auto">
                                <Link href="/business/profile">
                                  <ButtonComponent
                                    className="mt-3"
                                    rounded
                                    full
                                  >
                                    Connect Square Account
                                  </ButtonComponent>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
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
                            current={pagination.current_page}
                            pageSize={pagination.limit_per_page}
                            onChange={(e) => onPaginationChange(e)}
                          />
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <AddListing
          onBack={() => setMode("view")}
          onFetch={() => fetchListings(pagination.total_pages)}
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
        onFetch={() => fetchListings(pagination.current_page)}
        onClose={() => setTagEditModal(false)}
      />
      <ModalComponent
        open={printModal}
        onClose={() => setPrintModal(false)}
        title="Print SKU"
        width="600px"
      >
        <>
          <PrintBarcodeForModal
            sku={printData.Barcode}
            price={printData.price}
            tinyUrl={printData.tinyUrl}
          />
        </>
      </ModalComponent>
    </div>
  );
}
