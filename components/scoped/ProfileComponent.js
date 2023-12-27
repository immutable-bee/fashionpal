// App.js
import EditBusinessProfileModal from "./EditBusinessProfileModal";
import React, { useState } from "react";

function App() {
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState(false);
  const [isWeeklyEmailReports, setisWeeklyEmailReports] = useState(false);
  const [daysThroughTraget, setDaysThroughTarget] = useState("1750");
  const [daysASPTarget, setDaysASPTarget] = useState("$12");

  const handleStarClick = () => {
    setPriority(!priority);
  };
  const handleIsWeeklyEmailReports = () => {
    setisWeeklyEmailReports(!isWeeklyEmailReports);
  };
  const onDone = () => {
    setEditModal(!editModal);
  };
  const onClose = () => {
    setEditModal(!editModal);
  };
  const handleStoreName = (e) => {
    setEditName(e.target.value);
    console.log(editName);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };
  const handleDaysThroughTarget = (e) => {
    setDaysThroughTarget(e.target.value);
    console.log(daysThroughTraget);
  };
  const handleDaysASPTarget = (e) => {
    setDaysASPTarget(e.target.value);
    console.log(daysASPTarget);
  };

  return (
    <div className="my-5 flex justify-center ">
      <div className="sm:w-[420px]">
        <div>
          <div>
            <h1 className="text-md text-gray-700">Store Name</h1>
            <input
              value={editName}
              onChange={handleStoreName}
              className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
            />
          </div>
          <div className="mt-3">
            <h1 className="text-md text-gray-700">Email</h1>
            <input
              value={email}
              onChange={handleEmail}
              className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="">
              <h1 className="text-md text-gray-700">Weekly Email Reports </h1>
            </div>
            <div className="">
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
          <div className="mt-4">
            <h1 className="text-xl">Key Performance Metrics</h1>
            <div className="flex rounded-2xl mt-2 pb-3 pt-1 pl-3 pr-1 border shadow-sm">
              <div className="w-[94%] mt-2">
                <div className="flex items-center justify-between mt-3">
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
                    onChange={handleDaysThroughTarget}
                    className="font-medium px-2 py-1 border focus:ring-1 focus:ring-[#ffc71f] border-green-500 focus:outline-none text-black rounded-xl w-28 h-10"
                  />
                </div>
              </div>
              <div className="flex justify-end pl-3">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  value={priority}
                  data-gtm-form-interact-field-id="0"
                />
                <svg
                  onClick={handleStarClick}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`icon icon-tabler icon-tabler-star-filled mt-0.5 mr-0.5 cursor-pointer ${
                    priority ? "text-yellow-500" : "text-gray-500"
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path
                    d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                    stroke-width="0"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <div className=" rounded-2xl mt-2 py-3 px-3 border shadow-sm">
              <div className="w-[94%]">
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
                className="mt-3 bg-orange-500  border border-black text-white rounded-lg text-base px-10 py-[6px] hover:opacity-70"
              >
                Edit
              </button>
            </div>
            <div className="flex justify-center">
              <button className="mt-3 text-orange-500 border border-black bg-white rounded-lg text-base px-10 py-[6px] hover:opacity-70">
                Logout
              </button>
            </div>
          </div>
        </div>
        {editModal === true ? (
          <EditBusinessProfileModal
            onClose={onClose}
            onDone={onDone}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default App;
