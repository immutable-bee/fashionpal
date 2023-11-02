import React, { useEffect, useState } from "react";
import TooltipComponent from "@/components/utility/Tooltip";
import Head from "next/head";
import HeaderComponent from "@/components/utility/BusinessHeader";
import ButtonComponent from "@/components/utility/Button";
import { Loading } from "@nextui-org/react";
import { signOut } from "next-auth/react";

const Profilecomponent = () => {
  // const { user, updateUserUsername, fetchUserData } = useUser();
  const [user, setUser] = useState({});
  const [isViewableForVoting, setIsViewableForVoting] = useState(true);

  const [formData, setFormData] = useState();
  const [businessStats, setBusinessStats] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    // add check for empty input on store name or email
    e.preventDefault();
    console.log(user);
  };

  const fetchBusinessStats = async (dateTo = null, dateFrom = null) => {
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

    if (response.ok) {
      setBusinessStats(data);
    } else {
      console.error("Failed to fetch business stats:", data.error);
    }
  };

  useEffect(() => {
    fetchBusinessStats();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <link rel="shortcut icon" href="/images/fav.png" />
      </Head>

      <div>
        <HeaderComponent />

        <section className="px-5 ">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="py-2">
                <label className="text-sm text-gray-700">Store name</label>
                <input
                  name="store_name"
                  type="text"
                  className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                  onChange={handleChange}
                />
              </div>
              <div className="py-2">
                <label className="text-sm text-gray-700">Email</label>
                <input
                  name="email"
                  type="text"
                  className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                  onChange={handleChange}
                />
              </div>

              <ButtonComponent className="mt-3" rounded full type="submit">
                Update
              </ButtonComponent>
            </form>

            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-8 items-center">
              <div class="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Label
                      </th>

                      <th scope="col" class="px-6 py-3">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4">
                        This months # of scans
                      </td>
                      {businessStats ? (
                        <td class="px-6 py-4">{businessStats.totalListings}</td>
                      ) : (
                        <Loading />
                      )}
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4">
                        {" "}
                        Most common category
                      </td>
                      {businessStats ? (
                        <td class="px-6 py-4">
                          {businessStats.mostCommonCategory}
                        </td>
                      ) : (
                        <Loading />
                      )}
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4"> # disposed</td>
                      {businessStats ? (
                        <td class="px-6 py-4">
                          {businessStats.disposedListings}
                        </td>
                      ) : (
                        <Loading />
                      )}
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4"> # to sell</td>
                      {businessStats ? (
                        <td class="px-6 py-4">
                          {businessStats.listingsToSell}
                        </td>
                      ) : (
                        <Loading />
                      )}
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4"> % down voted</td>
                      {businessStats ? (
                        <td class="px-6 py-4">
                          {businessStats.percentageDownVoted}
                        </td>
                      ) : (
                        <Loading />
                      )}
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4">% up voted</td>
                      {businessStats ? (
                        <td class="px-6 py-4">
                          {businessStats.percentageUpVoted}
                        </td>
                      ) : (
                        <Loading />
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <ButtonComponent full rounded>
                Download Excel report
              </ButtonComponent>
            </div>

            <div className="flex items-center justify-center mt-4">
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
                  class="w-8 h-8 ml-3 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </TooltipComponent>
            </div>

            <div className="flex justify-center mt-5">
              <ButtonComponent full rounded>
                Invite a customer
              </ButtonComponent>
            </div>

            <div className="mt-4 w-full flex justify-center">
              <ButtonComponent full rounded onClick={() => signOut()}>
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
