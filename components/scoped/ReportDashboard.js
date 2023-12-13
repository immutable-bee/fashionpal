import { useState } from "react";
import ItemLinkedSoldChart from "@/components/scoped/ItemLinkedSoldChart";
import ALPASPChart from "@/components/scoped/ALPASPChart";
import RevenueChart from "@/components/scoped/RevenueChart";
import AVGDayListedChart from "@/components/scoped/AVGDayListedChart";
import DonationAcceptedChart from "@/components/scoped/DonationAcceptedChart";

const RePricer = () => {
  const [ruleName, setRuleName] = useState("");
  const [category, setCategory] = useState("");
  const [week, setWeek] = useState("");

  return (
    <div>
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
