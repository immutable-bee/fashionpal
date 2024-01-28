import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { Dropdown } from "@nextui-org/react";

// Import the chart component using dynamic import
const ItemLinkedSoldChart = dynamic(
  () => import("@/components/scoped/ItemLinkedSoldChart"),
  { ssr: false }
);
const ALPASPChart = dynamic(() => import("@/components/scoped/ALPASPChart"), {
  ssr: false,
});
const RevenueChart = dynamic(() => import("@/components/scoped/RevenueChart"), {
  ssr: false,
});
const AVGDayListedChart = dynamic(
  () => import("@/components/scoped/AVGDayListedChart"),
  { ssr: false }
);
const DonationAcceptedChart = dynamic(
  () => import("@/components/scoped/DonationAcceptedChart"),
  { ssr: false }
);

const Dashboard = ({ onBack }) => {
  // global
  const [activeTab, setActiveTab] = useState("overview");

  // For default view
  const [ruleName, setRuleName] = useState("");
  const [category, setCategory] = useState("All");
  const [reportDateRange, setReportDateRange] = useState("This Week");
  const [fetchingSquareReport, setFetchingSquareReport] = useState(false);
  const [squareReport, setSquareReport] = useState();

  // For comparison View
  const [comparisonDateRange, setComparisonDateRange] = useState("This Week");
  const [fetchingComparisonReport, setFetchingComparisonReport] =
    useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStats, setSelectedStats] = useState([]);
  const [comparisonReport, setComparisonReport] = useState();

  // for nate to test, delete when finished

  const [activeReportIndex, setActiveReportIndex] = useState(0);

  const sampleThisWeekReport = {
    statsByGroup: {
      "01/07/24": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
    },
  };

  const sampleLastWeekReport = {
    statsByGroup: {
      "12/31/23": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
    },
  };

  const sampleThisMonthReport = {
    statsByGroup: {
      "01/01/24": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
      "01/07/24": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
    },
  };

  const sampleLastMonthReport = {
    statsByGroup: {
      "12/23": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
    },
  };

  const sampleThreeMonthReport = {
    statsByGroup: {
      "10/23": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
      "11/23": {
        revenue: 10000,
        totalItemsSold: 17,
        totalListingPrice: 13000,
        totalDaysListed: 250,
        donations: 28,
        accepted: 28,
        averageSalePrice: 250,
        averageListingPrice: 325,
        averageDaysListed: 6.25,
      },
      "12/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
    },
  };

  const sampleSixMonthReport = {
    statsByGroup: {
      "07/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "08/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "09/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "10/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "11/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "12/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
    },
  };

  const sampleTwelveMonthReport = {
    statsByGroup: {
      "01/23": {
        revenue: 12000,
        totalItemsSold: 12,
        totalListingPrice: 15000,
        totalDaysListed: 300,
        donations: 25,
        accepted: 20,
        averageSalePrice: 240,
        averageListingPrice: 300,
        averageDaysListed: 6,
      },
      "02/23": {
        revenue: 10000,
        totalItemsSold: 17,
        totalListingPrice: 13000,
        totalDaysListed: 250,
        donations: 28,
        accepted: 28,
        averageSalePrice: 250,
        averageListingPrice: 325,
        averageDaysListed: 6.25,
      },
      "04/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "05/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "06/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "07/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "08/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "09/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "10/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "11/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
      "12/23": {
        revenue: 15000,
        totalItemsSold: 31,
        totalListingPrice: 20000,
        totalDaysListed: 360,
        donations: 35,
        accepted: 26,

        averageSalePrice: 250,
        averageListingPrice: 333.33,
        averageDaysListed: 6,
      },
    },
  };

  const sampleReports = [
    sampleThisWeekReport,
    sampleLastWeekReport,
    sampleThisMonthReport,
    sampleLastMonthReport,
    sampleThreeMonthReport,
    sampleSixMonthReport,
    sampleTwelveMonthReport,
  ];

  const [sampleComparisonReport, setSampleComparisonReport] = useState({
    statsByCategory: {
      Clothing: {
        revenue: 12000,
        totalItemsSold: 60,
        totalListingPrice: 15000,
        totalDaysListed: 180,
        accepted: 50,
        donations: 70,
        averageSalePrice: 200,
        averageListingPrice: 214.29,
        averageDaysListed: 2.57,
        rejected: 20,
      },
      Footwear: {
        revenue: 8000,
        totalItemsSold: 40,
        totalListingPrice: 10000,
        totalDaysListed: 160,
        accepted: 35,
        donations: 50,
        averageSalePrice: 200,
        averageListingPrice: 200,
        averageDaysListed: 3.2,
        rejected: 15,
      },
      Bags: {
        revenue: 6000,
        totalItemsSold: 30,
        totalListingPrice: 7500,
        totalDaysListed: 120,
        accepted: 25,
        donations: 40,
        averageSalePrice: 200,
        averageListingPrice: 187.5,
        averageDaysListed: 3,
        rejected: 15,
      },
      Hats: {
        revenue: 4000,
        totalItemsSold: 20,
        totalListingPrice: 5000,
        totalDaysListed: 80,
        accepted: 15,
        donations: 25,
        averageSalePrice: 200,
        averageListingPrice: 200,
        averageDaysListed: 3.2,
        rejected: 10,
      },
    },
  });

  //

  // using sampleComparisonReport for testing, update to "comparisonReport" when finished
  const categoryGroups = Object.keys(sampleComparisonReport.statsByCategory);

  const statNames = {
    revenue: "Revenue",
    donations: "Listed",
    totalItemsSold: "Sold",
    averageListingPrice: "ALP",
    averageSalePrice: "ASP",
    averageDaysListed: "ADL (Average Days Listed)",
    accepted: "Donations Accepted",
    rejected: "Donations Rejected",
  };

  const getDateRange = (selection) => {
    let fromDate, toDate;
    const today = new Date();
    const dayOfWeek = today.getDay();

    switch (selection) {
      case "This Week":
        fromDate = new Date(today.setDate(today.getDate() - dayOfWeek));
        toDate = new Date();
        break;
      case "Last Week":
        fromDate = new Date(today.setDate(today.getDate() - dayOfWeek - 7));
        toDate = new Date(today.setDate(today.getDate() - dayOfWeek));
        break;
      case "This Month":
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date();
        break;
      case "Last Month":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Last Three Months":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        toDate = new Date();
        break;
      case "Last six months":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        toDate = new Date();
        break;
      case "Last 12 months":
        fromDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        toDate = new Date();
        break;
      default:
        break;
    }

    return { fromDate, toDate };
  };

  const fetchSquareReport = async () => {
    setFetchingSquareReport(true);
    const { fromDate, toDate } = getDateRange(reportDateRange);
    try {
      const res = await fetch(
        `/api/business/square/fetchSquareReport?fromDate=${fromDate}&toDate=${toDate}&category=${category}`
      );

      if (res.status === 200) {
        const data = await res.json();
        setSquareReport(data);
        setFetchingSquareReport(false);
      } else {
        const errorMessage = await res.text();
        console.error(
          `Fetch failed with status: ${res.status}, message: ${errorMessage}`
        );
        setFetchingSquareReport(false);
      }
    } catch (error) {
      console.error("An error occurred while Square report", error);
      setFetchingSquareReport(false);
    }
  };

  const fetchComparisonReport = async () => {
    setFetchingComparisonReport(true);
    const { fromDate, toDate } = getDateRange(comparisonDateRange);

    try {
      const res = await fetch("/api/business/square/fetchComparisonReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromDate,
          toDate,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setComparisonReport(data);
        setFetchingComparisonReport(false);
      } else {
        const errorMessage = await res.text();
        console.error(
          `Fetch failed with status: ${res.status}, message: ${errorMessage}`
        );
        setFetchingComparisonReport(false);
      }
    } catch (error) {
      console.error("An error occurred while Square report", error);
      setFetchingComparisonReport(false);
    }
  };

  useEffect(() => {
    fetchSquareReport();
  }, [reportDateRange, category]);

  useEffect(() => {
    fetchComparisonReport();
  }, [comparisonDateRange]);

  return (
    <div className="  pb-8 sm:pt-6 pt-0">
      <div className="px-3 sm:px-5">
        <div className="w-full   bg-white rounded-2xl shadow py-2 px-3 sm:px-6 flex justify-center mt-3">
          <div className="flex flex-wrap gap-3 text-sm font-medium text-center text-gray-500 overflow-x-auto medium-x-scrollbar">
            <div
              className={`px-3 sm:px-5 rounded-lg py-1.5 sm:y-2 flex items-center justify-center shadow-sm cursor-pointer text-xs ${
                activeTab == "overview"
                  ? "bg-primary text-white"
                  : "text-gray-900 bg-gray-100"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </div>
            <div
              className={`px-3 sm:px-5 rounded-lg py-1.5 sm:y-2 flex items-center justify-center shadow-sm cursor-pointer text-xs ${
                activeTab == "performance_comparison"
                  ? "bg-primary text-white"
                  : "text-gray-900 bg-gray-100"
              }`}
              onClick={() => setActiveTab("performance_comparison")}
            >
              Performance Comparison
            </div>
          </div>
        </div>

        <div className="w-12 hidden sm:block"></div>
      </div>
      {activeTab == "overview" ? (
        <div>
          <div className="sm:w-96 mx-auto px-3 sm:px-5">
            <div className="py-2">
              <label className="text-lg">Rule name</label>
              <input
                value={ruleName}
                className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>
            <h2 className="text-xl mt-1 text-center">Or</h2>
            <div className="sm:flex justify-center items-center gap-3">
              <div className="">
                <label className="text-lg">Category</label>
                <select
                  value={category}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Hats">Hats</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>
              <div className="">
                <label className="text-lg">Week</label>
                <select
                  //value={reportDateRange}
                  // for testing, when finished delete the line below and uncomment the line above
                  value={activeReportIndex}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  //onChange={(e) => setReportDateRange(e.target.value)}
                  // for testing, when finished delete the line below and uncomment the line above
                  onChange={(e) => setActiveReportIndex(e.target.value)}
                >
                  {/* For testing, when finished delete this snippet and uncomment the snippet below */}
                  <option value={0}>This Week</option>
                  <option value={1}>Last Week</option>
                  <option value={2}>This Month</option>
                  <option value={3}>Last Month</option>
                  <option value={4}>Last Three Months</option>
                  <option value={5}>Last six months</option>
                  <option value={6}>Last 12 months</option>

                  {/*
                  <option value="This Week">This Week</option>
                  <option value="Last Week">Last Week</option>
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last Three Months">Last Three Months</option>
                  <option value="Last six months">Last six months</option>
                  <option value="Last 12 months">Last 12 months</option>
      */}
                </select>
              </div>
            </div>
          </div>
          <div className="px-[6px] sm:px-5">
            <div className="sm:max-w-fit  rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">
                Items Listed and Items Sold
              </h3>
              {/* prop for each chart component is populated with test data, update each to "chartData={squareReport}" when finished */}
              <ItemLinkedSoldChart
                chartData={sampleReports[activeReportIndex]}
              />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">ALP and ASP</h3>
              <ALPASPChart chartData={sampleReports[activeReportIndex]} />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">Donations and Accepted</h3>
              <DonationAcceptedChart
                chartData={sampleReports[activeReportIndex]}
              />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">AVG Days Listed</h3>
              <AVGDayListedChart chartData={sampleReports[activeReportIndex]} />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">Revenue</h3>
              <RevenueChart chartData={sampleReports[activeReportIndex]} />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 sm:px-5 sm:flex flex-wrap justify-center sm:justify-start mt-8 items-center">
          <div className="py-2 flex items-center justify-center w-full">
            <select
              value={comparisonDateRange}
              className=" mt-1 rounded-xl w-56 px-3 py-2 border border-gray-600"
              onChange={(e) => setComparisonDateRange(e.target.value)}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Last Three Months">Last Three Months</option>
              <option value="Last six months">Last six months</option>
              <option value="Last 12 months">Last 12 months</option>
            </select>
          </div>

          <div className="flex w-full justify-evenly py-5">
            <div>
              <Dropdown>
                <div className="border rounded-md border-primary">
                  <Dropdown.Button light>Select Categories</Dropdown.Button>
                </div>
                <Dropdown.Menu
                  selectionMode="multiple"
                  disallowEmptySelection
                  selectedKeys={selectedCategories}
                  onSelectionChange={(keys) => {
                    const selectedKeys = Array.from(keys);
                    if (selectedKeys.includes("All")) {
                      setSelectedCategories(["All"]);
                    } else {
                      setSelectedCategories(
                        selectedKeys.filter((key) => key !== "All")
                      );
                    }
                  }}
                  onAction={(key) => {
                    if (key !== "All" && selectedCategories.includes("All")) {
                      setSelectedCategories([key]);
                    }
                  }}
                >
                  <Dropdown.Item key={"All"}>All</Dropdown.Item>
                  {categoryGroups.map((category) => (
                    <Dropdown.Item key={category}>{category}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div>
              <Dropdown>
                <div className="border rounded-md border-primary">
                  <Dropdown.Button light>Select Metrics</Dropdown.Button>
                </div>
                <Dropdown.Menu
                  selectionMode="multiple"
                  disallowEmptySelection
                  selectedKeys={selectedStats}
                  onSelectionChange={(keys) => {
                    const selectedKeys = Array.from(keys);
                    setSelectedStats(selectedKeys);
                  }}
                >
                  <Dropdown.Item key={"revenue"}>Revenue</Dropdown.Item>
                  <Dropdown.Item key={"donations"}>Listed</Dropdown.Item>
                  <Dropdown.Item key={"totalItemsSold"}>Sold</Dropdown.Item>
                  <Dropdown.Item key={"averageListingPrice"}>ALP</Dropdown.Item>
                  <Dropdown.Item key={"averageSalePrice"}>ASP</Dropdown.Item>
                  <Dropdown.Item key={"averageDaysListed"}>
                    ADL (Average Days Listed)
                  </Dropdown.Item>
                  <Dropdown.Item key={"accepted"}>
                    Donations Accepted
                  </Dropdown.Item>
                  <Dropdown.Item key={"rejected"}>
                    Donations Rejected
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto medium-x-scrollbar shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 table-fixed">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center w-auto"
                  >
                    Category
                  </th>

                  {selectedStats && selectedStats.length === 0 ? (
                    <th
                      scope="col"
                      className="px-6 py-4 text-center w-auto"
                    >
                      Revenue
                    </th>
                  ) : (
                    selectedStats.map((stat) => (
                      <th
                        key={stat}
                        scope="col"
                        className="px-6 py-4 text-center w-auto"
                      >
                        {statNames[stat]}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {categoryGroups.map((categoryName, index) => {
                  if (
                    !selectedCategories.length ||
                    selectedCategories.includes("All") ||
                    selectedCategories.includes(categoryName)
                  ) {
                    return (
                      <tr
                        key={categoryName}
                        className={`${
                          index % 2 === 0 ? "bg-primary/25" : "bg-white"
                        }`}
                      >
                        <td className="text-black px-6 py-4 text-center w-auto">
                          {categoryName}
                        </td>
                        {selectedStats && selectedStats.length ? (
                          selectedStats.map((stat, index) => (
                            <td
                              key={index}
                              className="text-black px-6 py-4 text-center w-auto"
                            >
                              {
                                sampleComparisonReport.statsByCategory[
                                  categoryName
                                ][stat]
                              }
                            </td>
                          ))
                        ) : (
                          <td className="text-black px-6 py-4 text-center w-auto">
                            {
                              sampleComparisonReport.statsByCategory[
                                categoryName
                              ].revenue
                            }
                          </td>
                        )}
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
