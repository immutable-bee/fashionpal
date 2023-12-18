import dynamic from "next/dynamic";
import { useState } from "react";
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

const RePricer = ({ onBack }) => {
  const [ruleName, setRuleName] = useState("");
  const [category, setCategory] = useState("");
  const [week, setWeek] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchingPerformanceComparison, setFetchingPerformanceComparison] =
    useState(false);
  const [performanceComparison, setPerformanceComparison] = useState([
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

  return (
    <div className=" max-w-3xl mx-auto">
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
        onClick={() => onBack()}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg> */}
      <div>
        <div className="w-full bg-white rounded-2xl shadow py-2 flex justify-center mt-3">
          <div class="flex flex-wrap gap-3 text-sm font-medium text-center text-gray-500 overflow-x-auto">
            <div
              class={`px-3 sm:px-5 rounded-lg py-1.5 sm:y-2 flex items-center justify-center shadow-sm cursor-pointer text-xs ${
                activeTab == "overview"
                  ? "bg-primary text-white"
                  : "text-gray-900 bg-gray-100"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </div>
            <div
              class={`px-3 sm:px-5 rounded-lg py-1.5 sm:y-2 flex items-center justify-center shadow-sm cursor-pointer text-xs ${
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
        {activeTab == "overview" ? (
          <div>
            <div className="sm:w-96 mx-auto">
              <div className="py-2">
                <label className="text-lg">Rule name</label>
                <input
                  value={ruleName}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setRuleName(e.target.value)}
                />
              </div>
              <h2 className="text-xl mt-1 text-center">Or</h2>
              <div className="pb-2">
                <label className="text-lg">Category</label>
                <select
                  value={category}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Hats">Hats</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>
              <div className="py-2">
                <label className="text-lg">Week</label>
                <select
                  value={week}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setWeek(e.target.value)}
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

            <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
              <h3 className="text-xl text-center">
                Items Listed and Items Sold
              </h3>
              <ItemLinkedSoldChart />
            </div>
            <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
              <h3 className="text-xl text-center">ALP and ASP</h3>
              <ALPASPChart />
            </div>
            <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
              <h3 className="text-xl text-center">Donations and Accepted</h3>
              <DonationAcceptedChart />
            </div>
            <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
              <h3 className="text-xl text-center">AVG Days Listed</h3>
              <AVGDayListedChart />
            </div>
            <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
              <h3 className="text-xl text-center">Revenue</h3>
              <RevenueChart />
            </div>
          </div>
        ) : (
          <div className="sm:flex flex-wrap justify-center sm:justify-start mt-8 items-center">
            <div className="py-2 flex items-center justify-center w-full">
              <label className="text-lg mr-4">Week</label>
              <select
                value={week}
                className=" mt-1 rounded-xl w-40 px-3 py-2 border border-gray-600"
                onChange={(e) => setWeek(e.target.value)}
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
            <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-1 py-3"
                    >
                      {
                        <Dropdown>
                          <Dropdown.Button light>
                            {selectedCategories.join(", ") ||
                              "Select Categories"}
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

                    <th
                      scope="col"
                      className="px-1 py-3"
                    >
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
                  {performanceComparison.map((row, key) => (
                    <tr
                      key={key}
                      className="bg-white dark:bg-gray-800"
                    >
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
    </div>
  );
};

export default RePricer;
