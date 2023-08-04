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
export default function Home() {

  // add
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

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
  // add end
  const [loadingListings, setLoadingListings] = useState(false);
  const [listings, setListings] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("title");
  const [mode, setMode] = useState("adding");

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
      title: "test title",
      color: "Pink",
      size: "Medium",
      length: "Short",
      description: "lorem ipsum dolar sit ami",
    },
    {
      id: 1,
      image_url: Shirt,
      title: "test title",
      color: "Pink",
      size: "Medium",
      length: "Short",
      description: "lorem ipsum dolar sit ami",
    },
    {
      id: 1,
      image_url: Shirt,
      title: "test title",
      color: "Pink",
      size: "Medium",
      length: "Short",
      description: "lorem ipsum dolar sit ami",
    },
    {
      id: 1,
      image_url: Shirt,
      title: "test title",
      color: "Pink",
      size: "Medium",
      length: "Short",
      description: "lorem ipsum dolar sit ami",
    },
  ];
  return (
    <div className="bg-[#FEFBE8] min-h-screen">
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
                  class="bg-[#9BCC2C] px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl"
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

                <ButtonComponent onClick={() => setMode('adding')} rounded className="!py-1.5">Add Cloth</ButtonComponent>
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

                      {testData.map((data, i) => {
                        return (
                          <div
                            className="px-4 py-4 relative rounded-lg border sm:mx-3 my-2 sm:my-3 w-full sm:w-96 border-[#2eaaed]"
                            key={data.id}
                          >
                            <div className="flex">
                              <div className="w-24 my-auto flex-shrink-0 mr-3 rounded-lg">
                                <Image
                                  src={data.image_url}
                                  className="rounded"
                                  alt=""
                                />
                              </div>
                              <div className="w-full mb-3 ">
                                <h3 className="text-black max-h-[3.5rem] overflow-y-auto text-lg font-semibold">
                                  {data.title}
                                </h3>
                                <p className="text-gray-800 text-base leading-5">
                                  color: {data.color}
                                </p>
                                <p className="text-gray-800 text-base leading-5">
                                  size: {data.size}
                                </p>
                                <p className="text-gray-800 text-base leading-5">
                                  length: {data.length}
                                </p>
                                <p className="text-gray-800 text-base leading-5">
                                  {data.description}
                                </p>
                                <button className="bg-[#FEDDBC] px-3 py-1 text-xs mt-1 rounded">
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
        // <div className="flex max-w-7xl mx-auto">
        //   <div className="px-5 mt-6">
        //     <div className="flex items-center">
        //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
        //         <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        //       </svg>
        //       <h3 className="ml-3 text-xl">
        //         Add Cloth
        //       </h3>
        //     </div>



        //     {inputVisible ? (
        //       <label className="rounded-2xl mt-8 cursor-pointer hover:opacity-70 flex items-center justify-center border-2 border-black w-64 h-56">
        //         <input type="file" accept="image/*" capture="user" className="sr-only" onChange={handleImageChange} />
        //         <h1 className="text-5xl text-center font-semibold font-serif">Take a Photo</h1>
        //       </label>
        //     ) : (
        //       <>
        //         <div className="mt-8 border-2 border-black rounded-2xl px-4 py-10 w-64 relative">
        //           <Image src={image} alt="Uploaded preview" width={1} height={1} className="rounded w-full" />
        //           <button onClick={handleDelete} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 absolute -top-2 right-2 z-10 px-1.5 rounded">
        //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        //               <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        //             </svg>

        //           </button>
        //         </div>
        //         <div className="mt-4">
        //           <button onClick={() => handleTagClick("Main Photo")} className={`px-4 py-2 rounded ${selectedTag === "Main Photo" ? "bg-green-500" : "bg-white"} text-black`}>Main Photo</button>
        //           <button onClick={() => handleTagClick("Brand Tag Photo")} className={`px-4 py-2 rounded ${selectedTag === "Brand Tag Photo" ? "bg-green-500" : "bg-white"} text-black`}>Brand Tag Photo</button>
        //           <button onClick={() => handleTagClick("Front Photo")} className={`px-4 py-2 rounded ${selectedTag === "Front Photo" ? "bg-green-500" : "bg-white"} text-black`}>Front Photo</button>
        //           <button onClick={handleAdd} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
        //         </div>
        //       </>
        //     )}

        //   </div>
        //   <div className="px-5 mt-6 w-1/2">
        //     {/* Uploaded Images Display */}
        //     {uploadedImages.map((item, index) => (
        //       <div key={index} className="mb-4">
        //         <img src={item.image} alt={item.tag} className="rounded w-32 h-32" />
        //         <span className="ml-4">{item.tag}</span>
        //         <button onClick={() => handleDelete(index)} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
        //       </div>
        //     ))}
        //   </div>
        // </div>
      }
    </div>
  );
}
