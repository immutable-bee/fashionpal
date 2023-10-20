import React, { useState } from "react";
import TooltipComponent from "@/components/utility/Tooltip";
import Head from "next/head";
import PricingComponent from "@/components/scoped/Pricing";
import HeaderComponent from "@/components/utility/Header";
import { signOut } from "next-auth/react";
import StoresModal from "@/components/scoped/StoresModal";
import { useUser } from "../../../context/UserContext";
import UsernameInput from "../../../components/consumer/profile/UsernameInput";
import Alerts from "../../../components/consumer/profile/Alerts";
import AlertPreferences from "../../../components/consumer/profile/AlertPreferences";

const Profilecomponent = () => {
  // const { user, updateUserUsername, fetchUserData } = useUser();
  const { user, updateUserUsername, fetchUserData } = {}
  const [storeModalOpen, setStoreModalOpen] = useState(false)

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <link rel="shortcut icon" href="/images/fav.png" />
      </Head>

      <div>
        <HeaderComponent />

        {storeModalOpen ?
          <StoresModal
            open={storeModalOpen}
            onClose={() => setStoreModalOpen(false)}
          /> : ''}

        <section className="px-5 ">
          <div className="max-w-xl mx-auto">

            <UsernameInput
              props={{
                email: user?.email,
                username: user?.consumer.username ? user.consumer.username : "",
              }}
              onUsernameUpdate={updateUserUsername}
            />

            <div className="mt-3">
              <h3 className="text-lg font-medium">Stores following: 78</h3>


              <button onClick={() => setStoreModalOpen(true)} className="bg-primary mt-3 text-white px-5 py-1.5 rounded-lg">View store</button>

            </div>
            <AlertPreferences
              props={{
                emailAlertsOn: user?.consumer.email_alerts_on,
                alertsPaused: user?.consumer.alerts_paused,
                email: user?.email,
              }}
            />


          </div>
        </section>
      </div>
    </div>
  );
};
export default Profilecomponent;
