import { useEffect } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "../context/UserContext";
import { NotificationContainer } from "react-notifications";
import HeaderComponent from "@/components/utility/BusinessHeader";
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

  // Define a computed property isBusinessPage
  const isBusinessPage = (() => {
    // Check if the current route path includes "/business"
    return router.pathname.includes("/business");
  })();

  return (
    <>
      <SessionProvider session={session}>
        <UserProvider>
          {isBusinessPage && <HeaderComponent />}
          <Component {...pageProps} />
          <NotificationContainer />
        </UserProvider>
      </SessionProvider>
    </>
  );
}

export default App;
