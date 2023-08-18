import { useEffect, useState } from "react";
import {
  CircularInput,
  CircularTrack,
  CircularProgress,
  CircularThumb,
} from "react-circular-input";
import TooltipComponent from "../../utility/Tooltip";

const BusinessPricing = () => {
  const [membership, setMembership] = useState("free");

  const pricingData = [
    { price: [4.99, 4.49, 3.99], amount: 500 },
    { price: [9.99, 8.99, 7.99], amount: 1100 },
    { price: [19.99, 17.99, 15.99], amount: 2500 },
    { price: [34.99, 31.49, 27.99], amount: 5000 },
    { price: [49.99, 44.99, 39.99], amount: 8000 },
    { price: [99.99, 89.99, 79.99], amount: 20000 },
  ];

  const [value, setValue] = useState(0.0);
  //const stepValue = (v) => Math.round(v * 60) / 10;

  const stepValue = (v) => {
    if (v <= 0.16) {
      return 0;
    }

    if (v <= 0.32) {
      return 0.2;
    }

    if (v <= 0.48) {
      return 0.4;
    }

    if (v <= 0.64) {
      return 0.6;
    }

    if (v <= 0.8) {
      return 0.8;
    }

    if (v > 0.8) {
      return 1;
    }
  };

  useEffect(() => { }, [value]);

  const getIndex = () => {
    if (value === 0) {
      return 0;
    } else {
      return Math.round(value * 5);
    }
  };

  const getPriceIndex = () => {
    if (membership === "free") {
      return 0;
    }
    if (membership === "basic") {
      return 1;
    }
    if (membership === "premium") {
      return 2;
    }
  };

  const getAmount = () => {
    return pricingData[getIndex()]?.amount;
  };

  const getTotal = () => {
    return pricingData[getIndex()]?.price[getPriceIndex()];
  };

  const getEach = () => {
    const rawPrice =
      pricingData[getIndex()]?.price[getPriceIndex()] /
      pricingData[getIndex()]?.amount;
    return rawPrice ? rawPrice.toFixed(3) : null;
  };

  return (
    <div className="pb-4 sm:pb-8">
      <div className="flex items-center sm:mt-12 mb-4 mt-5">
        <h3 className="text-lg sm:text-2xl font-semibold">Buy More Upload Credits</h3>
        <TooltipComponent
          rounded
          placement="rightStart"
          width="sm:!w-64 !w-48"
          id="shipping-status-tooltip"
          css={{ zIndex: 10000 }}
          content={
            "Running low on upload credits? Top them off with a one time purchase. Basic plan members get 10% off and Premium plan members get 20% off."
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8 ml-3 cursor-pointer"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </TooltipComponent>
      </div>

      <div className="flex justify-center mt-7 mb-10">
        <input
          value={getAmount()}
          className="px-3 py-2 w-20 rounded-lg border-2 border-gray-500 text-center"
          disabled
        />
      </div>
      <div className="relative w-20 mx-auto">
        <div className="flex justify-center">
          <CircularInput
            value={stepValue(value)}
            onChange={(v) => setValue(stepValue(v))}
          >
            <CircularTrack />
            <CircularProgress />
            <CircularThumb />

            <text
              x={100}
              y={100}
              textAnchor="middle"
              dy="0.3em"
              fontWeight="bold"
            >
              {`$${getEach()} `}each
            </text>
          </CircularInput>
        </div>
      </div>
      <div className="flex justify-center mt-7 items-center">
        <h3 className="text-xl font-medium mr-3">Total</h3>
        <div className="border-4 rounded-full border-green-600 px-3 py-1">
          ${getTotal()}
        </div>
      </div>
      <div className="flex justify-center mt-7">
        <button
          className="sm:mx-2 duration-300 ease-in-out hover:bg-white font-bold border hover:border-green-600 bg-green-600 text-white px-12 hover:!text-green-600 py-3 mx-auto rounded-full"
          type="btn"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default BusinessPricing;
