import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import HeaderComponent from "@/components/utility/Header";
import TooltipComponent from "@/components/utility/Tooltip";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import EditTagsModal from "@/components/utility/EditTagsModal";
import Shirt from '../../assets/shirt.png'
import Image from "next/image";
import ModalComponent from '@/components/utility/Modal';
import ListingItem from "@/components/utility/ListingItem";
import ButtonComponent from "@/components/utility/Button";
import AddCloths from "@/components/scoped/AddCloths";
import cloneDeep from "lodash.clonedeep";
export default function Home() {

  // add
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [tagEditModal, setTagEditModal] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [notMatchesPage, setNotMatchesPage] = useState(1);
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

  const onPaginationChange = (e) => {
    console.log(e)
    setNotMatchesPage(e)
    fetchListings(e)
  }

  const triggerDeleteModal = (index) => {
    setActiveDeleteIndex(index)
    setDeleteModal(true)
  };

  const triggerEditTagsModal = (index) => {
    setTagEditModal(true)
    setActiveTagIndex(index)
  }

  const onDeleteListing = async () => {
    setDeleteLoading(true)
    const id = listings[activeDeleteIndex] && listings[activeDeleteIndex].id
    try {
      const res = await fetch(`/api/delete-listing/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const errorData = await res.json();
      setDeleteLoading(false)
      if (res.status === 200) {
        setDeleteModal(false)
        fetchListings()
        alert(errorData.message)
      } else {
        // Handle error
        const errorData = await res.json();
        alert(errorData);
      }
    } catch (error) {
      console.error("An error occurred while deleting the listing", error);
    }

  };

  // add end
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

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("title");
  const [mode, setMode] = useState("view");

  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // pagination

  const [inventoryMatchesPage, setInventoryMatchesPage] = useState(1);

  const openRequestsItemsPerPage = 2;

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

  const fetchListings = async (e) => {
    setLoadingListings(true);

    try {
      const res = await fetch(`/api/fetch-listings?limit=1&page=${e}`);

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

  const arrayToMap = searchResults.length > 0 ? searchResults : listings;

  const resultCount =
    searchResults.length > 0 ? searchResults.length : listings.length;


  const handleDeleteTag = (tagIndex) => {
    const newListing = cloneDeep(listings)
    newListing[activeTagIndex].tags.splice(tagIndex, 1);
    setListings(newListing);
  }
  const editTagName = (tagIndex, name) => {
    console.log(name)
    const newListing = cloneDeep(listings)
    newListing[activeTagIndex].tags[tagIndex].name = name
    console.log(newListing[activeTagIndex].tags)
    setListings(newListing);
  }
  const editTagValue = (tagIndex, value) => {
    console.log(value)
    const newListing = cloneDeep(listings)
    newListing[activeTagIndex].tags[tagIndex].value = value
    setListings(newListing);
  }

  const handleAddTag = () => {
    const newTag = {
      name: "",  // or some default value
      value: ""  // or some default value
    };
    const newListing = [...listings];
    newListing[activeTagIndex].tags.push(newTag);
    setListings(newListing);
  }

  const onPageChange = (page) => {
    console.log(page)
  }
  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />
      {mode === 'view' ?
        <div>

          <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3 w-full">
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="text-gray-900 text-base">
                  {resultCount} Results found
                </p>

                <ButtonComponent onClick={() => setMode('adding')} rounded className="!px-7 !py-1.5">Add listing</ButtonComponent>
              </div>

              <div className="w-full">
                {loadingListings || loadingSearchResults ? (
                  <div className="sm:flex justify-center pb-10">
                    <div>
                      {/* <p className="me-1">{loadingMessage()}</p> */}
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
                          <ListingItem key={key} mainPhoto={row?.mainImage?.url} tags={row?.tags}>
                            <button onClick={() => triggerEditTagsModal(key)} className="bg-primary mr-2 text-white px-3 py-1 text-xs mt-1 rounded">
                              Edit Tags
                            </button>
                            <button onClick={() => triggerDeleteModal(key)} className="bg-primary absolute top-3 right-4 text-white px-1 py-1 text-xs mt-1 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </ListingItem>
                        );
                      })}

                      {listings.length === 0 ? (
                        <p className="text-2xl mt-5">No Listings</p>
                      ) : ''
                      }
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
        </div> :
        <AddCloths onBack={() => setMode('view')} onFecth={() => fetchListings(1)} />
      }

      <ModalComponent open={deleteModal}
        onClose={() => setDeleteModal(false)} title="Confirm delete listing"
        footer={
          <div className="flex justify-end w-full">
            <ButtonComponent
              rounded
              id="close-unsubscribe-modal-btn" className="!mx-1 !px-5" loading={deleteLoading}
              onClick={() => onDeleteListing()}
            >
              Delete
            </ButtonComponent>
          </div>
        }
      >
        <>
          <h4 className="text-base">Are you sure you want to delete listing?</h4>
        </>
      </ModalComponent>
      <EditTagsModal
        open={tagEditModal}
        onClose={() => setTagEditModal(false)}
        handleDeleteTag={(index) => handleDeleteTag(index)}
        handleAddTag={() => handleAddTag()}
        editTagName={(index, e) => editTagName(index, e)}
        editTagValue={(index, e) => editTagValue(index, e)}
        listingId={listings[activeTagIndex]?.id}
        onFecth={() => fetchListings(1)}
        tags={listings[activeTagIndex] && listings[activeTagIndex].tags}
      />
    </div>
  );
}
