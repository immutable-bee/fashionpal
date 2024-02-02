import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import ShareProduct from "@/components/consumer/ShareProduct";
export default function CustomerFilters({ changeStore, changeChance }) {
  const [chance, setChance] = useState("");
  const [store, setStore] = useState("");

  const onChangeStoreName = (e) => {
    const value = e.target.value;
    setStore(value);
    changeStore(value);
  };
  const onChangeChance = (e) => {
    const value = e.target.value;
    setChance(value);
    changeChance(value);
  };

  return (
    <div>
      <ShareProduct />
      <ul className=" mt-2 flex flex-wrap sm:justify-center sm:items-center sm:ml-2">
        <div className="px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 ">
          <label className="block">Store</label>
          <select
            className="sm:w-56 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            onChange={(e) => onChangeStoreName(e)}
          >
            <option value="">All</option>
            <option value="Clothing">Clothing</option>
            <option value="Footwear">Footwear</option>
            <option value="Hats">Hats</option>
          </select>
        </div>

        <div className={`px-2 w-[50%] sm:w-auto sm:mt-0 mt-3`}>
          <label className="block">% chance</label>
          <input
            className="sm:w-56 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
            type="number"
            onChange={(e) => onChangeChance(e)}
          />
        </div>
      </ul>
    </div>
  );
}
