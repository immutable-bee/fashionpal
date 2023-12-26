import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import nprogress from "nprogress";

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
    "/scan",
  ],
};

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const isInitialRender = useRef(true);

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
    // if (router.pathname === "/_error") {
    if (router.asPath !== "/" && router.pathname === "/_error") {
      return;
    }
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // If not logged in, not already on the "/auth" page, and not in the process of authentication
    if (
      !session &&
      router.pathname !== "/auth" &&
      !router.query.authenticating
    ) {
      // Redirect to "/auth" page with the current route's pathname and existing query parameters
      console.log(1);
      router.push({
        pathname: "/auth",
        query: {
          redirectUrl: router.pathname,
        },
      });
    }

    if (session) {
      fetchUserData();

      const role = user?.consumer
        ? "consumer"
        : user?.business
        ? "business"
        : null;
      const allowedRoutes = ACCESS_RULES[role] || [];

      if (user && !user.onboardingComplete) {
        router.push("/auth/onboarding");
      }

      // if (user && !user.onboardingComplete) {
      //   console.log(router);
      //   console.log(
      //     !allowedRoutes.every((route) => router.asPath.includes(route))
      //   );
      //   console.log(1);
      //   const route = {
      //     pathname: "/auth/onboarding",
      //   };

      //   if (
      //     router.query &&
      //     router.query.redirectUrl &&
      //     router.query.redirectUrl !== "/auth/onboarding" &&
      //     router.query.redirectUrl !== "/_error" &&
      //     !allowedRoutes.every(
      //       (route) => !router.query.redirectUrl.includes(route)
      //     )
      //   ) {
      //     route.query = {};
      //     route.query.redirectUrl = router.query.redirectUrl;
      //   } else if (
      //     router.asPath !== "/auth/onboarding" &&
      //     router.pathname !== "/_error" &&
      //     !allowedRoutes.every((route) => !router.asPath.includes(route))
      //   ) {
      //     route.query = {};
      //     route.query.redirectUrl = router.pathname;
      //   }
      //   router.push(route);
      // }

      // Check if role is defined and router pathname is not in allowedRoutes
      if (
        role &&
        allowedRoutes.every((route) => !router.pathname.includes(route))
      ) {
        console.log(router.pathname === "/auth");
        console.log(router.query.redirectUrl);
        console.log(allowedRoutes);

        if (
          !router.query.redirectUrl ||
          router.pathname !== "/auth" ||
          (router.pathname === "/auth" &&
            router.query.redirectUrl &&
            allowedRoutes.every(
              (route) => !router.query.redirectUrl.includes(route)
            ))
        ) {
          router.push({
            pathname: allowedRoutes[0],
          });
        } else {
          router.push({
            pathname: router.query.redirectUrl,
          });
        }
      }
    }
  }, [session, user?.onboardingComplete, router.pathname]);

  return (
    <UserContext.Provider value={{ user, updateUserUsername, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
