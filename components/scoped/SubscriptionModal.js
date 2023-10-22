import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ButtonComponent from "@/components/utility/Button";
import CheckboxComponent from "@/components/utility/Checkbox";
import LoadingComponent from "@/components/utility/loading";
import ModalComponent from "@/components/utility/Modal";
const SubscriptionModal = (props) => {
  const [useDefaultPayment, setUseDefaultPayment] = useState(true);
  const [userHasDefault, setUserHasDefault] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState();
  const [nationalPlan, setNationalPlan] = useState(false);
  const [yearlyPlan, setYearlyPlan] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState("");

  // Handle server-side subscription creation

  return (
    <ModalComponent
      open={props.isSubscriptionModalOpen}
      title="Subscribe"
      width="500px"
      onClose={props.closeSubscriptionModal}
    >
      <form id="stripe-subscription-form">
        <div
          id="subscription-options-details"
          className="flex"
        >
          <div
            id="sliders-container"
            className=" w-32 flex-shrink-0"
          >
            <label
              id="sliders-plan"
              className="relative mx-2 my-2 inline-flex items-center cursor-pointer"
            >
              <input
                className="react-switch-checkbox sr-only peer"
                id={`react-switch-plan`}
                type="checkbox"
                checked={nationalPlan}
                onChange={() => setNationalPlan(!nationalPlan)}
              />
              <div class="w-11 relative h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <div className="slider-options ml-3">
                <h6 id="slider-state">State</h6>
                <h6 id="slider-national">National</h6>
              </div>
            </label>
            <label
              id="sliders-duration"
              className="relative my-2 mx-2 inline-flex items-center cursor-pointer"
            >
              <div class="w-11 relative h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <div className="slider-options ml-3"></div>
            </label>
          </div>
        </div>
      </form>
    </ModalComponent>
  );
};

export default SubscriptionModal;
