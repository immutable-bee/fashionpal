import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import Slider from "rc-slider";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import "rc-slider/assets/index.css";

const RePricer = ({ onBack, categoryList }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("All");
  const [listingType, setListingType] = useState("ALL");
  const [isWeekly, setIsWeekly] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [adjustPriceBy, setAdjustPriceBy] = useState(0);
  const [cycle, setCycle] = useState("weekly");
  const [roundTo, setRoundTo] = useState("0.50");
  const [floorPrice, setFloorPrice] = useState(0);
  //
  const [isLoading, setIsLoading] = useState(0);

  const onStart = async () => {
    if (!name) {
      NotificationManager.error("Rule name is required!");
      return;
    }
    setIsLoading(true);
    const data = {
      name: name,
      categoryId: category,
      listingType: listingType,
      isWeekly: isWeekly,
      isMonthly: isMonthly,
      adjustPriceBy: adjustPriceBy,
      cycle: cycle,
      roundTo: roundTo,
      floorPrice: floorPrice,
    };
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
      console.log(error?.response?.data?.error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='sm:w-96 mx-auto'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer'
          onClick={() => onBack()}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.75 19.5L8.25 12l7.5-7.5'
          />
        </svg>
        <div className='py-2'>
          <label className='text-lg'>Rule name</label>
          <input
            value={name}
            className='w-full mt-1 rounded-xl px-3 py-2 border border-gray-600'
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='py-2'>
          <label className='text-lg'>Category</label>
          <select
            value={category}
            className='w-full mt-1 rounded-xl px-3 py-2 border border-gray-600'
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryList.length > 0 &&
              categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className='py-2'>
          <label className='text-lg'>Type</label>
          <select
            value={listingType}
            className='w-full mt-1 rounded-xl px-3 py-2 border border-gray-600'
            onChange={(e) => setListingType(e.target.value)}
          >
            <option value='ALL'>Include premium</option>
            <option value='PREMIUM_ONLY'>premium only</option>
            <option value='EXCLUDE_PREMIUM'>Exclude premium</option>
          </select>
        </div>

        <div className='py-2 mt-4 max-w-fit mx-auto'>
          <h3 className='text-lg text-center'>Price adjustment</h3>
          <div className='py-2 flex items-center'>
            <input
              value={adjustPriceBy}
              className=' mt-1 w-16 rounded-xl px-3 py-2 border border-gray-600 mr-2'
              max='99'
              type='Number'
              onChange={(e) => setAdjustPriceBy(e.target.value)}
            />
            <label className='text-lg min-w-fit'>% off</label>

            <select
              value={cycle}
              className='w-full max-w-[8rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2'
              onChange={(e) => setCycle(e.target.value)}
            >
              <option value='weekly'>Weekly</option>
              <option value='bi-weely'>Bi Weekly</option>
              <option value='monthly'>Monthly</option>
            </select>
          </div>
        </div>

        <div className='py-2 flex justify-between items-center'>
          <label className='text-lg min-w-fit'>Round to</label>

          <select
            value={roundTo}
            className='w-full max-w-[12rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2'
            onChange={(e) => setRoundTo(e.target.value)}
          >
            <option value='0.00'>$0.00</option>
            <option value='0.50'>$0.50</option>
            <option value='0.90'>$0.99</option>
          </select>
        </div>
        <div className='py-2 flex justify-between items-center'>
          <label className='text-lg min-w-fit'>Floor price</label>

          <input
            value={floorPrice}
            className='w-full max-w-[12rem] mt-1 rounded-xl px-3 py-2 border border-gray-600 ml-2'
            type='number'
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
