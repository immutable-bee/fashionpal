import { useState, useEffect } from "react";
import HeaderComponent from "@/components/utility/BusinessHeader";
import ManageSubscriptionModal from "@/components/scoped/ManageSubscriptionModal";
import SubscriptionModal from "@/components/scoped/SubscriptionModal";
import UnsubscribeModal from "@/components/scoped/UnsubscribeModal";
import ButtonComponent from "@/components/utility/Button";
import { useUser } from "@/context/UserContext";
import { signOut } from "next-auth/react";
import BusinessPricing from "@/components/business/profile/BusinessPricing";
import TooltipComponent from "@/components/utility/Tooltip";
import ResetInventoryModal from "@/components/modals/ResetInventory";
const ProfileComponent = ({ }) => {
  // const { user, fetchUserData } = useUser();
  const { user, fetchUserData } = {}

  const [formData, setFormData] = useState();
  const [activeRebateTiers, setActiveRebateTiers] = useState(1);
  const [isResetInventoryModalOpen, setIsResetInventoryModalOpen] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("/api/business/updateData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, data: formData }),
      });
      fetchUserData();
    } catch (error) { }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const manageSubscriptionModalHandler = () => {
    setIsManageSubscriptionModalOpen(!isManageSubscriptionModalOpen);
  };

  const handleSubscriptionModal = () => {
    // subscriptionStatus === "Not Subscribed"
    //     ?
    setIsSubscriptionModalOpen(!isSubscriptionModalOpen);
    // :
    // setIsManageSubscriptionModalOpen(!isManageSubscriptionModalOpen);
  };

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleUnsubscribe = async () => {
    try {
      setSubLoading(true);
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        setCancelMessage(data.message);
      } else {
        const errorData = await response.json();
        setCancelMessage(
          errorData.message ||
          "An error occurred while canceling the subscription"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setCancelMessage("An error occurred while canceling the subscription");
    } finally {
      setTimeout(() => {
        setSubLoading(false);
        setCancelMessage(null);
        closeUnsubModal();
        router.reload();
      }, 2500);
    }
  };
  const stepValue = (v) => Math.round(v * 10) / 10;

  const closeManageSubscriptionModalHandler = () => {

    setIsManageSubscriptionModalOpen(false);
  };

  const remainingCreditsHandler = () => {
    switch (user.business.membership) {
      case "FREE":
        return 250 - user.business.current_cycle_uploads;

      case "BASIC":
        return 1000 - user.business.current_cycle_uploads;

      case "PREMIUM":
        return 5000 - user.business.current_cycle_uploads;
    }
  };

  const openResetInventoryModal = () => {
    setIsResetInventoryModalOpen(true);
  };

  const closeResetInventoryModal = () => {
    setIsResetInventoryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white ">
      <HeaderComponent />
      <div className="h-full flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-whit px-4 sm:px-8 py-3 sm:py-6 rounded">
          <h1 className="text-lg sm:text-2xl font-medium text-center ">
            Profile Page
          </h1>
          <form onSubmit={handleSubmit} className="mt-2 sm:mt-6">
            <div className="py-2">
              <label className="text-sm text-gray-700">Store name</label>
              <input
                name="business_name"
                type="text"
                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                onChange={handleChange}
                placeholder={
                  user?.business?.business_name
                    ? user.business.business_name
                    : ""
                }
              />
            </div>
            <div className="py-2">
              <label className="text-sm text-gray-700">Store Type</label>
              <select
                name="type"
                value={user?.business?.type}
                className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-select border border-gray-500 w-full rounded-lg  px-3 my-1 py-2"
                onChange={handleChange}
              >
                <option value="THRIFT">Thrift</option>
                <option value="LIBRARY">Library</option>
                <option value="BOOKSTORE">Bookstore</option>
              </select>
            </div>

            <div className="py-2">
              <label className="text-sm text-gray-700">Street Address</label>
              <input
                name="business_street"
                type="text"
                className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                onChange={handleChange}
                placeholder={
                  user?.business?.business_street
                    ? user.business.business_street
                    : ""
                }
              />
            </div>
            <div className="py-2 mb-5">
              <label className="text-sm text-gray-700">URL</label>
              <input
                name="url"
                type="url"
                className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                onChange={handleChange}
                placeholder={user?.business?.url ? user.business.url : ""}
              />
            </div>

            <div className="mt-5">
              <ButtonComponent rounded full type="submit">
                Update
              </ButtonComponent>
            </div>

            <div className="flex justify-center w-full mt-5">
              <TooltipComponent
                tailwind="!w-full flex justify-center"
                width="max-w-lg"
                content={
                  "Delete all listings in your inventory. Also deletes any scheduled book sales"
                }
              >
                <button
                  onClick={openResetInventoryModal}
                  className="text-white text-sm px-8 py-2.5 bg-red-600 border border-black rounded-full"
                >
                  Reset Inventory
                </button>
              </TooltipComponent>
            </div>

            <ResetInventoryModal
              visible={isResetInventoryModalOpen}
              closeHandler={closeResetInventoryModal}
            />

            <div className="mt-8">
              <h6 className="mb-5 text-2xl font-bold text-center">
                Upload Credits
              </h6>
              <h6 className="mb-5 text-2xl font-medium text-center">
                Rebate Tiers
              </h6>

              <div className="flex justify-center gap-2">
                <div className={`bg-green-300   text-black font-medium w-16 h-10 flex items-center justify-center rounded-[0.95rem] border-4 border-black`}>
                  50
                </div>
                <div className={`bg-white  text-black font-medium w-16 h-10 flex items-center justify-center rounded-[0.95rem] border-4 border-black`}>
                  500
                </div>
                <div className={`bg-white  text-black font-medium w-16 h-10 flex items-center justify-center rounded-[0.95rem] border-4 border-black`}>
                  1000
                </div>
              </div>
              <div className="mt-10 mb-8">
                <div className="flex items-center justify-between my-3">
                  <h6 className="text-xl font-medium text-center">
                    Listed this cycle
                  </h6>
                  <div className=" ml-4 bg-white text-black font-medium w-16 h-10 flex items-center justify-center rounded-[0.95rem] border-4 border-black">
                    53
                  </div>
                </div>
                <div className="flex items-center justify-between my-3">
                  <h6 className="text-xl font-medium text-center">
                    Days left in cycle
                  </h6>
                  <div className=" ml-4 bg-white text-black font-medium w-16 h-10 flex items-center justify-center rounded-[0.95rem] border-4 border-black">
                    15
                  </div>
                </div>
                <div className="flex items-center justify-between my-3">
                  <h6 className="text-xl font-medium text-center">
                    Daily listing average
                    to meet next goal
                  </h6>
                  <div className=" ml-4 bg-white text-black font-medium w-16 h-10 flex items-center justify-center rounded-[0.95rem] border-4 border-black">
                    29
                  </div>
                </div>
              </div>

              <div className="sm:flex gap-5 sm:justify-center">
                <div className="flex sm:justify-center justify-between items-center mt-5">
                  <h3 class="text-xl font-medium mr-3">Membership</h3>
                  <input
                    type="number"
                    value={user?.business ? remainingCreditsHandler() : ""}
                    className="px-3 sm:py-3 py-2.5 w-32 rounded-xl border-2 border-gray-500 bg-white"
                    disabled
                  />
                </div>
                <div className="flex sm:justify-center justify-between items-center mt-5">
                  <h3 class="text-xl font-medium mr-3">Purchased</h3>
                  <input
                    type="number"
                    value={user?.business?.upload_credits}
                    className="px-3 sm:py-3 py-2.5 w-32 rounded-xl border-2 border-gray-500 bg-white"
                    disabled
                  />
                </div>
              </div>
            </div>

            <BusinessPricing />

            <ButtonComponent
              rounded
              full

              className="!my-1"
              id="manage-payment-btn"
            >
              Manage Payment Methods
            </ButtonComponent>
            <div className="">
              <ButtonComponent rounded full type="button">
                Manage Subscription
              </ButtonComponent>
            </div>
          </form>
          <div className="mt-4 w-full max-w-lg">
            <ButtonComponent
              full
              rounded

              onClick={() => signOut()}
            >
              Sign Out
            </ButtonComponent>
          </div>
        </div>
      </div>
      <SubscriptionModal isSubscriptionModalOpen={isSubscriptionModalOpen} />
    </div>
  );
};

export default ProfileComponent;
