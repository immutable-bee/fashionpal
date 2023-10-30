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
const ProfileComponent = ({}) => {
  const { user, fetchUserData } = {};

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
    } catch (error) {}
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
          <form
            onSubmit={handleSubmit}
            className="mt-2 sm:mt-6"
          >
            <div className="py-2">
              <label className="text-sm text-gray-700">Username</label>
              <input
                name="store_name"
                type="text"
                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                onChange={handleChange}
                placeholder={
                  user?.business?.store_name ? user.business.store_name : ""
                }
              />
            </div>
            <div className="py-2">
              <label className="text-sm text-gray-700">Email</label>
              <input
                name="email"
                type="text"
                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                onChange={handleChange}
                placeholder={user?.business?.email ? user.business.email : ""}
              />
            </div>

            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center">
              <div class="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        Label
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4">
                        This months # of scans
                      </td>
                      <td class="px-6 py-4">10</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4">
                        {" "}
                        Most common category
                      </td>
                      <td class="px-6 py-4">10</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4"> # disposed</td>
                      <td class="px-6 py-4">10</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4"> # to sell</td>
                      <td class="px-6 py-4">10</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4"> % down voted10</td>
                      <td class="px-6 py-4">10</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="text-black px-6 py-4">% up voted</td>
                      <td class="px-6 py-4">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5">
              <ButtonComponent
                rounded
                full
                type="submit"
              >
                Update
              </ButtonComponent>
              <ButtonComponent
                className="my-7"
                color="secondary"
                rounded
                full
              >
                Connect venmo/paypal
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
