import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
  const [ruleName, setRuleName] = useState("");
  const [category, setCategory] = useState("All");
  const [dateRange, setDateRange] = useState("This Week");
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchingComparisonReport, setFetchingComparisonReport] =
    useState(false);
  const [comparisonReport, setComparisonReport] = useState([
    { category: "Hats", revenue: 1298 },
    { category: "Clothing Tops", revenue: 85 },
    { category: "Clothing Bottoms", revenue: 65 },
    { category: "Footwear", revenue: 30 },
    { category: "", revenue: 320 },
    { category: "", revenue: 40 },
    { category: "", revenue: 45 },
    { category: "", revenue: 76 },
    { category: "", revenue: 48 },
  ]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRevenue, setSelectedRevenues] = useState([]);

  const [fetchingSquareReport, setFetchingSquareReport] = useState(false);
  const [squareReport, setSquareReport] = useState();

  const [sampleSquareReport, setSampleSquareReport] = useState({
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
      "03/23": {
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
  });

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
    const { fromDate, toDate } = getDateRange(dateRange);
    try {
      const res = await fetch(
        `/api/business/fetchSquareReport?fromDate=${fromDate}&toDate=${toDate}&category=${category}`
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
    }
  };

  useEffect(() => {
    fetchSquareReport();
  }, [dateRange, category]);

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
                  value={dateRange}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setDateRange(e.target.value)}
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
            </div>
          </div>
          <div className="px-[6px] sm:px-5">
            <div className="sm:max-w-fit  rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">
                Items Listed and Items Sold
              </h3>
              <ItemLinkedSoldChart chartData={sampleSquareReport} />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">ALP and ASP</h3>
              <ALPASPChart chartData={sampleSquareReport} />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">Donations and Accepted</h3>
              <DonationAcceptedChart chartData={sampleSquareReport} />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">AVG Days Listed</h3>
              <AVGDayListedChart chartData={sampleSquareReport} />
            </div>
            <div className="sm:max-w-fit rounded-lg border shadow pt-3 sm:mx-auto mt-5">
              <h3 className="text-xl text-center">Revenue</h3>
              <RevenueChart chartData={sampleSquareReport} />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 sm:px-5 sm:flex flex-wrap justify-center sm:justify-start mt-8 items-center">
          <div className="py-2 flex items-center justify-center w-full">
            <select
              value={dateRange}
              className=" mt-1 rounded-xl w-56 px-3 py-2 border border-gray-600"
              onChange={(e) => setDateRange(e.target.value)}
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
          <div className="relative w-full overflow-x-auto medium-x-scrollbar shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-3">
                    {
                      <Dropdown>
                        <Dropdown.Button light>
                          {selectedCategories.join(", ") || "Select Categories"}
                        </Dropdown.Button>
                        <Dropdown.Menu
                          selectionMode="multiple"
                          disallowEmptySelection
                          selectedKeys={selectedCategories}
                          onSelectionChange={(keys) => {
                            const selectedKeys = Array.from(keys);
                            setSelectedCategories(selectedKeys);
                          }}
                        >
                          <Dropdown.Item key={"All"}>All</Dropdown.Item>
                          <Dropdown.Item key={"Clothing"}>
                            Clothing
                          </Dropdown.Item>
                          <Dropdown.Item key={"Footwear"}>
                            Footwear
                          </Dropdown.Item>
                          <Dropdown.Item key={"Hats"}>Hats</Dropdown.Item>
                          <Dropdown.Item key={"Bags"}>Bags</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                  </th>

                  <th scope="col" className="px-1 py-3">
                    {
                      <Dropdown>
                        <Dropdown.Button light>
                          {selectedRevenue.join(", ") || "Select Types"}
                        </Dropdown.Button>
                        <Dropdown.Menu
                          selectionMode="multiple"
                          disallowEmptySelection
                          selectedKeys={selectedRevenue}
                          onSelectionChange={(keys) => {
                            const selectedKeys = Array.from(keys);
                            setSelectedRevenues(selectedKeys);
                          }}
                        >
                          <Dropdown.Item key={"Listed"}>Listed</Dropdown.Item>
                          <Dropdown.Item key={"Sold"}>Sold</Dropdown.Item>
                          <Dropdown.Item key={"ALP"}>ALP</Dropdown.Item>
                          <Dropdown.Item key={"ASP"}>ASP</Dropdown.Item>
                          <Dropdown.Item key={"ADL"}>
                            ADL (Average Days Listed)
                          </Dropdown.Item>
                          <Dropdown.Item key={"Donations Accepted"}>
                            Donations Accepted
                          </Dropdown.Item>
                          <Dropdown.Item key={"Donations Rejected"}>
                            Donations Rejected
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonReport.map((row, key) => (
                  <tr key={key} className="bg-white dark:bg-gray-800">
                    <td className="text-black px-6 py-4">
                      {row.category ? row.category : "--"}
                    </td>

                    <td className="px-6 py-4">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
