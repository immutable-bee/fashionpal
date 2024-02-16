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
  // const [copiedToClipboardMessage, setCopiedToClipboardMessage] = useState("");

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

  const copyToClipboard = async (text) => {
    // await navigator.clipboard.writeText(text);
    // setCopiedToClipboardMessage("Code copied to clipboard");

    await navigator.clipboard
      .writeText(text)
      .then(() => {
        NotificationManager.success("Code copied to clipboard!");
      })
      .catch(() => {
        NotificationManager.error("Failed to copy Code. Please copy manually.");
      });
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

  const handleSquareAuth = async () => {
    if (!businessData.squareAccessToken) {
      router.push(
        `https://connect.squareup.com/oauth2/authorize?client_id=sq0idp-aFxBr4NKKAfjaET0GpKLKA&scope=ITEMS_WRITE+ITEMS_READ+MERCHANT_PROFILE_READ+MERCHANT_PROFILE_WRITE+ORDERS_WRITE+ORDERS_READ+INVENTORY_WRITE+INVENTORY_READ&session=false&state=${squareStateCode}`
      );
    }
    if (businessData.squareAccessToken) {
      await revokeSquareAuth();
    }
  };

  const revokeSquareAuth = async () => {
    try {
      await fetch("/api/business/square/revokeSquareToken");
      await fetchBusinessData();
    } catch (error) {}
  };

  // useEffect(() => {
  //   let timer;
  //   if (copiedToClipboardMessage) {
  //     timer = setTimeout(() => {
  //       setCopiedToClipboardMessage("");
  //     }, 5000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [copiedToClipboardMessage]);

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
                  className="bg-white focus:ring-1 focus:ring-primary focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
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
                  className="bg-gray-100 focus:ring-1 focus:ring-primary focus:outline-none form-input border border-gray-300 w-full rounded-lg  px-4 my-1 py-2"
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
                    className="font-medium px-2 py-1 border focus:ring-1 focus:ring-primary border-primary focus:outline-none text-black rounded-xl w-28 h-10"
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
                    className="font-medium px-2 focus:ring-1 focus:ring-primary py-1 border border-primary focus:outline-none text-black rounded-xl w-28 h-10"
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
                className="mt-3 w-32 bg-primary  border border-black text-white rounded-lg text-base px-10 py-[6px] hover:opacity-70"
              >
                Edit
              </button>
            </div>

            <div className="pt-8 pb-4 flex flex-col items-center">
              <h2 className="text-2xl pb-2">Store Code</h2>
              <div
                className="flex items-center gap-2 bg-white px-5 py-1.5 rounded-lg shadow cursor-pointer"
                onClick={() =>
                  copyToClipboard(businessData?.tinyUrl?.split("/b/")[1])
                }
              >
                <h2 className="text-lg text-primary italic cursor-pointer">
                  {businessData?.tinyUrl?.split("/b/")[1]}
                </h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                  />
                </svg>
              </div>
              {/* <h2
                className="text-lg text-blue-500 italic cursor-pointer"
                onClick={() =>
                  copyToClipboard(businessData?.tinyUrl?.split("/b/")[1])
                }
              >
                {businessData?.tinyUrl?.split("/b/")[1]}
              </h2> */}
              {/* {copiedToClipboardMessage && (
                <label className="text-green-500">
                  {copiedToClipboardMessage}
                </label>
              )} */}
            </div>

            <div className="flex justify-center">
              <button
                className="mt-3 w-32 text-primary border border-black bg-white rounded-lg text-base px-10 py-[6px] hover:opacity-70"
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
