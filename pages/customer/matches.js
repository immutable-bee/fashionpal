// import { useState, useEffect } from "react";
// import Inputcomponent from "@/components/utility/Input";
// import HeaderComponent from "@/components/utility/Header";
// import TooltipComponent from "@/components/utility/Tooltip";
// import Loading from "@/components/utility/loading";
// import PaginationComponent from "@/components/utility/Pagination";
// import Shirt from '../../assets/shirt.png'
// import Image from "next/image";
// import ButtonComponent from "@/components/utility/Button";
// import AddCloths from "@/components/scoped/AddCloths";
// import Shirt2 from '../../assets/shirt-2.jpg';
// import ProductDetails from "@/components/utility/ProductDetails";
// import ModalComponent from "@/components/utility/Modal";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import ListingItem from "@/components/utility/ListingItem";
// export default function Home() {

//   // add
//   const [image, setImage] = useState(null);
//   const [selectedTag, setSelectedTag] = useState(null);
//   const [inputVisible, setInputVisible] = useState(true);
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [type, setType] = useState('Clothing');
//   const [size, setSize] = useState('');

//   const [sizes, setSizes] = useState([
//     { value: 'XS', type: '' },
//     { value: 'S', type: '' },
//     { value: 'M', type: '' },
//     { value: 'L', type: '' },
//     { value: 'XL', type: '' },
//     { value: 'XXL', type: '' },
//     { value: 1, type: 'Footwear' },
//     { value: 2, type: 'Footwear' },
//     { value: 3, type: 'Footwear' },
//     { value: 4, type: 'Footwear' },
//     { value: 5, type: 'Footwear' },
//     { value: 6, type: 'Footwear' },
//     { value: 7, type: 'Footwear' },
//     { value: 8, type: 'Footwear' },
//     { value: 9, type: 'Footwear' },
//     { value: 10, type: 'Footwear' },
//     { value: 11, type: 'Footwear' },
//     { value: 12, type: 'Footwear' },
//     { value: 13, type: 'Footwear' },
//     { value: 14, type: 'Footwear' },
//     { value: 15, type: 'Footwear' },
//   ])

//   const [detailsModal, setDetailsModal] = useState(false);
//   const [activeTagIndex, setActiveIndex] = useState(0);
//   const [detailsChildModal, setDetailsChildModal] = useState(false);
//   const [activeTagChildIndex, setActiveChildIndex] = useState(0);
//   const [active, setActive] = useState("clothingorfootwear");
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const blobURL = URL.createObjectURL(file);
//     setImage(blobURL);
//     setSelectedTag(null);
//     setInputVisible(false);
//   };

//   const handleTagClick = (tag) => {
//     setSelectedTag(tag);
//   };

//   const handleAdd = () => {
//     if (image && selectedTag) {
//       setUploadedImages([...uploadedImages, { image, tag: selectedTag }]);
//       setImage(null);
//       setSelectedTag(null);
//       setInputVisible(true);
//     }
//   };

//   const handleDelete = (index) => {
//     setUploadedImages(uploadedImages.filter((_, i) => i !== index));
//   };

//   const triggerEditTagsModal = (index) => {
//     setTagEditModal(true)
//     setActiveTagIndex(index)
//   };
//   const handleActiveChange = (newActive) => {
//     setActive(newActive);
//     setFilter(newActive.toLowerCase());
//   };

//   // add end
//   const [loadingListings, setLoadingListings] = useState(false);
//   const [listings, setListings] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("title");
//   const [mode, setMode] = useState("view");

//   const [loadingSearchResults, setLoadingSearchResults] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);

//   // pagination

//   const [inventoryMatchesPage, setInventoryMatchesPage] = useState(1);

//   const openRequestsItemsPerPage = 7;

//   const paginateData = (data, currentPage, itemsPerPage) => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     return data.slice(startIndex, endIndex);
//   };
//   // pagination end

//   const calculateDaysAgo = (dateListed) => {
//     const listedDate = new Date(dateListed);

//     const currentDate = new Date();

//     const diffTime = Math.abs(currentDate - listedDate);

//     // Calculate the difference in days
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     // If the difference is more than one day, return it as "x days ago"
//     // If it's exactly one day, return "1 day ago"
//     // Else if it's less than a day, return "Today"
//     if (diffDays > 1) {
//       return `${diffDays} days ago`;
//     } else if (diffDays === 1) {
//       return `1 day ago`;
//     } else {
//       return "Today";
//     }
//   };

