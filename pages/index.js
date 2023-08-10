import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import HeaderComponent from "@/components/utility/Header";
import TooltipComponent from "@/components/utility/Tooltip";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import Shirt from '../assets/shirt.png'
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import AddCloths from "@/components/scoped/AddCloths";
import ModalComponent from "@/components/utility/Modal";
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
            <div class="flex items-center justify-end mt-2 sm:mt-0">
              <div class="ml-2 sm:ml-3">
                <button
                  type="button"
                  class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl"
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

          <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
            <div className="">
              <div className="flex justify-between items-center">
                <p className="text-gray-900 text-base">
                  {resultCount} Results found
                </p>

                <ButtonComponent onClick={() => setMode('adding')} rounded className="!px-7 !py-1.5">Add listing</ButtonComponent>
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
                    <div className="sm:flex flex-wrap justify-center">

                      {testData.map((row, index) => {
                        return (
                          // border-[#FF9C75]
                          <div
                            className="px-4 py-4 relative rounded-lg mx-2 my-2 w-full sm:w-96 border-2 shadow-lg border-[#E44A1F]"
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
                              <div className="w-full mb-3 ">
                                <div className="sm:h-36 sm:overflow-y-auto">

                                  {row.tags.map((tag, tagIndex) => (
                                    <p key={tagIndex} className="text-gray-800 text-base leading-5">
                                      {tag.name}: {tag.value}
                                    </p>
                                  ))}
                                </div>

                                <button onClick={() => triggerEditTagsModal(index)} className="bg-primary text-white px-3 py-1 text-xs mt-1 rounded">
                                  Edit Tags
                                </button>
                              </div>
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
      {
        tagEditModal ?
          <ModalComponent
            open={tagEditModal}
            title="Edit Tags"
            onClose={() => setTagEditModal(false)}
            footer={
              <div className="flex justify-end w-full">

                <button className=" bg-indigo-600 px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => setTagEditModal(false)}>Close</button>
              </div>
            }
          >
            {testData[activeTagIndex].tags.map((tag, tagIndex) => (
              <div key={tagIndex} className="py-1 w-full items-center flex !mt-1">
                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.name} onChange={(e) => handleUpdateTagName(activeTagIndex, tagIndex, e.target.value)} />
                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.value} onChange={(e) => handleUpdateTagValue(activeTagIndex, tagIndex, e.target.value)} />
                <button onClick={() => handleDeleteTag(activeTagIndex, tagIndex)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded">

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>


                </button>
              </div>
            ))}
            <button className=" bg-indigo-600 px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => handleAddTag(activeTagIndex)}>Add Tag</button>

          </ModalComponent> : ""
      }
    </div>
  );
}
