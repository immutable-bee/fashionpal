import { useState } from "react";
import Inputcomponent from "@/components/utility/Input";
import debounce from "lodash.debounce";

export default function CustomerFilters({
  fetchListings,
  changeSearchText,
  changeCategory,
  changeStatus,
  changeSize,
}) {
  const sizes = [
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
  ];

  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const statusOptions = [
    { label: "All status", value: "" },
    { label: "Trashed", value: "DAMAGED" },
    { label: "Disposed", value: "DISPOSED" },
    { label: "Sell", value: "SALE" },
  ];

  const categoryOptions = [
    { label: "All categories", value: "" },
    { label: "Clothing", value: "Clothing" },
    { label: "Footwear", value: "Footwear" },
    { label: "Hats", value: "Hats" },
  ];

  const [filter, setFilter] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState({ label: "All status", value: "" });
  const [category, setCategory] = useState({
    label: "All categories",
    value: "",
  });

  const onChangeSearchText = (e) => {
    const value = e.target.value;
    setFilter(value);
    changeSearchText(value);
  };

  const debouncedOnChangeSearchText = debounce(onChangeSearchText, 500);

  const onChangeCategory = (e) => {
    setCategory(e);
    changeCategory(e.value);
    resetDropdownStates();
  };

  const onChangeStatus = (e) => {
    setStatus(e);
    changeStatus(e.value);
    resetDropdownStates();
  };

  const onChangeSize = (e) => {
    const value = e.target.value;
    setSize(value);
    changeSize(value);
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!isStatusDropdownOpen);
    setCategoriesDropdownOpen(false);
  };

  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownOpen(!isCategoriesDropdownOpen);
    setStatusDropdownOpen(false);
  };

  const resetDropdownStates = () => {
    setCategoriesDropdownOpen(false);
    setStatusDropdownOpen(false);
  };

  return (
    <div>
      <form>
        <div class="sm:flex relative justify-between px-5 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:flex">
            <button
              id="dropdown-button"
              data-dropdown-toggle="dropdown"
              class="flex-shrink-0   z-10 w-full sm:w-40 inline-flex justify-between items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 "
              type="button"
              onClick={() => toggleStatusDropdown()}
            >
              {status.label}
              <svg
                class="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isStatusDropdownOpen && (
              <div class="z-10 absolute top-11 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ">
                <ul
                  class="py-2 text-sm text-gray-700 "
                  aria-labelledby="dropdown-button"
                >
                  {statusOptions.map((option) => (
                    <li key={option}>
                      <button
                        type="button"
                        class="inline-flex w-full px-4 py-2 hover:bg-gray-100 "
                        onClick={() => onChangeStatus(option)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              id="dropdown-button"
              data-dropdown-toggle="dropdown"
              class="flex-shrink-0 w-full sm:w-40 z-10 inline-flex justify-between items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 sm:rounded-none rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 "
              type="button"
              onClick={() => toggleCategoriesDropdown()}
            >
              {category.label}
              <svg
                class="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {isCategoriesDropdownOpen && (
              <div
                key={1}
                class="z-10 absolute top-11 sm:left-44 left-[50%] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 "
              >
                <ul
                  class="py-2 text-sm text-gray-700 "
                  aria-labelledby="dropdown-button"
                >
                  {categoryOptions.map((option) => (
                    <li key={option}>
                      <button
                        type="button"
                        class="inline-flex w-full px-4 py-2 hover:bg-gray-100 "
                        onClick={() => onChangeCategory(option)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div class="relative w-full sm:mt-0 mt-3">
            <input
              type="search"
              id="search-dropdown"
              class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg sm:rounded-s-none sm:border-s-gray-50 sm:border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Search Tags...."
              onChange={(e) => debouncedOnChangeSearchText(e)}
            />
            <button
              type="submit"
              class="absolute top-0 end-0 py-2.5 px-3 text-sm font-medium h-full text-white bg-primary rounded-e-lg border border-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              onClick={() => fetchListings()}
            >
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span class="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
      {/* <div className=" flex justify-between px-5 max-w-7xl mx-auto">
        <Inputcomponent
          value={filter}
          onChange={(e) => debouncedOnChangeSearchText(e)}
        />

        <div className="flex flex-shrink-0 items-center justify-end">
          <div className="ml-2 sm:ml-3">
            <button
              type="button"
              className="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
              onClick={() => fetchListings()}
            >
              <div>
                <svg
                  className="text-white w-4"
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
      <ul className=" mt-2 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center sm:items-center sm:ml-2">
        <div className="mx-2 sm:mt-0 mt-3 ">
          <label className="block">Status</label>
          <select
            className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            onChange={(e) => onChangeStatus(e)}
          >
            <option value="">All</option>
            <option value="DAMAGED">Trashed</option>
            <option value="DISPOSED">Disposed</option>
            <option value="SALE">Sell</option>
          </select>
        </div>

        <div className="mx-2 sm:mt-0 mt-3 ">
          <label className="block">Category</label>
          <select
            className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            onChange={(e) => onChangeCategory(e)}
          >
            <option value="">All</option>
            <option value="Clothing">Clothing</option>
            <option value="Footwear">Footwear</option>
            <option value="Hats">Hats</option>
          </select>
        </div>

        <div className="mx-2 sm:mt-0 mt-3 hidden">
          <label className="block">Size</label>
          <select
            value={size}
            className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            onChange={(e) => onChangeSize(e)}
          >
            <option value="">All</option>
            {sizes
              .filter((x) =>
                category === "Footwear"
                  ? x.type === "Footwear"
                  : x.type !== "Footwear"
              )
              .map((x) => (
                <option
                  key={x.value}
                  value={x.value}
                >
                  {x.value}
                </option>
              ))}
          </select>
        </div>
      </ul> */}
    </div>
  );
}
