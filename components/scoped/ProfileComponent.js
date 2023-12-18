import React, { useEffect, useState } from "react";
import TooltipComponent from "@/components/utility/Tooltip";
import Head from "next/head";
import ButtonComponent from "@/components/utility/Button";
import { Loading, Dropdown } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import useDateRangePicker from "../../hooks/useDateRangePicker";
import { NotificationManager } from "react-notifications";

const Profilecomponent = () => {
  const { data: session } = useSession();
  const { selectedRange, setSelectedRange, getRange } = useDateRangePicker();

  const [isViewableForVoting, setIsViewableForVoting] = useState(true);
  const [fetchingBusinessStats, setFetchingBusinessStats] = useState(true);
  const [businessStats, setBusinessStats] = useState({});
  const [businessData, setBusinessData] = useState({});

  const [updating, setUpdating] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData({ ...businessData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessData.businessName) {
      NotificationManager.error("Store name is required!");
      return;
    }
    setUpdating(true);
    try {
      await fetch("/api/business/updateData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: businessData.email,
          data: {
            businessName: businessData.businessName,
          },
        }),
      });
      await fetchBusinessData();
    } catch (error) {}
    setUpdating(false);
  };

  const fetchBusinessData = async () => {
    const response = await fetch(`/api/user/fetch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      setBusinessData(data.business);
    } else {
      return console.error("Failed to fetch user data:", data.error);
    }
  };

  const fetchBusinessStats = async (dateTo = null, dateFrom = null) => {
    setFetchingBusinessStats(true);
    const path =
      dateTo && dateFrom
        ? `/api/business/fetchStats?dateTo=${dateTo}&dateFrom=${dateFrom}`
        : "/api/business/fetchStats";

    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setFetchingBusinessStats(false);

    if (response.ok) {
      setBusinessStats(data);
    } else {
      return console.error("Failed to fetch business stats:", data.error);
    }
  };

  const downloadCSV = async () => {
    const rows = [
      ["Stats Name", "value"],
      ["This months # of scans", businessStats.totalListings],
      ["Most common category", businessStats.mostCommonCategory],
      ["# trashed", businessStats.listingsDamaged],
      ["# disposed", businessStats.disposedListings],
      ["# keep", businessStats.listingsToSell],
      ["% trashed", businessStats.percentageDamaged],
      ["% disposed", businessStats.percentageDisposed],
      ["% to sell", businessStats.percentageToSell],
    ];
    const values = rows.map((entry) => entry.join(","));
    const blob = new Blob([values.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `stats-${new Date().toISOString()}.csv`);
    a.click();
  };

  useEffect(() => {
    const range = getRange(selectedRange);
    fetchBusinessStats(range.dateTo, range.dateFrom).then();
    fetchBusinessData().then();
  }, [selectedRange]);

  return (
    <div className="bg-white ">
      <div>
        <section className="px-5 ">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="py-2">
                <label className="text-sm text-gray-700">Store name</label>
                <input
                  value={businessData?.businessName}
                  name="businessName"
                  type="text"
                  className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                  onChange={handleChange}
                />
              </div>
              <div className="py-2">
                <label className="text-sm text-gray-700">Email</label>
                <input
                  disabled={true}
                  value={businessData?.email}
                  name="email"
                  type="text"
                  className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                  onChange={handleChange}
                />
              </div>

              <ButtonComponent
                className="mt-3"
                rounded
                full
                loading={updating}
                type="submit"
              >
                Update
              </ButtonComponent>
            </form>

            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-8 items-center">
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
                              {selectedRange}
                            </Dropdown.Button>
                            <Dropdown.Menu
                              selectionMode="single"
                              disallowEmptySelection
                              selectedKeys={selectedRange}
                              onSelectionChange={(keys) => {
                                const selectedKey = Array.from(keys)[0];

                                setSelectedRange(selectedKey);
                              }}
                            >
                              <Dropdown.Item key={"Current Month"}>
                                Current Month
                              </Dropdown.Item>
                              <Dropdown.Item key={"Previous Month"}>
                                Previous Month
                              </Dropdown.Item>
                              <Dropdown.Item key={"Last 30 Days"}>
                                Last 30 Days
                              </Dropdown.Item>
                              <Dropdown.Item key={"Last 60 Days"}>
                                Last 60 Days
                              </Dropdown.Item>
                              <Dropdown.Item key={"Last 90 Days"}>
                                Last 90 Days
                              </Dropdown.Item>
                              <Dropdown.Item key={"Current Year"}>
                                Current Year
                              </Dropdown.Item>
                              <Dropdown.Item key={"All"}>All</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        }
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="text-black px-6 py-4">
                        This months # of scans
                      </td>
                      {!fetchingBusinessStats ? (
                        <td className="px-6 py-4">
                          {businessStats ? businessStats.totalListings : ""}
                        </td>
                      ) : (
                        <td>
                          <div className="h-5 mx-5 bg-gray-200 rounded-full w-16 my-4"></div>
                        </td>
                      )}
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="text-black px-6 py-4">
                        Most common category
                      </td>
                      {!fetchingBusinessStats ? (
                        <td className="px-6 py-4">
                          {businessStats
                            ? businessStats.mostCommonCategory === "None"
                              ? "--"
                              : businessStats.mostCommonCategory
                            : ""}
                        </td>
                      ) : (
                        <td>
                          <div className="h-5 mx-5 bg-gray-200 rounded-full w-16 my-4"></div>
                        </td>
                      )}
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="text-black px-6 py-4"> # disposed</td>
                      {!fetchingBusinessStats ? (
                        <td className="px-6 py-4">
                          {businessStats ? businessStats.disposedListings : ""}
                        </td>
                      ) : (
                        <td>
                          <div className="h-5 mx-5 bg-gray-200 rounded-full w-16 my-4"></div>
                        </td>
                      )}
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="text-black px-6 py-4"> # keep</td>
                      {!fetchingBusinessStats ? (
                        <td className="px-6 py-4">
                          {businessStats ? businessStats.listingsToSell : ""}
                        </td>
                      ) : (
                        <td>
                          <div className="h-5 mx-5 bg-gray-200 rounded-full w-16 my-4"></div>
                        </td>
                      )}
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="text-black px-6 py-4"> # trashed</td>
                      {!fetchingBusinessStats ? (
                        <td className="px-6 py-4">
                          {businessStats ? businessStats.listingsDamaged : ""}
                        </td>
                      ) : (
                        <td>
                          <div className="h-5 mx-5 bg-gray-200 rounded-full w-16 my-4"></div>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <ButtonComponent
                full
                rounded
                onClick={() => downloadCSV()}
              >
                Download Excel report
              </ButtonComponent>
            </div>

            <div className="flex items-center justify-center mt-4 hidden">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isViewableForVoting}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E44A1F]"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Viewable for voting
                </span>
              </label>
              <TooltipComponent
                rounded
                placement="rightStart"
                width="!w-64"
                id="shipping-status-tooltip"
                css={{ zIndex: 10000 }}
                content={
                  "Lorem ipsum dolar sit amit Lorem ipsum dolar sit amit Lorem ipsum dolar sit amit"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 ml-3 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </TooltipComponent>
            </div>

            <div className="flex justify-center mt-5 hidden">
              <ButtonComponent
                full
                rounded
              >
                Invite a customer
              </ButtonComponent>
            </div>

            <div className="mt-4 w-full flex justify-center">
              <ButtonComponent
                full
                rounded
                onClick={() => signOut()}
              >
                Sign Out
              </ButtonComponent>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Profilecomponent;
