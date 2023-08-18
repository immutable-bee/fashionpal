import React, { useState } from "react";
import TooltipComponent from "@/components/utility/Tooltip";
import Head from "next/head";
import PricingComponent from "@/components/scoped/Pricing";
import HeaderComponent from "@/components/utility/Header";
import { signOut } from "next-auth/react";
import { useUser } from "../../../context/UserContext";
import UsernameInput from "../../../components/customer/profile/UsernameInput";
import Alerts from "../../../components/customer/profile/Alerts";
import AlertPreferences from "../../../components/customer/profile/AlertPreferences";

const Profilecomponent = () => {
  // const { user, updateUserUsername, fetchUserData } = useUser();
  const { user, updateUserUsername, fetchUserData } = {}

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <link rel="shortcut icon" href="/images/fav.png" />
      </Head>

      <div>
        <HeaderComponent />

        <section className="px-5 ">
          <div className="max-w-xl mx-auto">
            <UsernameInput
              props={{
                email: user?.email,
                username: user?.consumer.username ? user.consumer.username : "",
              }}
              onUsernameUpdate={updateUserUsername}
            />
            <AlertPreferences
              props={{
                emailAlertsOn: user?.consumer.email_alerts_on,
                alertsPaused: user?.consumer.alerts_paused,
                email: user?.email,
              }}
            />
            <div>
              <h3 className="text-xl mt-2 sm:mt-7 font-medium">Book Alerts</h3>
            </div>

            <Alerts
              props={{
                email: user?.email,
                titles: user?.consumer.tracked_titles,
                authors: user?.consumer.tracked_authors,
                zipCodes: user?.consumer.tracked_zips,
              }}
              fetchUserData={fetchUserData}
            />

            <div className="flex justify-center items-center mt-5">
              <h3 class="text-xl font-medium mr-3">Total alerts</h3>
              <input
                type="number"
                value={
                  user?.consumer.paid_alerts ? user.consumer.paid_alerts : ""
                }
                className="px-3 py-3 w-32 rounded-xl border-2 border-gray-500"
                disabled
              />
            </div>

            {/* <h3 className='text-xl mt-5 sm:mt-12 font-medium'>Subscription Plan</h3> */}
            <PricingComponent />

            <div className="flex justify-center pb-20 mt-5">
              <button
                onClick={() => signOut()}
                className="px-10 py-3 bg-blbBlue rounded text-white border border-black"
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Profilecomponent;
