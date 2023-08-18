import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const ACCESS_RULES = {
  consumer: ["/consumer", "/consumer/profile", "/consumer/matches"],
  business: [
    "/business",
    "/business/profile",
    "/business/uploadlistings",
    "/business/uploadlistings/future",
  ],
};

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);

  const updateUserUsername = (newUsername) => {
    setUser({
      ...user,
      consumer: {
        ...user.consumer,
        username: newUsername,
      },
    });
  };

  const fetchUserData = async () => {
    if (!session) return;

    const res = await fetch("/api/fetchuser", {
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

    const data = await res.json();

    setUser((prevUser) => ({
      ...prevUser,
      booksale: data.book_sale,
    }));
  };

  useEffect(() => {
    if (session) {
      fetchUserData();
      if (user) {
        if (!user.onboarding_complete) {
          router.push("/auth/onboarding");
        }

        const role = user.consumer
          ? "consumer"
          : user.business
            ? "business"
            : null;
        const allowedRoutes = ACCESS_RULES[role] || [];

        if (role && !allowedRoutes.includes(router.pathname)) {
          router.push(allowedRoutes[0]);
        }
      }
    }
  }, [session, user?.onboarding_complete]);

  return (
    <UserContext.Provider value={{ user, updateUserUsername, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
