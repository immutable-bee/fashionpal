import { useState, useEffect, useCallback } from "react";
import HeaderComponent from "@/components/utility/Header";
import CustomerSalesFilters from "@/components/consumer/CustomerSalesFilters";
import Loading from "@/components/utility/loading";
import moment from "moment";
import "swiper/css";
import Link from "next/link";
export default function Home() {
  const [loadingUpcomingSales, setLoadingUpcomingSales] = useState(false);
  const [loadingCurrentSales, setLoadingCurrentSales] = useState(false);
  const [currentSales, setCurrentSales] = useState([]);
  const [upcomingSales, setUpcomingSales] = useState([]);
  const [serachText, setSearchText] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [mileRadius, setMileRadius] = useState("");
  const [startDate, setEndDate] = useState("");
  const [endDate, setStartDate] = useState("");

  const fetchSales = async (saleType) => {
    if (saleType === "current") {
      setLoadingCurrentSales(true);
    } else {
      setLoadingUpcomingSales(true);
    }

    try {
      const res = await fetch(
        `/api/fetch-sales?type=${saleType}&serachText=${serachText}&start_date=${startDate}&end_date=${endDate}&mile_radius=${mileRadius}&zip_code=${zipCode}`
      );
      if (res.status === 200) {
        const sales = await res.json();
        return sales;
      } else {
        const errorMessage = await res.text();
        console.error(
          `Fetch failed with status: ${res.status}, message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching sales:", error);
    } finally {
      setLoadingUpcomingSales(false);
      setLoadingCurrentSales(false);
    }
  };

  const loadSales = useCallback(
    async (e) => {
      const current = await fetchSales("current");
      if (current) {
        setCurrentSales(current);
      }

      const upcoming = await fetchSales("upcoming");
      if (upcoming) {
        setUpcomingSales(upcoming);
      }
    },
    [serachText, startDate, endDate, zipCode, mileRadius]
  ); // Only re-create if filter, type or size changes

  useEffect(() => {
    loadSales();
  }, [serachText, startDate, endDate, zipCode, mileRadius, loadSales]);

  const toggleLike = (index, event) => {
    event.stopPropagation();

    const sales = [...upcomingSales];
    sales[index].isLiked = !sales[index].isLiked;
    setUpcomingSales(sales);
  };
  const toggleLikeCurrentSale = (index, event) => {
    event.stopPropagation();

    const sales = [...currentSales];
    sales[index].isLiked = !sales[index].isLiked;
    setCurrentSales(sales);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderComponent />

      <div>
        <CustomerSalesFilters
          changeSearchText={(e) => setSearchText(e)}
          changeStartDate={(e) => setStartDate(e)}
          changeEndDate={(e) => setEndDate(e)}
          changeZipCode={(e) => setZipCode(e)}
          changeMileRadius={(e) => setMileRadius(e)}
          onFetch={() => loadSales()}
        />

        <section className="px-2 sm:px-5 mt-6 border-t-2 border-black py-3">
          <div className="mt-8">
            <div className="">
              <h3 className="text-xl text-center font-medium text-primary">
                Current Sales
              </h3>
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
                  {currentSales.length !== 0 ? (
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      {currentSales.map((row, index) => {
                        return (
                          <div
                            className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:sm:w-[500px]  shadow-lg"
                            style={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                            key={row.id}
                          >
                            <button
                              onClick={(e) => toggleLikeCurrentSale(index, e)}
                              className="hover:bg-green-200 cursor-pointer hover:opacity-90 w-10 h-10 absolute top-2 right-2 rounded-full flex items-center justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`w-6 h-6 ${
                                  row.isLiked
                                    ? "fill-green-400 text-green-400"
                                    : ""
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                            </button>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Business name:</span>{" "}
                              <span className="w-1/2">FashionPal</span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Name of sale:</span>{" "}
                              <span className="w-1/2">{row.name}</span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">
                                Type of items on sale:
                              </span>{" "}
                              <span className="w-1/2">{row.items}</span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Discount amount:</span>{" "}
                              <span className="w-1/2">
                                {row.discount_amount}
                              </span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Start date:</span>{" "}
                              <span className="w-1/2">
                                {moment(row.start_date).format("YYYY/MM/DD")}
                              </span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">End date:</span>{" "}
                              <span className="w-1/2">
                                {" "}
                                {moment(row.end_date).format("YYYY/MM/DD")}
                              </span>
                            </div>

                            <div className="flex justify-center !mt-3">
                              <Link href="/store/id">
                                <button className="bg-primary text-white px-5 py-1.5 mt-2 rounded-lg">
                                  View store
                                </button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <h3 className="text-center text-lg mt-5">
                      No Current Sales
                    </h3>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12">
              <h3 className="text-xl text-center font-medium text-primary">
                Upcoming Sales
              </h3>
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
                  {upcomingSales.length !== 0 ? (
                    <div className="sm:flex flex-wrap justify-center mt-2">
                      {upcomingSales.map((row, index) => {
                        return (
                          <div
                            className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:sm:w-[500px]  shadow-lg"
                            style={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                            key={row.id}
                          >
                            <button
                              onClick={(e) => toggleLike(index, e)}
                              className="hover:bg-green-200 cursor-pointer hover:opacity-90 w-10 h-10 absolute top-2 right-2 rounded-full flex items-center justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`w-6 h-6 ${
                                  row.isLiked
                                    ? "fill-green-400 text-green-400"
                                    : ""
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                            </button>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Business name:</span>{" "}
                              <span className="w-1/2">FashionPal</span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Name of sale:</span>{" "}
                              <span className="w-1/2">{row.name}</span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">
                                Type of items on sale:
                              </span>{" "}
                              <span className="w-1/2">{row.items}</span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Discount amount:</span>{" "}
                              <span className="w-1/2">
                                {row.discount_amount}
                              </span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">Start date:</span>{" "}
                              <span className="w-1/2">
                                {moment(row.start_date).format("YYYY/MM/DD")}
                              </span>
                            </div>
                            <div
                              className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                              <span className="w-1/2">End date:</span>{" "}
                              <span className="w-1/2">
                                {" "}
                                {moment(row.end_date).format("YYYY/MM/DD")}
                              </span>
                            </div>
                            <div className="flex justify-center !mt-3">
                              <Link href="/store/id">
                                <button className="bg-primary text-white px-5 py-1.5 mt-2 rounded-lg">
                                  View store
                                </button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <h3 className="text-center text-lg mt-5">
                      No Upcoming Sales
                    </h3>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
