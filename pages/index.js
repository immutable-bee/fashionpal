import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import HeaderComponent from "@/components/utility/Header";
import TooltipComponent from "@/components/utility/Tooltip";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import EditTagsModal from "@/components/utility/EditTagsModal";
import Shirt from '../assets/shirt.png'
import Image from "next/image";
import ListingItem from "@/components/utility/ListingItem";
import ButtonComponent from "@/components/utility/Button";
import AddCloths from "@/components/scoped/AddCloths";
import cloneDeep from "lodash.clonedeep";
export default function Home() {

  // add
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [tagEditModal, setTagEditModal] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);

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
  // add end
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([
    {
      id: 1,
      mainPhoto: Shirt,
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
  ]);

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
  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />
      {mode === 'view' ?
        <div>
          <div class=" flex justify-between px-5 max-w-7xl mx-auto">
            <Inputcomponent
              handleSearch={fetchSearchResults}
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <div class="flex items-center justify-end">
              <div class="ml-2 sm:ml-3">
                <button
                  type="button"
                  class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
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
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

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
                      <p className="me-1">{loadingMessage()}</p>
                      <div className="pt-2.5">
                        <Loading />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="sm:flex flex-wrap justify-center w-full">

                      {listings.map((row, key) => {
                        return (
                          <ListingItem key={key} mainPhoto={row.mainPhoto} tags={row.tags}>
                            <button onClick={() => triggerEditTagsModal(key)} className="bg-primary text-white px-3 py-1 text-xs mt-1 rounded">
                              Edit Tags
                            </button>
                          </ListingItem>
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
        </div> :
        <AddCloths onBack={() => setMode('view')} />

      }
      <EditTagsModal
        open={tagEditModal}
        onClose={() => setTagEditModal(false)}
        handleDeleteTag={(index) => handleDeleteTag(index)}
        handleAddTag={() => handleAddTag()}
        editTagName={(index, e) => editTagName(index, e)}
        editTagValue={(index, e) => editTagValue(index, e)}
        data={listings[activeTagIndex].tags}
      />
    </div>
  );
}
