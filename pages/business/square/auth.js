import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SquareAuth = () => {
  const router = useRouter();

  const exchangeTokens = async (code) => {
    const response = await fetch("/api/business/square/exchangeSquareToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      router.push("https://fashionpal.app/business/profile");
    }
  };

  useEffect(() => {
    if (router.query.state) {
      const storedState = sessionStorage.getItem("squareStateCode");
      if (storedState === router.query.state) {
        sessionStorage.removeItem("squareStateCode");
        if (router.query.code) {
          exchangeTokens(router.query.code);
        }
      }
    }
  }, [router.query]);
  return (
    <div>
      <h6>Authenticating...</h6>
    </div>
  );
};

export default SquareAuth;
