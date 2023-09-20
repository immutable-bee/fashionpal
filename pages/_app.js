import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    console.log("hello");
    console.log(router.pathname);
    // If the current path is '/', redirect to '/business'
    if (router.pathname === "/_error") {
      router.push("/business");
    }
  }, [router]);

  return (
    <>
      {" "}
      <Component {...pageProps} /> <NotificationContainer />
    </>
  );
}

export default App;