//   const fetchListings = async () => {
//     const res = await fetch("/api/fetch-listings");

//     if (res.status === 200) {
//       const data = await res.json();
//       setListings(data);
//     }
//   };

//   useEffect(() => {
//     const initialFetch = async () => {
//       setLoadingListings(true);
//       await fetchListings();
//       setLoadingListings(false);
//     };
//     initialFetch();
//   }, []);

//   const fetchSearchResults = async () => {
//     setLoadingSearchResults(true);
//     const res = await fetch("/api/fetch-searchResults", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ searchTerm, filter }),
//     });

//     if (res.status === 200) {
//       const data = await res.json();
//       setSearchResults(data);
//       setLoadingSearchResults(false);
//     }
//   };

//   const loadingMessage = () => {
//     if (loadingListings === true) {
//       return "Loading";
//     } else if (loadingSearchResults === true) {
//       return "Searching";
//     }
//   };

//   const arrayToMap = searchResults.length > 0 ? searchResults : listings;

//   const resultCount =
//     searchResults.length > 0 ? searchResults.length : listings.length;

//   const testData = [
//     {
//       id: 1,
//       mainPhoto: Shirt,
//       matches: 12,
//       tags: [
//         { name: 'color', value: 'pink' },
//         { name: 'size', value: 'medium' },
//         { name: 'sleeve length', value: 'short' },
//         { name: 'color', value: 'pink' },
//         { name: 'size', value: 'medium' },
//         { name: 'sleeve length', value: 'short' },
//         { name: 'color', value: 'pink' },
//         { name: 'size', value: 'medium' },
//         { name: 'sleeve length', value: 'short' },
//         { name: 'color', value: 'pink' },
//       ],
//       results: [
//         {
//           id: 1,
//           mainPhoto: Shirt,
//           brandTagPhoto: Shirt2,
//           tags: [
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//           ]
//         },
//         {
//           id: 1,
//           mainPhoto: Shirt,
//           brandTagPhoto: Shirt2,
//           tags: [
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//           ]
//         },
//         {
//           id: 1,
//           mainPhoto: Shirt,
//           brandTagPhoto: Shirt2,
//           tags: [
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//           ]
//         },

//       ]
//     },
//     {
//       id: 1,
//       mainPhoto: Shirt,
//       matches: 12,
//       tags: [
//         { name: 'color', value: 'pink' },
//         { name: 'size', value: 'medium' },
//         { name: 'sleeve length', value: 'short' },
//         { name: 'color', value: 'pink' },
//         { name: 'size', value: 'medium' },
//         { name: 'sleeve length', value: 'short' },
//         { name: 'color', value: 'pink' },
//         { name: 'size', value: 'medium' },
//         { name: 'sleeve length', value: 'short' },
//         { name: 'color', value: 'pink' },
//       ],
//       results: [
//         {
//           id: 1,
//           mainPhoto: Shirt,
//           brandTagPhoto: Shirt2,
//           tags: [
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//           ]
//         },
//         {
//           id: 1,
//           mainPhoto: Shirt,
//           brandTagPhoto: Shirt2,
//           tags: [
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//           ]
//         },
//         {
//           id: 1,
//           mainPhoto: Shirt,
//           brandTagPhoto: Shirt2,
//           tags: [
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//             { name: 'size', value: 'medium' },
//             { name: 'sleeve length', value: 'short' },
//             { name: 'color', value: 'pink' },
//           ]
//         },

//       ]
//     },


//   ];

//   const triggerDetailsModal = (index) => {
//     setDetailsModal(true)
//     setActiveIndex(index)
//   };

//   const triggerDetailsChildModal = (index) => {
//     setDetailsChildModal(true)
//     setActiveChildIndex(index)
//   };
//   return (
//     <div className="min-h-screen bg-white">
//       <HeaderComponent />

//       <div>
//         <div class="flex justify-between px-5 max-w-7xl mx-auto">
//           <Inputcomponent
//             handleSearch={fetchSearchResults}
//             filter={filter}
//             setFilter={setFilter}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
//           <div className="flex flex-shrink-0 items-center justify-end">

