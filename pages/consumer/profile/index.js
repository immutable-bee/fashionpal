import { useState } from "react";
import HeaderComponent from "@/components/utility/Header";
import SubscriptionModal from "@/components/scoped/SubscriptionModal";
import ButtonComponent from "@/components/utility/Button";
// import { useUser } from "@/context/UserContext";
import { signOut } from "next-auth/react";
const ProfileComponent = ({}) => {
  const [user, setUser] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(user);

    // try {
    //   await fetch("/api/business/updateData", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email: user.email, data: formData }),
    //   });
    //   fetchUserData();
    // } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
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
              />
            </div>
            <div className="py-2">
              <label className="text-sm text-gray-700">Email</label>
              <input
                name="email"
                type="text"
                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                onChange={handleChange}
              />
            </div>

            <ButtonComponent
              rounded
              full
              type="submit"
            >
              Update
            </ButtonComponent>

            <div className="sm:flex flex-wrap justify-center sm:justify-start mt-8 items-center">
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
