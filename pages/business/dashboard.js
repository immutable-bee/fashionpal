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
      "12/24": {
        revenue: 782.3,
        totalItemsSold: 325,
        totalListingPrice: 119.2,
        totalDaysListed: 17.1,
        donations: 532.1,
        accepted: 322.3,
        averageListingPrice: 10.3,
        averageSalePrice: 8.2,
        averageDaysListed: 25.7,
      },
      "12/25": {
        revenue: 842.5,
        totalItemsSold: 350,
        totalListingPrice: 128.4,
        totalDaysListed: 18.5,
        donations: 573.0,
        accepted: 347.1,
        averageListingPrice: 11.1,
        averageSalePrice: 8.8,
        averageDaysListed: 27.7,
      },
      "12/26": {
        revenue: 1059.2,
        totalItemsSold: 440,
        totalListingPrice: 161.4,
        totalDaysListed: 23.2,
        donations: 720.4,
        accepted: 436.3,
        averageListingPrice: 14.0,
        averageSalePrice: 11.1,
        averageDaysListed: 34.8,
      },
      "12/27": {
        revenue: 842.5,
        totalItemsSold: 350,
        totalListingPrice: 128.4,
        totalDaysListed: 18.5,
        donations: 573.0,
        accepted: 347.1,
        averageListingPrice: 11.1,
        averageSalePrice: 8.8,
        averageDaysListed: 27.7,
      },
      "12/28": {
        revenue: 1143.4,
        totalItemsSold: 475,
        totalListingPrice: 174.2,
        totalDaysListed: 25.1,
        donations: 777.7,
        accepted: 471.0,
        averageListingPrice: 15.1,
        averageSalePrice: 12.0,
        averageDaysListed: 37.6,
      },
      "12/29": {
        revenue: 1444.3,
        totalItemsSold: 600,
        totalListingPrice: 220.1,
        totalDaysListed: 31.7,
        donations: 982.4,
        accepted: 595.0,
        averageListingPrice: 19.1,
        averageSalePrice: 15.2,
        averageDaysListed: 47.5,
      },
      "12/30": {
        revenue: 1203.6,
        totalItemsSold: 500,
        totalListingPrice: 183.4,
        totalDaysListed: 26.4,
        donations: 818.6,
        accepted: 495.8,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 39.6,
      },
    },
  };

  const sampleLastWeekReport = {
    statsByGroup: {
      "12/17": {
        revenue: 586.7,
        totalItemsSold: 243.7,
        totalListingPrice: 89.4,
        totalDaysListed: 12.8,
        donations: 399.1,
        accepted: 241.7,
        averageListingPrice: 7.7,
        averageSalePrice: 6.1,
        averageDaysListed: 19.3,
      },
      "12/18": {
        revenue: 625.9,
        totalItemsSold: 260,
        totalListingPrice: 95.3,
        totalDaysListed: 13.7,
        donations: 425.7,
        accepted: 257.8,
        averageListingPrice: 8.2,
        averageSalePrice: 6.6,
        averageDaysListed: 20.5,
      },
      "12/19": {
        revenue: 704.1,
        totalItemsSold: 292.5,
        totalListingPrice: 107.3,
        totalDaysListed: 15.4,
        donations: 478.9,
        accepted: 290.0,
        averageListingPrice: 9.3,
        averageSalePrice: 7.4,
        averageDaysListed: 23.1,
      },
      "12/20": {
        revenue: 842.5,
        totalItemsSold: 350,
        totalListingPrice: 128.4,
        totalDaysListed: 18.5,
        donations: 573.0,
        accepted: 347.1,
        averageListingPrice: 11.1,
        averageSalePrice: 8.8,
        averageDaysListed: 27.7,
      },
      "12/21": {
        revenue: 938.8,
        totalItemsSold: 390,
        totalListingPrice: 143.0,
        totalDaysListed: 20.6,
        donations: 638.5,
        accepted: 386.7,
        averageListingPrice: 12.4,
        averageSalePrice: 9.9,
        averageDaysListed: 30.8,
      },
      "12/22": {
        revenue: 860.6,
        totalItemsSold: 357.5,
        totalListingPrice: 131.1,
        totalDaysListed: 18.9,
        donations: 585.3,
        accepted: 354.5,
        averageListingPrice: 11.3,
        averageSalePrice: 9.0,
        averageDaysListed: 28.3,
      },
      "12/23": {
        revenue: 743.2,
        totalItemsSold: 308.7,
        totalListingPrice: 113.2,
        totalDaysListed: 16.3,
        donations: 505.5,
        accepted: 306.2,
        averageListingPrice: 9.8,
        averageSalePrice: 7.8,
        averageDaysListed: 24.4,
      },
    },
  };

  const sampleThisMonthReport = {
    statsByGroup: {
      "12/09": {
        revenue: 842.5,
        totalItemsSold: 350,
        totalListingPrice: 128.4,
        totalDaysListed: 18.5,
        donations: 573.0,
        accepted: 347.1,
        averageListingPrice: 11.1,
        averageSalePrice: 8.8,
        averageDaysListed: 27.7,
      },
      "12/16": {
        revenue: 962.9,
        totalItemsSold: 400,
        totalListingPrice: 146.7,
        totalDaysListed: 21.1,
        donations: 654.9,
        accepted: 396.7,
        averageListingPrice: 12.7,
        averageSalePrice: 10.1,
        averageDaysListed: 31.6,
      },
      "12/23": {
        revenue: 1324.0,
        totalItemsSold: 550,
        totalListingPrice: 201.8,
        totalDaysListed: 29.1,
        donations: 900.5,
        accepted: 545.4,
        averageListingPrice: 17.5,
        averageSalePrice: 13.9,
        averageDaysListed: 43.5,
      },
      "12/30": {
        revenue: 1203.6,
        totalItemsSold: 500,
        totalListingPrice: 183.4,
        totalDaysListed: 26.4,
        donations: 818.6,
        accepted: 495.8,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 39.6,
      },
    },
  };

  const sampleLastMonthReport = {
    statsByGroup: {
      "11/09": {
        revenue: 689.8,
        totalItemsSold: 420,
        totalListingPrice: 160.4,
        totalDaysListed: 25.1,
        donations: 714.9,
        accepted: 432.9,
        averageListingPrice: 11.1,
        averageSalePrice: 8.8,
        averageDaysListed: 28.9,
      },
      "11/16": {
        revenue: 886.9,
        totalItemsSold: 540,
        totalListingPrice: 206.3,
        totalDaysListed: 32.3,
        donations: 919.2,
        accepted: 556.6,
        averageListingPrice: 14.3,
        averageSalePrice: 11.4,
        averageDaysListed: 37.2,
      },
      "11/23": {
        revenue: 1182.5,
        totalItemsSold: 720,
        totalListingPrice: 275.0,
        totalDaysListed: 43.1,
        donations: 1225.6,
        accepted: 742.2,
        averageListingPrice: 19.1,
        averageSalePrice: 15.2,
        averageDaysListed: 49.6,
      },
      "11/30": {
        revenue: 985.4,
        totalItemsSold: 600,
        totalListingPrice: 229.2,
        totalDaysListed: 35.9,
        donations: 1021.4,
        accepted: 618.5,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 41.4,
      },
    },
  };

  const sampleThreeMonthReport = {
    statsByGroup: {
      "10/23": {
        revenue: 732.7,
        totalItemsSold: 765,
        totalListingPrice: 287.6,
        totalDaysListed: 45.0,
        donations: 1276.7,
        accepted: 773.4,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 38.2,
      },
      "11/23": {
        revenue: 985.4,
        totalItemsSold: 600,
        totalListingPrice: 229.2,
        totalDaysListed: 35.9,
        donations: 1021.4,
        accepted: 618.5,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 41.4,
      },
      "12/23": {
        revenue: 1203.6,
        totalItemsSold: 500,
        totalListingPrice: 183.4,
        totalDaysListed: 26.4,
        donations: 818.6,
        accepted: 495.8,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 39.6,
      },
    },
  };

  const sampleSixMonthReport = {
    statsByGroup: {
      "07/23": {
        revenue: 895.8,
        totalItemsSold: 700,
        totalListingPrice: 266.4,
        totalDaysListed: 41.7,
        donations: 1104.9,
        accepted: 531.6,
        averageListingPrice: 10,
        averageSalePrice: 7.5,
        averageDaysListed: 35.9,
      },
      "08/23": {
        revenue: 1074.9,
        totalItemsSold: 800,
        totalListingPrice: 295.0,
        totalDaysListed: 45.9,
        donations: 1325.4,
        accepted: 585.8,
        averageListingPrice: 10.9,
        averageSalePrice: 7.9,
        averageDaysListed: 38.8,
      },
      "09/23": {
        revenue: 889.9,
        totalItemsSold: 1100,
        totalListingPrice: 326.5,
        totalDaysListed: 50.4,
        donations: 1595.9,
        accepted: 642.3,
        averageListingPrice: 11.9,
        averageSalePrice: 9.1,
        averageDaysListed: 36.5,
      },
      "10/23": {
        revenue: 732.7,
        totalItemsSold: 765,
        totalListingPrice: 287.6,
        totalDaysListed: 45.0,
        donations: 1276.7,
        accepted: 773.4,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 38.2,
      },
      "11/23": {
        revenue: 985.4,
        totalItemsSold: 600,
        totalListingPrice: 229.2,
        totalDaysListed: 35.9,
        donations: 1021.4,
        accepted: 618.5,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 41.4,
      },
      "12/23": {
        revenue: 1203.6,
        totalItemsSold: 500,
        totalListingPrice: 183.4,
        totalDaysListed: 26.4,
        donations: 818.6,
        accepted: 495.8,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 39.6,
      },
    },
  };

  const sampleTwelveMonthReport = {
    statsByGroup: {
      "01/23": {
        revenue: 300,
        totalItemsSold: 300,
        totalListingPrice: 150,
        totalDaysListed: 25,
        donations: 500,
        accepted: 300,
        averageListingPrice: 6,
        averageSalePrice: 5,
        averageDaysListed: 27.5,
      },
      "02/23": {
        revenue: 360,
        totalItemsSold: 330,
        totalListingPrice: 165,
        totalDaysListed: 27.5,
        donations: 550,
        accepted: 330,
        averageListingPrice: 6.5,
        averageSalePrice: 5.5,
        averageDaysListed: 30,
      },
      "03/23": {
        revenue: 432,
        totalItemsSold: 363,
        totalListingPrice: 181.5,
        totalDaysListed: 30,
        donations: 605,
        accepted: 363,
        averageListingPrice: 7.1,
        averageSalePrice: 6,
        averageDaysListed: 32,
      },
      "04/23": {
        revenue: 518.4,
        totalItemsSold: 425,
        totalListingPrice: 198.1,
        totalDaysListed: 33,
        donations: 725.5,
        accepted: 399.6,
        averageListingPrice: 7.7,
        averageSalePrice: 6.4,
        averageDaysListed: 30.5,
      },
      "05/23": {
        revenue: 622.0,
        totalItemsSold: 480,
        totalListingPrice: 217.9,
        totalDaysListed: 35.3,
        donations: 798.0,
        accepted: 439.5,
        averageListingPrice: 8.5,
        averageSalePrice: 6.8,
        averageDaysListed: 28.2,
      },
      "06/23": {
        revenue: 746.5,
        totalItemsSold: 600,
        totalListingPrice: 240.1,
        totalDaysListed: 38.2,
        donations: 918.2,
        accepted: 483.4,
        averageListingPrice: 9.1,
        averageSalePrice: 7.2,
        averageDaysListed: 31.7,
      },
      "07/23": {
        revenue: 895.8,
        totalItemsSold: 700,
        totalListingPrice: 266.4,
        totalDaysListed: 41.7,
        donations: 1104.9,
        accepted: 531.6,
        averageListingPrice: 10,
        averageSalePrice: 7.5,
        averageDaysListed: 35.9,
      },
      "08/23": {
        revenue: 1074.9,
        totalItemsSold: 800,
        totalListingPrice: 295.0,
        totalDaysListed: 45.9,
        donations: 1325.4,
        accepted: 585.8,
        averageListingPrice: 10.9,
        averageSalePrice: 7.9,
        averageDaysListed: 38.8,
      },
      "09/23": {
        revenue: 889.9,
        totalItemsSold: 1100,
        totalListingPrice: 326.5,
        totalDaysListed: 50.4,
        donations: 1595.9,
        accepted: 642.3,
        averageListingPrice: 11.9,
        averageSalePrice: 9.1,
        averageDaysListed: 36.5,
      },
      "10/23": {
        revenue: 732.7,
        totalItemsSold: 765,
        totalListingPrice: 287.6,
        totalDaysListed: 45.0,
        donations: 1276.7,
        accepted: 773.4,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 38.2,
      },
      "11/23": {
        revenue: 985.4,
        totalItemsSold: 600,
        totalListingPrice: 229.2,
        totalDaysListed: 35.9,
        donations: 1021.4,
        accepted: 618.5,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 41.4,
      },
      "12/23": {
        revenue: 1203.6,
        totalItemsSold: 500,
        totalListingPrice: 183.4,
        totalDaysListed: 26.4,
        donations: 818.6,
        accepted: 495.8,
        averageListingPrice: 15.9,
        averageSalePrice: 12.7,
        averageDaysListed: 39.6,
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
