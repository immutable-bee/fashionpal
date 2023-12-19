import { useState, useCallback, useEffect } from "react";
import ButtonComponent from "@/components/utility/Button";
import Slider from "rc-slider";
import Loading from "@/components/utility/loading";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import "rc-slider/assets/index.css";

const RePricer = ({ onBack }) => {
  const [loadingListings, setLoadingListings] = useState(false);

  const [isEditing, setIsEditing] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  // edit
  const [ruleId, setRuleId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("All");
  const [listingType, setListingType] = useState("");
  const [isWeekly, setIsWeekly] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [adjustPriceBy, setAdjustPriceBy] = useState(0);
  const [cycle, setCycle] = useState("weekly");
  const [roundTo, setRoundTo] = useState("0.50");
  const [floorPrice, setFloorPrice] = useState(0);

  const [rules, setRules] = useState([]);

  const [isLoading, setIsLoading] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoadingListings(true);

    try {
      const res = await fetch(
        `/api/pricing-rules/list?searchText=${searchText}&category=${filterCategory}&type=${filterType}`
      );

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setRules(data);
      } else {
        const errorMessage = await res.text();
        console.error(
          `Fetch failed with status: ${res.status}, message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching listings:", error);
    } finally {
      setLoadingListings(false);
    }
  }, [searchText, filterCategory, filterType]);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchListings();
    };
    initialFetch();
  }, [filterCategory, filterType, fetchListings]);

  const onEditRule = (rule) => {
    setIsEditing(true);

    setRuleId(rule.id);
    setSearchText(rule.searchText);
    setFilterCategory(rule.filterCategory);
    setFilterType(rule.filterType);
    setName(rule.name);
    setCategory(rule.category);
    setListingType(rule.listingType);
    setIsWeekly(rule.isWeekly);
    setIsMonthly(rule.isMonthly);
    setAdjustPriceBy(rule.adjustPriceBy);
    setCycle(rule.cycle);
    setRoundTo(rule.roundTo);
    setFloorPrice(rule.floorPrice);
  };

  const onDone = () => {
    if (!name) {
      NotificationManager.error("Rule is required!");
    }
    setIsLoading(true);
    const data = {
      id: ruleId,
      name: name,
      category: category,
      listingType: listingType,
      isWeekly: isWeekly,
      isMonthly: isMonthly,
      adjustPriceBy: adjustPriceBy,
      cycle: cycle,
      roundTo: roundTo,
      floorPrice: floorPrice,
    };

    axios
      .put("/api/pricing-rules/update", data)
      .then(() => {
        console.log("then");
        setIsLoading(false);
        setIsEditing(false);
        NotificationManager.success("Rule added successfully!");
        fetchListings();
      })
      .catch((error) => {
        console.log("error");
        setIsLoading(false);

        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          NotificationManager.error(error.response.data.message);
        } else {
          // Handle error here

          NotificationManager.error("Error adding pricing rule:", error);
        }
      });
  };

  return (
    <div>
      <div className="sm:w-96 mx-auto">
        {!isEditing ? (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
              onClick={() => onBack()}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <div className="py-2">
              <input
                value={searchText}
                placeholder="Search..."
                className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="py-2">
                <label className="text-lg">Category</label>
                <select
                  value={filterCategory}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Hats">Hats</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>
              <div className="py-2">
                <label className="text-lg">Type</label>
                <select
                  value={filterType}
                  className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="only">Premium only</option>
                  <option value="exclude">Exclude premium</option>
                  <option value="include">Include premium</option>
                </select>
              </div>
            </div>

            <div className="w-full">
              {loadingListings ? (
                <div className="sm:flex justify-center pb-10">
                  <div>
                    <div className="pt-2.5 mt-10">
                      <Loading size="xl" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-medium mt-3">Rules</h3>
                  {rules.map((rule, key) => (
                    <div
                      className="bg-white flex justify-between items-center rounded-xl shadow border my-2 py-2 px-3"
                      key={key}
                    >
                      <h3>{rule.name}</h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4 cursor-pointer hover:text-gray-700"
                        onClick={() => onEditRule(rule)}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
              <label className="text-lg">Category</label>
              <select
                value={category}
                className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="Clothing">Clothing</option>
                <option value="Footwear">Footwear</option>
                <option value="Hats">Hats</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
            <div className="py-2">
              <label className="text-lg">Premium</label>
              <select
                value={listingType}
                className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
                onChange={(e) => setListingType(e.target.value)}
              >
                <option value="only">Premium only</option>
                <option value="exclude">Exclude premium</option>
                <option value="include">Include premium</option>
              </select>
            </div>
            <div className="py-2">
              <label className="text-lg">Max shelf life</label>
              <label className="relative flex items-center cursor-pointer mt-3">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isWeekly}
                  onChange={() => setIsWeekly(!isWeekly)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E44A1F]"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Weekly
                </span>
              </label>
              <label className="relative flex items-center cursor-pointer mt-3">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isMonthly}
                  onChange={() => setIsMonthly(!isMonthly)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E44A1F]"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Monthly
                </span>
              </label>
            </div>

            <div className="mt-4">
              <Slider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                renderThumb={(props, state) => (
                  <div {...props}>{state.valueNow}</div>
                )}
              />
            </div>

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
                <label className="text-lg min-w-fit">% off year</label>

                <select
                  value={cycle}
                  className="w-full max-w-[8rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2"
                  onChange={(e) => setCycle(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weely">Bi Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="py-2 flex justify-between items-center">
              <label className="text-lg min-w-fit">Round to</label>

              <select
                value={roundTo}
                className="w-full max-w-[12rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2"
                onChange={(e) => setRoundTo(e.target.value)}
              >
                <option value="0.00">$0.00</option>
                <option value="0.50">$0.50</option>
                <option value="0.90">$0.99</option>
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
              onClick={() => onDone()}
              className={`mt-8 mx-auto !w-64 rounded-lg !text-black`}
            >
              Done
            </ButtonComponent>
          </div>
        )}
      </div>
    </div>
  );
};

export default RePricer;
