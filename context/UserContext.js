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

  // Function to update user's username
  const updateUserUsername = (newUsername) => {
    setUser((prevUser) => ({
      ...prevUser,
      consumer: {
        ...prevUser.consumer,
        username: newUsername,
      },
    }));
  };

  // Function to fetch user data from the server
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
        console.error("Error fetching user data");
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

  // Function to fetch business data for a business user
  const fetchBusinessData = async () => {
    try {
      const res = await fetch("/api/business/getData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session.user.email),
      });

      if (!res.ok) {
        console.error("Error fetching business data");
        return;
      }

      // Do something with the business data if needed
      // const data = await res.json();

      // Update the user state if necessary
      setUser((prevUser) => ({
        ...prevUser,
      }));
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

  // useEffect to handle user-related logic on component mount and updates
  useEffect(() => {
    const handler = async () => {
      if (router.query.authenticating) {
        setUserDataFetched(true); // Set to true even on error to prevent infinite loadin
        return;
      }

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

        // If the user is not yet onboarded
        if (user && !user.onboardingComplete) {
          if (router.pathname === "/auth/onboarding") {
            return;
          }
          // Define allowed routes based on the user role
          const allowedRoutes = ACCESS_RULES.business || [];

          // Define the route object for redirection
          const route = {
            pathname: "/auth/onboarding",
          };

          // Determine the proper redirect URL for onboarding
          if (
            router.query &&
            router.query.redirectUrl &&
            router.query.redirectUrl !== "/auth/onboarding" &&
            allowedRoutes.find((route) => router.query.redirectUrl === route)
          ) {
            // If conditions are met, set the redirectUrl in the route's query parameters
            route.query = {};
            route.query.redirectUrl = router.query.redirectUrl;
          } else if (
            // If no valid redirectUrl in query parameters, check if the current route is allowed
            router.asPath !== "/auth/onboarding" &&
            allowedRoutes.find((route) => router.asPath === route)
          ) {
            // If the current route is allowed, set it as the redirectUrl
            route.query = {};
            route.query.redirectUrl = router.pathname;
          }

          // Redirect the user to the determined route
          router.push(route);
        }

        // Determine the user role
        const role = user?.consumer
          ? "consumer"
          : user?.business
          ? "business"
          : null;

        const allowedRoutes = ACCESS_RULES[role] || [];

        // Check if the user role is defined and the router pathname is not in allowedRoutes
        if (role && !allowedRoutes.find((route) => router.pathname === route)) {
          // Redirect the user to the first allowed route if not on the "/auth" page
          if (
            !router.query.redirectUrl ||
            router.pathname !== "/auth" ||
            (router.pathname === "/auth" &&
              router.query.redirectUrl &&
              !allowedRoutes.find(
                (route) => router.query.redirectUrl === route
              ))
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
    };
    handler();
  }, [session, user?.onboardingComplete, router.pathname]);

  // Provide the user context to the components
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
