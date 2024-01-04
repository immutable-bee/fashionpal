import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";

function ConsumerInfo({ consumerData, setConsumerData }) {
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
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

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    let modifyValue = name === "emailAlertsOn" ? checked : value;
    setConsumerData({
      ...consumerData,
      [name]: modifyValue,
    });

    debouncedSendFieldUpdate(name, modifyValue);
  };

  return (
    <>
      <div className="max-w-xl w-full bg-whit px-4 sm:px-8 py-3 sm:py-6 rounded">
        <h1 className="text-lg sm:text-2xl font-medium text-center ">
          Profile Page
        </h1>
        <div className="mt-2 sm:mt-6">
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

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="emailAlertsOn"
              checked={consumerData.emailAlertsOn}
              className="sr-only peer"
              onChange={handleInputChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Weekly Email Notifications
            </span>
          </label>
          <div className="w-full md:w-3/4 sm:w-3/4 mx-auto bg-white border-2 border-gray-300 p-4 text-center">
            <p>Use QR Code at checkout to receive your subscriber price</p>
          </div>
        </div>
        <div className="flex justify-center">
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
