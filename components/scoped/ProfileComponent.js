import EditBusinessProfileModal from "./EditBusinessProfileModal";
import React, { useEffect, useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import Loading from "@/components/utility/loading";
import { signOut } from "next-auth/react";
import { NotificationManager } from "react-notifications";
import { useRouter } from "next/router";

function ProfileComponent() {
  const router = useRouter();
  const [editModal, setEditModal] = useState(false);
  const [isWeeklyEmailReports, setisWeeklyEmailReports] = useState(false);
  const [treasures, setTreasures] = useState(false);
  const [isDiscountEmailReports, setisDiscountEmailReports] = useState(false);

  const [daysThroughTraget, setDaysThroughTarget] = useState("1750");
  const [daysASPTarget, setDaysASPTarget] = useState("$12");
  const [fetchingUser, setFetchingUser] = useState(true);
  const [businessData, setBusinessData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [squareStateCode, setSquareStateCode] = useState("");

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
      const payload = {
        email: businessData.email,
        data: {
          businessName: businessData.businessName,
          squareAccessToken: businessData.squareAccessToken,
        },
      };
      await sendAPIRequest(payload);
      await fetchBusinessData();
    } catch (error) {}
    setUpdating(false);
  };

  const sendAPIRequest = async (payload) => {
    try {
      await fetch("/api/business/updateData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {}
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
      if (data) {
        setBusinessData(data.business);
      }
    } else {
      return console.error("Failed to fetch user data:", data.error);
    }
  };

  const onDone = async (data) => {
    console.log("data", data);
    try {
      //TODO: add the end point here
    } catch (error) {}
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

  const handleSquareStateCode = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const state = Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    setSquareStateCode(state);
    return state;
  };

  useEffect(() => {
    if (businessData) {
      if (!businessData.squareAccessToken) {
        const state = handleSquareStateCode();
        sessionStorage.setItem("squareStateCode", state);
      }
    }
  }, [businessData]);

  const handleSquareAuth = () => {
    router.push(
      `https://connect.squareup.com/oauth2/authorize?client_id=sq0idp-aFxBr4NKKAfjaET0GpKLKA&scope=ITEMS_WRITE+ITEMS_READ+MERCHANT_PROFILE_READ+MERCHANT_PROFILE_WRITE+ORDERS_WRITE+ORDERS_READ&session=false&state=${squareStateCode}`
    );
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
              <ButtonComponent
                className="mt-3"
                rounded
                full
                loading={updating}
                type="submit"
              >
                Update
              </ButtonComponent>

              <div className="py-2">
                <label className="text-sm text-gray-700">
                  Square Authorization Status
                </label>
                <h2>
                  {businessData?.squareAccessToken ? "Active" : "Not Connected"}
                </h2>
              </div>
              <ButtonComponent
                className="mt-3"
                rounded
                full
                loading={updating}
                onClick={handleSquareAuth}
              >
                {businessData?.squareAccessToken
                  ? "Revoke Access"
                  : "Connect Square Account"}
              </ButtonComponent>
            </form>
          )}
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
          <EditBusinessProfileModal onClose={onClose} onDone={onDone} />
        )}
      </div>
    </div>
  );
}
export default ProfileComponent;
