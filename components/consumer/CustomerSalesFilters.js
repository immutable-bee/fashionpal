import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import ShareFashionPal from "@/components/consumer/ShareFashionPal";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
export default function CustomerFilters({
  fetchListings,
  changeFilter,
  changeType,
  changeSize,
  changeZipCode,
  changeRadius,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const [filter, setFilter] = useState("");

  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [sizes, setSizes] = useState([
    { value: "XS", type: "" },
    { value: "S", type: "" },
    { value: "M", type: "" },
    { value: "L", type: "" },
    { value: "XL", type: "" },
    { value: "XXL", type: "" },
    { value: 1, type: "Footwear" },
    { value: 2, type: "Footwear" },
    { value: 3, type: "Footwear" },
    { value: 4, type: "Footwear" },
    { value: 5, type: "Footwear" },
    { value: 6, type: "Footwear" },
    { value: 7, type: "Footwear" },
    { value: 8, type: "Footwear" },
    { value: 9, type: "Footwear" },
    { value: 10, type: "Footwear" },
    { value: 11, type: "Footwear" },
    { value: 12, type: "Footwear" },
    { value: 13, type: "Footwear" },
    { value: 14, type: "Footwear" },
    { value: 15, type: "Footwear" },
  ]);

  const onChangeFilter = (e) => {
    const value = e.target.value;
    setFilter(value);
    changeFilter(value);
  };
  const onChangeType = (e) => {
    const value = e;
    setType(value);
    changeType(value);
  };
  const onChangeSize = (e) => {
    const value = e;
    setSize(value);
    changeSize(value);
  };
  const onChangeZipCode = (e) => {
    const value = e.target.value;
    setZipCode(value);
    changeZipCode(value);
  };
  const onChangeRadius = (e) => {
    const value = e.target.value;
    setRadius(value);
    changeRadius(value);
  };

  return (
    <div>
      <ShareFashionPal />
      <div class=" flex justify-between px-5 max-w-7xl mx-auto">
        <Inputcomponent
          value={filter}
          onChange={(e) => onChangeFilter(e)}
        />

        <div className="flex flex-shrink-0 items-center justify-end">
          <div className="ml-2 sm:ml-3">
            <button
              type="button"
              class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
              onClick={() => fetchListings()}
            >
              <div>
                <svg
                  class="text-white w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      <ul className=" mt-2 flex flex-wrap sm:justify-center sm:items-center sm:ml-2">
        <div className="px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 ">
          <label className="block">Start date</label>
          <div className="relative">
            <DatePicker
              selected={type}
              onChange={(e) => onChangeType(e)}
              dateFormat="yyyy/MM/dd"
              className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 absolute right-2 top-2.5 pointer-events-none"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </div>
        </div>
        <div className="px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 ">
          <label className="block">End date</label>
          <div className="relative">
            <DatePicker
              selected={size}
              onChange={(e) => onChangeSize(e)}
              minDate={type}
              dateFormat="yyyy/MM/dd"
              className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 absolute right-2 top-2.5 z-0 pointer-events-none"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </div>
        </div>

        {/* Button to toggle filters visibility */}

        <div
          className={`flex sm:hidden justify-center w-full mt-3 ${
            showFilters ? "!hidden" : ""
          }`}
        >
          <button
            className="mb-3 flex items-center text-blue-600 border-b border-blue-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            More Filters
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 ml-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>

        {/* Conditional rendering of filters based on state */}

        <div
          className={`px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 sm:block hidden ${
            showFilters ? "!block" : ""
          }`}
        >
          <label className="block">Zip Code</label>
          <input
            className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            type="number"
            onChange={(e) => onChangeZipCode(e)}
          />
        </div>
        <div
          className={`px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 sm:block hidden ${
            showFilters ? "!block" : ""
          }`}
        >
          <label className="block">Mile Radius</label>
          <select
            className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            onChange={(e) => onChangeRadius(e)}
          >
            <option value="">All</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
            <option value="200">200 miles</option>
          </select>
        </div>
      </ul>
    </div>
  );
}