//             <div className="ml-2 sm:ml-3">
//               <button
//                 type="button"
//                 class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
//                 //onClick={fetchSearchResults}
//                 onClick={() => handleSearch(searchTerm, filter)}
//               >
//                 <div>
//                   <svg
//                     class="text-white w-4"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke-width="1.5"
//                     stroke="currentColor"
//                   >
//                     <path
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//                     />
//                   </svg>
//                 </div>
//               </button>
//             </div>
//           </div>

//         </div>
//         <ul className=" mt-2 flex justify-center items-center ml-2">
//           <div className="mx-1">
//             <label>Apparel</label>
//             <select className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600" onChange={(e) => setType(e.target.value)}>
//               <option value="Clothing">Clothing</option>
//               <option value="Footwear">Footwear</option>
//               <option value="Hats">Hats</option>
//             </select>
//           </div>

//           <div className="mx-1">
//             <label>Size</label>
//             <select
//               className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600"
//               onChange={(e) => setSize(e.target.value)}
//             >
//               {sizes.filter(x => type === 'Footwear' ? x.type === 'Footwear' : x.type !== 'Footwear').map(x => (
//                 <option key={x.value} value={x.value}>{x.value}</option>
//               ))}
//             </select>

//           </div>
//         </ul>

//         <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
//           <div className="">
//             <div className="flex justify-between items-center">
//               <p className="text-gray-900 text-base">
//                 {resultCount} Results found
//               </p>


//             </div>

//             <div className="">
//               {loadingListings || loadingSearchResults ? (
//                 <div className="sm:flex justify-center pb-10">
//                   <div>
//                     <p className="me-1">{loadingMessage()}</p>
//                     <div className="pt-2.5">
//                       <Loading />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="">
//                   <h3 className="text-xl text-center">Newly listed Clothes</h3>
//                   <div className="sm:flex flex-wrap justify-center mt-2">



//                     {testData.map((row, index) => {
//                       return (
//                         <div
//                           className="px-4 py-3 relative rounded-lg sm:mx-2 my-2 w-full sm:w-96 border-2 shadow-lg border-[#E44A1F]"
//                           key={row.id}
//                         >


//                           <div className="w-full mb-3 ">
//                             <div className="sm:h-36 sm:overflow-y-auto">

//                               {row.tags.map((tag, tagIndex) => (
//                                 <div
//                                   key={tagIndex}
//                                   className={`text-gray-800 font-light ${tagIndex % 2 === 0 ? 'bg-lightprimary' : 'bg-white'} rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
//                                 >
//                                   <span className="w-1/2">{tag.name}:</span> <span className="w-1/2">{tag.value}</span>
//                                 </div>
//                               ))}
//                             </div>
//                             <h3 className="text-lg font-light mt-3">12 Results</h3>
//                             <button onClick={() => triggerDetailsModal(index)} className="bg-primary text-white px-4 hover:opacity-90 py-1.5 text-base mt-2 rounded-lg">
//                               View matches
//                             </button>
//                           </div>
//                         </div>

//                       );
//                     })}

//                   </div>

//                   <div
//                     id="inventory-matches-pagination"
//                     className="flex justify-center"
//                   >
//                     {arrayToMap?.length > 0 && !loadingListings && (
//                       <PaginationComponent
//                         total={Math.ceil(
//                           arrayToMap.length / openRequestsItemsPerPage
//                         )}
//                         current={inventoryMatchesPage}
//                         onChange={(page) => setInventoryMatchesPage(page)}
//                       />
//                     )}
//                   </div>

//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
//       </div>

//       {
//         detailsModal ?
//           <ModalComponent
//             open={detailsModal}
//             title="Matches Details"
//             width="90vw"
//             onClose={() => setDetailsModal(false)}
//             footer={
//               <div className="flex justify-end w-full">
//                 <button className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => setDetailsModal(false)}>Close</button>
//               </div>
//             }
//           >
//             <div className="sm:flex flex-wrap justify-center mt-2">
//               {testData[activeTagIndex].results.map((row, key) => {
//                 return (
//                   <ListingItem key={key} mainPhoto={row.mainPhoto} tags={row.tags}>
//                     <button onClick={() => triggerDetailsChildModal(key)} className="bg-secondary mr-2 text-white hover:opacity-90 px-3 py-1 text-xs mt-1 rounded">
//                       View details
//                     </button>
//                   </ListingItem>



