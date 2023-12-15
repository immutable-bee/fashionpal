import dynamic from "next/dynamic";
import { useState } from "react";

// Import the chart component using dynamic import
const ItemLinkedSoldChart = dynamic(
  () => import("@/components/scoped/ItemLinkedSoldChart"),
  { ssr: false }
);
const ALPASPChart = dynamic(() => import("@/components/scoped/ALPASPChart"), {
  ssr: false,
});
const RevenueChart = dynamic(() => import("@/components/scoped/RevenueChart"), {
  ssr: false,
});
const AVGDayListedChart = dynamic(
  () => import("@/components/scoped/AVGDayListedChart"),
  { ssr: false }
);
const DonationAcceptedChart = dynamic(
  () => import("@/components/scoped/DonationAcceptedChart"),
  { ssr: false }
);

const RePricer = ({ onBack }) => {
  const [ruleName, setRuleName] = useState("");
  const [category, setCategory] = useState("");
  const [week, setWeek] = useState("");

  return (
    <div className=" max-w-3xl mx-auto">
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
      <div>
        <div className="sm:w-96 mx-auto">
          <div className="py-2">
            <label className="text-lg">Rule name</label>
            <input
              value={ruleName}
              className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
              onChange={(e) => setRuleName(e.target.value)}
            />
          </div>
          <h2 className="text-xl mt-1 text-center">Or</h2>
          <div className="pb-2">
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
            <label className="text-lg">Week</label>
            <select
              value={week}
              className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
              onChange={(e) => setWeek(e.target.value)}
            >
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
              <option value="4">4th</option>
            </select>
          </div>
        </div>

        <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
          <h3 className="text-xl text-center">Items Listed and Items Sold</h3>
          <ItemLinkedSoldChart />
        </div>
        <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
          <h3 className="text-xl text-center">ALP and ASP</h3>
          <ALPASPChart />
        </div>
        <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
          <h3 className="text-xl text-center">Donations and Accepted</h3>
          <DonationAcceptedChart />
        </div>
        <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
          <h3 className="text-xl text-center">AVG Days Listed</h3>
          <AVGDayListedChart />
        </div>
        <div className="max-w-fit rounded-lg border shadow pt-3 mx-auto mt-5">
          <h3 className="text-xl text-center">Revenue</h3>
          <RevenueChart />
        </div>
      </div>
    </div>
  );
};

export default RePricer;
