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
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!session && router.pathname !== "/") {
      router.push("/auth");
    }

    if (session) {
      fetchUserData();

      if (user && !user.onboardingComplete) {
        router.push("/auth/onboarding");
      }

      const role = user?.consumer
        ? "consumer"
        : user?.business
        ? "business"
        : null;
      const allowedRoutes = ACCESS_RULES[role] || [];

      if (role && !allowedRoutes.includes(router.pathname)) {
        router.push(allowedRoutes[0]);
      }
    }
  }, [session, user?.onboardingComplete, router.pathname]);

  return (
    <UserContext.Provider value={{ user, updateUserUsername, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