//                 );
//               })}

//             </div>
//           </ModalComponent> : ""
//       }

//       <ProductDetails
//         open={detailsChildModal}
//         onClose={() => setDetailsChildModal(false)}
//         data={testData[activeTagIndex].results[activeTagChildIndex]}
//       />

//     </div>
//   );
// }







import { useState, useEffect } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerFilters from "@/components/customer/CustomerFilters";
import Loading from "@/components/utility/loading";
import PaginationComponent from "@/components/utility/Pagination";
import ProductDetails from "@/components/utility/ProductDetails";
import ListingItem from "@/components/utility/ListingItem";
import ModalComponent from "@/components/utility/Modal";
import "swiper/css";
export default function Home() {

  const [filter, setFilter] = useState("");
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');
  const [detailsChildModal, setDetailsChildModal] = useState(false);
  const [activeTagChildIndex, setActiveChildIndex] = useState(0);

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
    setType(e.target.value)


  }

  const triggerDetailsModal = (index) => {
    setDetailsModal(true)
    setActiveIndex(index)
  };
  const handleActiveChange = (newActive) => {
    setActive(newActive);
    setFilter(newActive.toLowerCase());
  };

  // add end
  const [saveLoading, setLoadingSave] = useState(false);
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


  const onSave = async (row) => {
    setLoadingSave(true);

    try {
      const res = await fetch(`/api/edit-listing`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: row.id
        })
      });

      if (res.status === 200) {
        fetchListings(1)

      } else {
        const errorMessage = await res.text();
        console.error(`edit failed with status: ${res.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while edit listing:', error);
    } finally {
      setLoadingSave(false);
    }
  };

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
  }, [type, size]);


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

  const triggerDetailsChildModal = (index) => {
    setDetailsChildModal(true)
    setActiveChildIndex(index)
  };

  const loadingMessage = () => {
    if (loadingListings === true) {
      return "Loading";
    } else if (loadingSearchResults === true) {
      return "Searching";
    }
  };

  const onChangeSize = (e) => {
    setSize(e.target.value)
  }

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
                  <h3 className="text-xl text-center">Newly listed Clothes</h3>
                  <div className="sm:flex flex-wrap justify-center mt-2">



                    {listings.map((row, index) => {
                      return (
                        <div
                          className="px-4 py-3 relative rounded-lg sm:mx-2 my-2 w-full sm:w-96 border-2 shadow-lg border-[#E44A1F]"
                          key={row.id}
                        >


                          <div className="w-full mb-3 ">
                            <div className="sm:h-36 sm:overflow-y-auto">

                              {row.tags.map((tag, tagIndex) => (
                                <div
                                  key={tagIndex}
                                  className={`text-gray-800 font-light ${tagIndex % 2 === 0 ? 'bg-lightprimary' : 'bg-white'} rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                  <span className="w-1/2">{tag.name}:</span> <span className="w-1/2">{tag.value}</span>
                                </div>
                              ))}
                            </div>
                            <h3 className="text-lg font-light mt-3">12 Results</h3>
                            <button onClick={() => triggerDetailsModal(index)} className="bg-primary text-white px-4 hover:opacity-90 py-1.5 text-base mt-2 rounded-lg">
                              View matches
                            </button>
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
      </div>

      {
        detailsModal ?
          <ModalComponent
            open={detailsModal}
            title="Matches Details"
            width="90vw"
            onClose={() => setDetailsModal(false)}
            footer={
              <div className="flex justify-end w-full">
                <button className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => setDetailsModal(false)}>Close</button>
              </div>
            }
          >
            <div className="sm:flex flex-wrap justify-center mt-2">
              {listings.map((row, key) => {
                return (
                  <ListingItem key={key} mainPhoto={row?.mainImage?.url} tags={row.tags}>
                    <button onClick={() => triggerDetailsChildModal(key)} className="bg-secondary mr-2 text-white hover:opacity-90 px-3 py-1 text-xs mt-1 rounded">
                      View details
                    </button>
                  </ListingItem>



                );
              })}

            </div>
          </ModalComponent> : ""
      }

      <ProductDetails
        open={detailsChildModal}
        onClose={() => setDetailsChildModal(false)}
        data={listings[activeTagIndex]}
      />
      {/* ?.tags[activeTagChildIndex */}
    </div>
  );
}
