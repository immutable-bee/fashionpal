import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Checkbox } from "@nextui-org/react";

function ConsumerInfo({ consumerData, setConsumerData }) {
  // const isValidEmail = (email) => {
  //   const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   return regex.test(email);
  // };
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
                        value={consumerData.emailAlertsOn}
                        type="checkbox"
                        className="sr-only peer"
                        name="emailAlertsOn"
                        onChange={handleInputChange}
                      />

                      <div
                        className={`w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          consumerData.emailAlertsOn === true
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              {consumerData.emailAlertsOn && (
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
                          handleCheckboxChange(
                            "treasures",
                            !consumerData.treasures
                          )
                        }
                        isSelected={consumerData.treasures}
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
                          handleCheckboxChange(
                            "newlyListedPremium",
                            !consumerData.newlyListedPremium
                          )
                        }
                        isSelected={consumerData.newlyListedPremium}
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
                        value={consumerData.discountEmailAlertsOn}
                        name="discountEmailAlertsOn"
                        onChange={handleInputChange}
                        type="checkbox"
                        className="sr-only peer"
                      />

                      <div
                        className={`w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          consumerData.discountEmailAlertsOn === true
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              {consumerData.discountEmailAlertsOn && (
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
                          handleCheckboxChange(
                            "recurringDiscounts",
                            !consumerData.recurringDiscounts
                          )
                        }
                        isSelected={consumerData.recurringDiscounts}
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
                          handleCheckboxChange(
                            "oneTimeSpecials",
                            !consumerData.oneTimeSpecials
                          )
                        }
                        isSelected={consumerData.oneTimeSpecials}
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
          <QRCode
            value={consumerData.email}
            size={250}
          />
        </div>
        <label className="flex justify-center">{consumerData.email}</label>
      </div>
    </>
  );
}

export default ConsumerInfo;
