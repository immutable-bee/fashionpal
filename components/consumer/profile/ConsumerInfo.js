import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Checkbox } from "@nextui-org/react";

function ConsumerInfo({ consumerData, setConsumerData, fetchConsumerDetails }) {
  const [followCode, setFollowCode] = useState("");
  const [followBusinessMessage, setFollowBusinessMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState({
    weekly: {
      active: false,
      receiveTreasures: false,
      receiveNewlyListedPremium: false,
    },
    discount: {
      active: false,
      receiveRecurringDiscounts: false,
      receiveOneTimeSpecials: false,
    },
  });
  const [emailPrefsInitialized, setEmailPrefsInitialized] = useState(false);

  const togglePreference = (category, preference) => {
    setEmailPreferences((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [preference]: !prevState[category][preference],
      },
    }));
  };

  const sendFieldUpdate = async (fieldName, fieldValue) => {
    try {
      const response = await fetch("/api/consumer/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [fieldName]: fieldValue,
        }),
      });

      if (response.ok) {
      } else {
        console.error(`Error updating ${fieldName}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const debouncedSendFieldUpdate = debounce(sendFieldUpdate, 500);

  const handleCheckboxChange = (name, checked) => {
    setConsumerData({
      ...consumerData,
      [name]: checked,
    });

    debouncedSendFieldUpdate(name, checked);
  };
  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    let modifyValue = ["emailAlertsOn", "discountEmailAlertsOn"].includes(name)
      ? checked
      : value;
    setConsumerData({
      ...consumerData,
      [name]: modifyValue,
    });

    debouncedSendFieldUpdate(name, modifyValue);
  };

  const handleFollowCodeChange = (e) => {
    setFollowCode(e.target.value);
  };

  const followBusiness = async (e) => {
    e.preventDefault();

    if (followCode.length === 10) {
      setUpdating(true);
      const response = await fetch("/api/consumer/followBusiness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessId: "", hash: followCode }),
      });

      if (!response.ok) {
        setFollowBusinessMessage("Failed to follow business, please try again");
      } else {
        setFollowBusinessMessage("Success");
        await fetchConsumerDetails();
      }
      setUpdating(false);
    } else {
      setFollowBusinessMessage(
        "Invalid code, please check your code and try again"
      );
    }
  };

  const handleUnfollow = async (id) => {
    console.log("Unfollowing store with ID:", id);

    const response = await fetch("/api/consumer/unfollowBusiness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId: id, hash: "" }),
    });

    if (!response.ok) {
      console.error("Failed to unfollow business");
    } else {
      console.log("Successfully unfollowed business");
      await fetchConsumerDetails();
    }
  };

  const updateEmailPreferences = async () => {
    const response = await fetch(
      "/api/consumer/profile/updateEmailPreferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailPreferences }),
      }
    );
  };

  useEffect(() => {
    let timer;
    if (followBusinessMessage) {
      timer = setTimeout(() => {
        setFollowBusinessMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [followBusinessMessage]);

  useEffect(() => {
    if (consumerData.emailPreferences && !emailPrefsInitialized) {
      const pref = consumerData.emailPreferences;

      setEmailPreferences({
        weekly: {
          active: pref.weeklyEmailReport,
          receiveTreasures: pref.receiveTreasures,
          receiveNewlyListedPremium: pref.receiveNewlyListedPremium,
        },
        discount: {
          active: pref.discountEmailReport,
          receiveRecurringDiscounts: pref.receiveRecurringDiscounts,
          receiveOneTimeSpecials: pref.receiveOneTimeSpecials,
        },
      });
      setEmailPrefsInitialized(true);
    }
  }, [consumerData.emailPreferences]);

  useEffect(() => {
    if (emailPrefsInitialized) {
      updateEmailPreferences();
    }
  }, [emailPreferences]);

  return (
    <>
      <div className="max-w-xl w-full bg-whit  pb-3 sm:pb-6 rounded">
        {/* <h1 className="text-lg sm:text-2xl font-medium text-center ">
          Profile Page
        </h1> */}
        <div className="">
          <div className="py-2">
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              name="username"
              type="text"
              className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
              value={consumerData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="py-2">
            <label className="text-sm text-gray-700">Email</label>
            <input
              name="email"
              disabled
              type="text"
              className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
              value={consumerData.email}
              onChange={handleInputChange}
            />
          </div>
          {/*  */}
          {/*  */}
          <div className=" rounded-2xl mt-2 py-3 px-3 border shadow-sm">
            <h3 className=" text-primary font-semibold text-2xl">Subscribed</h3>

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
                        value={emailPreferences.weekly.active}
                        type="checkbox"
                        className="sr-only peer"
                        name="emailAlertsOn"
                        onChange={() => togglePreference(`weekly`, `active`)}
                      />

                      <div
                        className={`w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          emailPreferences.weekly.active === true
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              {emailPreferences.weekly.active && (
                <div className="ml-3">
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg text-gray-700">
                        Treasures for You{" "}
                      </h1>
                    </div>
                    <div>
                      <Checkbox
                        onChange={() =>
                          togglePreference("weekly", "receiveTreasures")
                        }
                        isSelected={emailPreferences.weekly.receiveTreasures}
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
                          togglePreference(
                            "weekly",
                            "receiveNewlyListedPremium"
                          )
                        }
                        isSelected={
                          emailPreferences.weekly.receiveNewlyListedPremium
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
                        value={emailPreferences.discount.active}
                        name="discountEmailAlertsOn"
                        onChange={() => togglePreference("discount", "active")}
                        type="checkbox"
                        className="sr-only peer"
                      />

                      <div
                        className={`w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          emailPreferences.discount.active === true
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              {emailPreferences.discount.active && (
                <div className="ml-3">
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h1 className="text-lg text-gray-700">
                        Recurring Discounts
                      </h1>
                    </div>
                    <div>
                      <Checkbox
                        onChange={() =>
                          togglePreference(
                            "discount",
                            "receiveRecurringDiscounts"
                          )
                        }
                        isSelected={
                          emailPreferences.discount.receiveRecurringDiscounts
                        }
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
                        onChange={() =>
                          togglePreference("discount", "receiveOneTimeSpecials")
                        }
                        isSelected={
                          emailPreferences.discount.receiveOneTimeSpecials
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
          </div>
          {/*  */}
          {/*  */}

          <div className="w-full mt-5 rounded-lg md:w-3/4 sm:w-3/4 mx-auto bg-white border-2 border-gray-300 p-4 text-center">
            <p>Use QR Code at checkout to receive your subscriber price</p>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <QRCode value={consumerData.email} size={250} />
        </div>
        <label className="flex justify-center">{consumerData.email}</label>
      </div>

      <div className="w-1/3 pt-5 pb-10 flex flex-col items-center">
        <h2 className="text-3xl text-gray-700 mb-3">Following</h2>
        {consumerData?.following?.length > 0 ? (
          <table className="w-1/2">
            <caption className="pb-3 text-xl">Store Name</caption>

            {consumerData?.following.map((store) => (
              <tr className="border border-black" key={store.businessId}>
                <td className="text-lg pl-2">{store.businessName}</td>
                <td>
                  <img
                    class="cursor-pointer"
                    onClick={() => handleUnfollow(store.businessId)}
                    src="/images/close-circle.svg"
                    width={20}
                    height={20}
                  />
                </td>
              </tr>
            ))}
          </table>
        ) : (
          <h2>You are not currently following any stores</h2>
        )}

        <form className="flex flex-col w-full" onSubmit={followBusiness}>
          <h2 className="mt-9 text-lg pl-1 text-gray-700">Enter Store Code</h2>
          <div className="flex items-center gap-1">
            <input
              type="text"
              className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-600"
              value={followCode}
              onChange={handleFollowCodeChange}
            />
            <button
              className={updating && " pointer-events-none opacity-70"}
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-10 h-10 text-primary"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <label
            className={
              followBusinessMessage !== "Success"
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {followBusinessMessage}
          </label>
        </form>
      </div>
    </>
  );
}

export default ConsumerInfo;
