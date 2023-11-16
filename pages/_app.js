import { useEffect } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "../context/UserContext";
import { NotificationContainer } from "react-notifications";
import "../styles/globals.css";
import "nprogress/nprogress.css";
import "react-notifications/lib/notifications.css";

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
