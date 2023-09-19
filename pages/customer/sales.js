
import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerSalesFilters from "@/components/customer/CustomerSalesFilters";
import Loading from "@/components/utility/loading";
import moment from 'moment'
import "swiper/css";
export default function Home() {
  const [loadingUpcomingSales, setLoadingUpcomingSales] = useState(false);
  const [loadingCurrentSales, setLoadingCurrentSales] = useState(false);

  const [currentSales, setCurrentSales] = useState([]);
  const [upcomingSales, setUpcomingSales] = useState([]);

  const [filter, setFilter] = useState("");
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');
  // add
  const [image, setImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputVisible, setInputVisible] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [detailsModal, setDetailsModal] = useState(false);
  const [activeTagIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState("clothing");



  // add end



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

  const [searchTerm, setSearchTerm] = useState("");



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



  const fetchSales = async (saleType) => {
    if (saleType === 'current') {
      setLoadingCurrentSales(true);
    } else {
      setLoadingUpcomingSales(true);
    }

    try {
      const res = await fetch(`/api/fetch-sales?type=${saleType}&name=${filter}&start_date=${type}&end_date=${size}`);
      if (res.status === 200) {
        const sales = await res.json();
        return sales;
      } else {
        const errorMessage = await res.text();
        console.error(`Fetch failed with status: ${res.status}, message: ${errorMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while fetching sales:', error);
    } finally {
      setLoadingUpcomingSales(false);
      setLoadingCurrentSales(false);
    }
  };

  const loadSales = useCallback(async (e) => {
    const current = await fetchSales("current");
    setCurrentSales(current);

    const upcoming = await fetchSales("upcoming");
    setUpcomingSales(upcoming);
  }, [type, size]);  // Only re-create if filter, type or size changes

  useEffect(() => {
    loadSales();
  }, [type, size, loadSales]);

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const sales = [...upcomingSales];
    sales[index].isLiked = !sales[index].isLiked
    setUpcomingSales(sales);
  };
  const toggleLikeCurrentSale = (index, event) => {
    event.stopPropagation();

    const sales = [...currentSales];
    sales[index].isLiked = !sales[index].isLiked
    setCurrentSales(sales);
  };





  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      <div>
        <CustomerSalesFilters
          fetchListings={() => loadSales()}
          changeFilter={(e) => setFilter(e)}
          changeType={(e) => setType(e)}
          changeSize={(e) => setSize(e)}
          changeZipCode={(e) => setZipCode(e)}
          changeRadius={(e) => setRadius(e)}
        />

        <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
          <div className="mt-8">
            {/* <div className="flex justify-between items-center">
              <p className="text-gray-900 text-base">
                {resultCount} Results found
              </p>


            </div> */}

            <div>
              <h3 className="text-xl text-center font-medium text-primary">Upcoming Sales</h3>
              {loadingUpcomingSales ? (
                <div className="sm:flex justify-center pb-10">
                  <div>

                    <div className="pt-2.5 mt-10">
                      <Loading size="xl" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {upcomingSales.length !== 0 ? <div className="sm:flex flex-wrap justify-center mt-2">

                    {upcomingSales.map((row, index) => {
                      return (
                        <div
                          className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:sm:w-[500px]  shadow-lg"
                          style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                          key={row.id}
                        >
                          <button onClick={(e) => toggleLike(index, e)} className="hover:bg-green-200 cursor-pointer hover:opacity-90 w-10 h-10 absolute top-2 right-2 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-6 h-6 ${row.isLiked ? 'fill-green-400 text-green-400' : ''}`}>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          </button>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Business name:</span> <span className="w-1/2">BiblioPal</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Name of sale:</span> <span className="w-1/2">{row.name}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">{row.items}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Discount amount:</span> <span className="w-1/2">{row.discount_amount}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Start date:</span> <span className="w-1/2">{moment(row.start_date).format('YYYY/MM/DD')}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">End date:</span> <span className="w-1/2">  {moment(row.end_date).format('YYYY/MM/DD')}</span>
                          </div>

                        </div>

                      );
                    })}

                  </div> :
                    <h3 className="text-center text-lg mt-5">
                      No Upcoming Sales
                    </h3>
                  }
                </div>
              )}
            </div>

            <div className="mt-12">
              <h3 className="text-xl text-center font-medium text-primary">Current Sales</h3>
              {loadingCurrentSales ? (
                <div className="sm:flex justify-center pb-10">
                  <div>

                    <div className="pt-2.5 mt-10">
                      <Loading size="xl" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {currentSales.length !== 0 ? <div className="sm:flex flex-wrap justify-center mt-2">

                    {currentSales.map((row, index) => {
                      return (
                        <div
                          className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:sm:w-[500px]  shadow-lg"
                          style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                          key={row.id}
                        >
                          <button onClick={(e) => toggleLikeCurrentSale(index, e)} className="hover:bg-green-200 cursor-pointer hover:opacity-90 w-10 h-10 absolute top-2 right-2 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-6 h-6 ${row.isLiked ? 'fill-green-400 text-green-400' : ''}`}>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          </button>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Business name:</span> <span className="w-1/2">BiblioPal</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Name of sale:</span> <span className="w-1/2">{row.name}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">{row.items}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Discount amount:</span> <span className="w-1/2">{row.discount_amount}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">Start date:</span> <span className="w-1/2">{moment(row.start_date).format('YYYY/MM/DD')}</span>
                          </div>
                          <div
                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                          >
                            <span className="w-1/2">End date:</span> <span className="w-1/2">  {moment(row.end_date).format('YYYY/MM/DD')}</span>
                          </div>

                        </div>

                      );
                    })}

                  </div> :
                    <h3 className="text-center text-lg mt-5">
                      No Current Sales
                    </h3>}

                </div>
              )}
            </div>
          </div>
        </section>
      </div >




    </div >
  );
}
