import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import { Dropdown } from "@nextui-org/react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import "rc-slider/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import SelectCategory from "../business/SelectCategory";

const RePricer = ({ onBack, categoryList }) => {
  const [ruleType, setRuleType] = useState("STANDARD");
  const [isRecurring, setIsRecurring] = useState(true);
  const [saleEndDate, setSaleEndDate] = useState("");
  const [saleStartDate, setSaleStartDate] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [appliedTo, setAppliedTo] = useState("ALL");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [listingType, setListingType] = useState("ALL");

  const [categoryTaxonomicPath, setCategoryTaxonomicPath] = useState({});

  const [adjustPriceBy, setAdjustPriceBy] = useState(0);
  const [cycle, setCycle] = useState("weekly");
  const [roundTo, setRoundTo] = useState("0.5");
  const [floorPrice, setFloorPrice] = useState(0);
  //
  const [isLoading, setIsLoading] = useState(0);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const onStart = async () => {
    if (!name) {
      NotificationManager.error("Rule name is required!");
      return;
    }
    if (!category) {
      NotificationManager.error("Category is required!");
      return;
    }
    if (!isRecurring) {
      if (!saleStartDate) {
        NotificationManager.error("Start Date is required!");
        return;
      }
    }
    setIsLoading(true);
    const data = {
      name: name,
      categoryId: category,
      listingType: listingType,
      ruleType: ruleType,
      isRecurring: isRecurring,
      daysOfWeek: daysOfWeek,
      appliedTo: appliedTo,
      adjustPriceBy: adjustPriceBy,
      cycle: cycle,
      roundTo: roundTo,
      floorPrice: floorPrice,
    };

    if (saleStartDate) {
      data.saleStartDate = saleStartDate;
    }
    if (saleEndDate) {
      data.saleEndDate = saleEndDate;
    }

    try {
      await axios.post("/api/pricing-rules/add", data);
      setIsLoading(false);
      NotificationManager.success("Rule added successfully!");
      onBack();
    } catch (error) {
      if (error?.response?.data?.error) {
        NotificationManager.error(error?.response?.data?.error);
      } else {
        NotificationManager.error("Error adding pricing rule:", error);
      }

      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="sm:w-96 mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
          onClick={() => onBack()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <div className="py-2">
          <label className="text-lg">Rule name</label>
          <input
            value={name}
            className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="py-2">
          <SelectCategory setCategoryTaxonomicPath={setCategoryTaxonomicPath} />
        </div>
        <ul
          class="
            flex flex-wrap
            mt-4
            text-xs
            sm:text-sm
            px-4
            py-2
            font-medium
            rounded-3xl
            text-center text-gray-500
            overflow-x-auto
            bg-gray-100
          "
        >
          <span
            className={`
              py-2
              w-6/12
              sm:py-2.5
              flex
              items-center
              justify-center
              capitalize
              cursor-pointer
              text-xl  ${
                ruleType === "SALE"
                  ? "text-white hover:text-white bg-primary rounded-2xl shadow-sm !px-3 sm:!px-14"
                  : "!text-gray-500 !px-2.5 sm:!px-12"
              }
            `}
            onClick={() => setRuleType("SALE")}
          >
            Sale
          </span>

          <span
            className={`
              py-2
              w-6/12
              sm:py-2.5
              flex
              items-center
              justify-center
              capitalize
              cursor-pointer
              text-xl  ${
                ruleType === "STANDARD"
                  ? "text-white hover:text-white bg-primary rounded-2xl shadow-sm !px-3 sm:!px-14"
                  : "!text-gray-500 !px-2.5 sm:!px-12"
              }
            `}
            onClick={() => {
              setRuleType("STANDARD");
              setIsRecurring(true);
            }}
          >
            Standard
          </span>
        </ul>

        <div className="py-2">
          <label className="text-lg">Listing Type</label>
          <select
            value={listingType}
            className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
            onChange={(e) => setListingType(e.target.value)}
          >
            <option value="ALL">Include Non-Members</option>
            <option value="PREMIUM_ONLY">Members Only</option>
            <option value="EXCLUDE_PREMIUM">Non-Members Only</option>
          </select>
        </div>
        <div className="py-2">
          <label className="text-lg">Applies To</label>
          <select
            value={appliedTo}
            className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
            onChange={(e) => setAppliedTo(e.target.value)}
          >
            <option value="ALL">Include Members</option>
            <option value="MEMBERS_ONLY">Members</option>
            <option value="EXCLUDE_MEMBERS">Non Members</option>
          </select>
        </div>
        {ruleType === "SALE" && (
          <>
            <ul
              class="
            flex flex-wrap
            mt-4
            text-xs
            sm:text-sm
            px-4
            py-2
            font-normal
            rounded-2xl
            text-center text-gray-500
            overflow-x-auto
            bg-gray-100 max-w-fit w-full
          "
            >
              <span
                className={`
              py-2
              
              sm:py-2
              flex
              items-center
              justify-center
              capitalize
              cursor-pointer
              text-base  ${
                isRecurring === true
                  ? "text-white hover:text-white bg-primary rounded-xl shadow-sm !px-3 sm:!px-6"
                  : "!text-gray-500 !px-2.5 sm:!px-4"
              }
            `}
                onClick={() => setIsRecurring(true)}
              >
                Recurring
              </span>

              <span
                className={`
              py-2
              
              sm:py-2
              flex
              items-center
              justify-center
              capitalize
              cursor-pointer
              text-base  ${
                isRecurring === false
                  ? "text-white hover:text-white bg-primary rounded-xl shadow-sm !px-3 sm:!px-6"
                  : "!text-gray-500 !px-2.5 sm:!px-4"
              }
            `}
                onClick={() => setIsRecurring(false)}
              >
                One Time
              </span>
            </ul>

            {!isRecurring && (
              <>
                {" "}
                <div className="py-2 ">
                  <label className="block">Start date</label>
                  <div className="relative">
                    <DatePicker
                      selected={saleStartDate}
                      onChange={(e) => setSaleStartDate(e)}
                      dateFormat="yyyy/MM/dd"
                      className=" w-full mt-0.5 rounded-xl px-3 h-10 border border-gray-600"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 absolute right-2 top-2.5 pointer-events-none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="py-2 ">
                  <label className="block">End date</label>
                  <div className="relative">
                    <DatePicker
                      selected={saleEndDate}
                      onChange={(e) => setSaleEndDate(e)}
                      minDate={saleStartDate}
                      dateFormat="yyyy/MM/dd"
                      className=" w-full mt-0.5 rounded-xl px-3 h-10 border border-gray-600"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 absolute right-2 top-2.5 z-0 pointer-events-none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>
                </div>
              </>
            )}
            {isRecurring === true && (
              <div className="py-2">
                <label className="text-lg">Select week days</label>
                <div
                  id="days-dropdown"
                  className="w-full rounded-xl border border-gray-600 mt-1"
                >
                  <Dropdown>
                    <Dropdown.Button light>
                      {daysOfWeek.map((day) => day.slice(0, 3)).join(", ") ||
                        "Select week days"}
                    </Dropdown.Button>
                    <Dropdown.Menu
                      selectionMode="multiple"
                      disallowEmptySelection
                      selectedKeys={daysOfWeek}
                      onSelectionChange={(keys) => {
                        const selectedKeys = Array.from(keys);
                        setDaysOfWeek(selectedKeys);
                      }}
                    >
                      {days.map((day, index) => (
                        <Dropdown.Item key={day}>{day}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            )}
          </>
        )}

        <div className="py-2 mt-4 max-w-fit mx-auto">
          <h3 className="text-lg text-center">Price adjustment</h3>
          <div className="py-2 flex items-center">
            <input
              value={adjustPriceBy}
              className=" mt-1 w-16 rounded-xl px-3 py-2 border border-gray-600 mr-2"
              max="99"
              type="Number"
              onChange={(e) => setAdjustPriceBy(e.target.value)}
            />
            <label className="text-lg min-w-fit">% off</label>
            {ruleType === "STANDARD" && (
              <select
                value={cycle}
                className="w-full max-w-[8rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2"
                onChange={(e) => setCycle(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weely">Bi Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>
        </div>

        <div className="py-2 flex justify-between items-center">
          <label className="text-lg min-w-fit">Round to</label>

          <select
            value={roundTo}
            className="w-full max-w-[12rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2"
            onChange={(e) => setRoundTo(e.target.value)}
          >
            <option value="0.0">$0.00</option>
            <option value="0.5">$0.50</option>
            <option value="0.9">$0.99</option>
          </select>
        </div>
        <div className="py-2 flex justify-between items-center">
          <label className="text-lg min-w-fit">Floor price</label>

          <input
            value={floorPrice}
            className="w-full max-w-[12rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2"
            type="number"
            onChange={(e) => setFloorPrice(e.target.value)}
          />
        </div>

        <ButtonComponent
          full
          loading={isLoading}
          onClick={() => onStart()}
          className={`mt-8 mx-auto !w-64 rounded-lg !text-black`}
        >
          Start
        </ButtonComponent>
      </div>
    </div>
  );
};

export default RePricer;
