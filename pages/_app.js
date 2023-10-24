import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "../context/UserContext";

import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useEffect(() => {
    // If the current path is '/', redirect to '/business'
    if (router.pathname === "/_error") {
      router.push("/business");
    }
  }, [router]);

  return (
    <>
      <SessionProvider session={session}>
        <UserProvider>
          <Component {...pageProps} /> <NotificationContainer />
        </UserProvider>
      </SessionProvider>
    </>
  );
}

export default App;
