import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import nprogress from "nprogress";
import Loading from "@/components/utility/loading";
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const ACCESS_RULES = {
  consumer: [
    "/consumer",
    "/consumer/profile",
    "/consumer/saved",
    "/consumer/sales",
  ],
  business: [
    "/business",
    "/business/sales",
    "/business/profile",
    "/business/listing-queue",
    "/business/dashboard",
  ],
};

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const isInitialRender = useRef(true);
  const [userDataFetched, setUserDataFetched] = useState(false);

  const updateUserUsername = (newUsername) => {
    setUser((prevUser) => ({
      ...prevUser,
      consumer: {
        ...prevUser.consumer,
        username: newUsername,
      },
    }));
  };

  const fetchUserData = async () => {
    if (!session) return;

    try {
      nprogress.start(); // Start the loading indicator

      const res = await fetch("/api/user/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session.user.email),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setUser(data);

      if (data?.business) {
        fetchBusinessData();
      }
    } finally {
      nprogress.done(); // Stop the loading indicator
    }
  };

  const fetchBusinessData = async () => {
    const res = await fetch("/api/business/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session.user.email),
    });

    if (!res.ok) {
      return;
    }

    // Do something with the business data if needed
    // const data = await res.json();

    setUser((prevUser) => ({
      ...prevUser,
    }));
  };

  useEffect(() => {

    if (router.query.authenticating) {
      setUserDataFetched(true); // Set to true even on error to prevent infinite loadin
      return;
    }
    console.log(router);
    if (router.pathname === "/scan/[type.js]/[id]") {
      setUserDataFetched(true); // Set to true even on error to prevent infinite loadin
      return;
    }
    // Skip logic on initial render and if on error page
    if (router.asPath !== "/" && router.pathname === "/404") {
      setUserDataFetched(true); // Set to true even on error to prevent infinite loadin
      return;
    }
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // If not logged in, not already on the "/auth" page, and not in the process of authentication
    console.log(2);
    console.log(session);
    console.log(router);

    if (!session && router.pathname !== "/auth") {
      // Redirect to "/auth" page with the current route's pathname and existing query parameters
      const route = {
        pathname: "/auth",
      };
      if (router.pathname !== "/") {
        route.query = {};
        route.query = {
          redirectUrl: router.pathname,
        };
      }
      router.push(route);
    }

    if (session && router.pathname == "/") {
      router.push("/business");
    }

    // If the user is logged in
    if (session) {
      // Fetch user data, including business data if applicable
      // fetchUserData();
      fetchUserData()
        .then(() => setUserDataFetched(true))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserDataFetched(true); // Set to true even on error to prevent infinite loading
        });


      if (session) {
        await fetchUserData();
        if (user && !user.onboardingComplete) {
          router.push("/auth/onboarding");
        }


        // Redirect the user to the determined route
        router.push(route);
      }
      console.log(user);
      // Determine the user role
      const role = user?.consumer
        ? "consumer"
        : user?.business
        ? "business"
        : null;

      console.log(role);
      const allowedRoutes = ACCESS_RULES[role] || [];

      // Check if the user role is defined and the router pathname is not in allowedRoutes
      if (role && !allowedRoutes.find((route) => router.pathname === route)) {
        // Redirect the user to the first allowed route if not on the "/auth" page
        if (
          !router.query.redirectUrl ||
          router.pathname !== "/auth" ||
          (router.pathname === "/auth" &&
            router.query.redirectUrl &&
            !allowedRoutes.find((route) => router.query.redirectUrl === route))
        ) {
          // Redirect to the first allowed route
          router.push({
            pathname: allowedRoutes[0],
          });
        } else {
          // Redirect the user to the specified redirect URL
          router.push({
            pathname: router.query.redirectUrl,
          });
        }
      }
    } else {
      setUserDataFetched(true); // Set to true even on error to prevent infinite loadin
    }

  }, [session, user?.onboardingComplete, router.pathname]);

  return (
    <UserContext.Provider value={{ user, updateUserUsername, fetchUserData }}>
      {/* Conditionally render loading component until user data is fetched */}
      {!userDataFetched ? (
        <div className="h-screen w-full flex justify-center items-center">
          <Loading size="2xl" />
        </div>
      ) : (
        // Render the actual content when user data is fetched
        children
      )}
    </UserContext.Provider>
  );
};
