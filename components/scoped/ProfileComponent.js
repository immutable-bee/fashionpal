import EditBusinessProfileModal from "./EditBusinessProfileModal";
import React, { useEffect, useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import Loading from "@/components/utility/loading";
import { signOut } from "next-auth/react";
import { Checkbox } from "@nextui-org/react";

function ProfileComponent() {
  const [editModal, setEditModal] = useState(false);
  const [isWeeklyEmailReports, setisWeeklyEmailReports] = useState(false);
  const [treasures, setTreasures] = useState(false);
  const [newlyListedPremium, setNewlyListedPremium] = useState(false);
  const [isDiscountEmailReports, setisDiscountEmailReports] = useState(false);
  const [oneTimeSpecials, setOneTimeSpecials] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [daysThroughTraget, setDaysThroughTarget] = useState("1750");
  const [daysASPTarget, setDaysASPTarget] = useState("$12");
  const [fetchingUser, setFetchingUser] = useState(true);
  const [businessData, setBusinessData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBusinessData().then();
  }, []);

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
            squareAccessToken: businessData.squareAccessToken,
          },
        }),
      });
      await fetchBusinessData();
    } catch (error) {}
    setUpdating(false);
  };

  const fetchBusinessData = async () => {
    setFetchingUser(true);
    const response = await fetch(`/api/user/fetch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setFetchingUser(false);
    if (response.ok) {
      setBusinessData(data.business);
    } else {
      return console.error("Failed to fetch user data:", data.error);
    }
  };

  const handleIsWeeklyEmailReports = () => {
    setisWeeklyEmailReports(!isWeeklyEmailReports);
  };
  const handleIsDiscountEmailReports = () => {
    setisDiscountEmailReports(!isDiscountEmailReports);
  };
  const onDone = () => {
    setEditModal(!editModal);
  };
  const onClose = () => {
    setEditModal(!editModal);
  };

  const handleDaysThroughTarget = (e) => {
    setDaysThroughTarget(e.target.value);
  };
  const handleDaysASPTarget = (e) => {
    setDaysASPTarget(e.target.value);
  };

  return (
    <div className="my-5 sm:flex justify-center sm:px-0 px-3">
      <div className="sm:w-[420px]">
        <div>
          {fetchingUser ? (
            <div>
              <div>
                <div className="h-[312px] flex justify-center items-center">
                  <Loading size="xl" />
                </div>
              </div>
            </div>
          ) : (
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
                  className="bg-gray-100 focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-300 w-full rounded-lg  px-4 my-1 py-2"
                  onChange={handleChange}
                />
              </div>

              <div className="py-2">
                <label className="text-sm text-gray-700">
                  Square Access Token
                </label>
                <input
                  value={businessData?.squareAccessToken}
                  name="squareAccessToken"
                  type="password"
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
          )}
          <div className=" rounded-2xl mt-2 py-3 px-3 border shadow-sm">
            <h3 className=" text-green-600 font-semibold text-2xl">
              Subscribed
            </h3>

            <div>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <h1 className="text-xl text-gray-700">
                    Weekly Email Reports{" "}
                  </h1>
                </div>
                <div>
                  <div className="h-9 flex items-center">
                    <label className="relative w-12 inline-flex items-center cursor-pointer mx-1">
                      <input
                        value={isWeeklyEmailReports}
                        type="checkbox"
                        className="sr-only peer"
                        data-gtm-form-interact-field-id="0"
                      />

                      <div
                        onClick={handleIsWeeklyEmailReports}
                        className={`w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          isWeeklyEmailReports === true
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              {isWeeklyEmailReports && (
                <div className="ml-3">
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg text-gray-700">
                        Treasures for You{" "}
                      </h1>
                    </div>
                    <div>
                      <Checkbox
                        onChange={() => setTreasures(!treasures)}
                        id="onboarding-form-tc-checkbox"
                        className="mr-2"
                        size={"lg"}
                      ></Checkbox>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg text-gray-700">
                        Newly Listed Premium{" "}
                      </h1>
                    </div>
                    <div>
                      <Checkbox
                        onChange={() =>
                          setNewlyListedPremium(!newlyListedPremium)
                        }
                        id="onboarding-form-tc-checkbox"
                        className="mr-2"
                        size={"lg"}
                      ></Checkbox>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <h1 className="text-xl text-gray-700">
                    Discount Email Reports{" "}
                  </h1>
                </div>
                <div>
                  <div className="h-9 flex items-center">
                    <label className="relative w-12 inline-flex items-center cursor-pointer mx-1">
                      <input
                        value={isDiscountEmailReports}
                        type="checkbox"
                        className="sr-only peer"
                        data-gtm-form-interact-field-id="0"
                      />

                      <div
                        onClick={handleIsDiscountEmailReports}
                        className={`w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          isDiscountEmailReports === true
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              {isDiscountEmailReports && (
                <div className="ml-3">
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg text-gray-700">
                        Recurring Discounts
                      </h1>
                    </div>
                    <div>
                      <Checkbox
                        onChange={() => setRecurring(!recurring)}
                        id="onboarding-form-tc-checkbox"
                        className="mr-2"
                        size={"lg"}
                      ></Checkbox>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg text-gray-700">
                        One-time Specials
                      </h1>
                    </div>
                    <div>
                      <Checkbox
                        onChange={() => setOneTimeSpecials(!oneTimeSpecials)}
                        id="onboarding-form-tc-checkbox"
                        className="mr-2"
                        size={"lg"}
                      ></Checkbox>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl text-center">Key Performance Metrics</h1>
            <div className=" rounded-2xl mt-2 py-3 px-3 border shadow-sm">
              <div className="w-full ">
                <div className="flex items-center justify-between">
                  <h1 className="text-md text-gray-700">
                    90 day AVG Listings added:
                  </h1>
                  <h3 className="flex items-center justify-between font-medium px-2 py-1 border border-gray-950 text-black rounded-xl w-28 h-10">
                    2500
                  </h3>
                </div>
                <div className="flex items-center justify-between  mt-3">
                  <h1 className="text-md text-gray-700">
                    90 day Sell through:
                  </h1>
                  <h3 className="flex items-center justify-between font-medium px-2 py-1 border border-gray-950 text-black rounded-xl w-28 h-10">
                    1500
                  </h3>
                </div>
                <div className="flex items-center justify-between  mt-3">
                  <h1 className="text-md text-gray-700">
                    90 day Sell through Target:
                  </h1>
                  <input
                    value={daysThroughTraget}
                    type="number"
                    onChange={handleDaysThroughTarget}
                    className="font-medium px-2 py-1 border focus:ring-1 focus:ring-[#ffc71f] border-green-500 focus:outline-none text-black rounded-xl w-28 h-10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <div className=" rounded-2xl mt-2 py-3 px-3 border shadow-sm">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h1 className="text-md text-gray-700">90 day ALP:</h1>
                  <h3 className="flex items-center justify-between font-medium px-2 py-1 border border-gray-950 text-black rounded-xl w-28 h-10">
                    $15
                  </h3>
                </div>
                <div className="flex items-center justify-between  mt-3">
                  <h1 className="text-md text-gray-700">90 day ASP:</h1>
                  <h3 className="flex items-center justify-between font-medium px-2 py-1 border border-gray-950 text-black rounded-xl w-28 h-10">
                    $10
                  </h3>
                </div>
                <div className="flex items-center justify-between  mt-3">
                  <h1 className="text-md text-gray-700">90 day ASP Target:</h1>
                  <input
                    value={daysASPTarget}
                    type="number"
                    onChange={handleDaysASPTarget}
                    className="font-medium px-2 focus:ring-1 focus:ring-[#ffc71f] py-1 border border-green-500 focus:outline-none text-black rounded-xl w-28 h-10"
                  />
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="mt-3 text-xl text-black">
            <h1 className="text-xl text-center text-black">
              Liquidation Thresholds
            </h1>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="mt-3 w-32 bg-orange-500  border border-black text-white rounded-lg text-base px-10 py-[6px] hover:opacity-70"
              >
                Edit
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="mt-3 w-32 text-orange-500 border border-black bg-white rounded-lg text-base px-10 py-[6px] hover:opacity-70"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {editModal === true && (
          <EditBusinessProfileModal
            onClose={onClose}
            onDone={onDone}
          />
        )}
      </div>
    </div>
  );
}
export default ProfileComponent;
