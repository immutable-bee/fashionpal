import { useEffect, useState } from "react";
import AuthContainer from "./AuthContainer";
import { Button, Loading, Input } from "@nextui-org/react";
import OnboardingForm from "../OnboardingForm";
import { useRouter } from "next/router";

const OnboardingContainer = () => {
  const { user } = {};
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [userType, setUserType] = useState("consumer");
  const [username, setUsername] = useState("");

  const handleConsumerOnboard = () => {
    setUserType("consumer");
  };

  const handleBusinessOnboard = () => {
    setUserType("business");
  };

  const loadingHandler = (value) => {
    setLoading(value);
  };

  const isCompleteHandler = () => {
    setIsOnboardingCompleted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/onboarding/consumer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(username),
      });

      if (!res.ok) {
        throw new Error("Failed to onboard user");
      }

      const data = await res.json();
      setLoading(false);
      setIsOnboardingCompleted(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(1);
    console.log(user);
    if (user) {
      console.log(1);
      console.log(isOnboardingCompleted);
      console.log(user);
      console.log(userType);
      if (isOnboardingCompleted || user.onboardingComplete) {
        console.log(1);
        if (userType === "consumer" || user.consumer) {
          console.log(1);
          setTimeout(() => {
            const route = {
              pathname: "/consumer",
            };
            if (router.query && router.query.redirectUrl) {
              route.pathname = router.query.redirectUrl;
            } else if (router.query && router.query.callbackUrl) {
              const callbackUrl = router.query.callbackUrl;
              const redirectUrlParam = callbackUrl.split("redirectUrl=")[1];

              if (redirectUrlParam) {
                // Decode the URL-encoded value
                route.pathname = decodeURIComponent(redirectUrlParam);
              }
            }
            console.log(route);
            router.push(route);
          }, [10000]);
        }

        if (userType === "business" || user.business) {
          setTimeout(() => {
            const route = {
              pathname: "/business",
            };
            if (router.query && router.query.redirectUrl) {
              route.pathname = router.query.redirectUrl;
            } else if (router.query && router.query.callbackUrl) {
              const callbackUrl = router.query.callbackUrl;
              const redirectUrlParam = callbackUrl.split("redirectUrl=")[1];

              if (redirectUrlParam) {
                // Decode the URL-encoded value
                route.pathname = decodeURIComponent(redirectUrlParam);
              }
            }
            console.log(route);
            router.push(route);
          }, [10000]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnboardingCompleted, userType, user]);

  const onEnter = () => {
    const route = {
      pathname: userType === "consumer" ? "/consumer" : "/business",
    };
    console.log(router);
    if (router.query && router.query.redirectUrl) {
      route.pathname = router.query.redirectUrl;
    } else if (router.query && router.query.callbackUrl) {
      const callbackUrl = router.query.callbackUrl;
      const redirectUrlParam = callbackUrl.split("redirectUrl=")[1];

      if (redirectUrlParam) {
        // Decode the URL-encoded value
        route.pathname = decodeURIComponent(redirectUrlParam);
      }
    }
    console.log(route);
    router.push(route);
  };

  return (
    <AuthContainer
      content={
        <div className="auth-content-container pb-8">
          <h2 className="pb-2 text-2xl font-medium text-center border-b border-black border-dashed">
            Onboarding Form
          </h2>

          {loading ? (
            <div className="mt-5 py-10 flex justify-center">
              <Loading size="xl" />
            </div>
          ) : !userType ? (
            <>
              <h2 className="pt-5 text-lg font-medium text-center">
                To get started please verify your account type.
              </h2>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleBusinessOnboard}
                  className=" text-white w-4/5 py-5 my-10 border border-black bg-blbBlue rounded"
                >
                  Business
                </button>
                <button
                  onClick={handleConsumerOnboard}
                  className="text-white w-4/5 py-5 my-5 border border-black bg-biblioGreen rounded"
                >
                  Consumer
                </button>
              </div>
            </>
          ) : userType === "consumer" && !isOnboardingCompleted ? (
            <div>
              <h2 className="pt-5 text-lg font-medium text-center">
                Please enter a username below.
              </h2>
              <form
                className="flex flex-col items-center mt-6"
                onSubmit={handleSubmit}
              >
                <Input
                  required={true}
                  onChange={handleChange}
                  className="onboard-fields my-2"
                  placeholder="Username"
                  name="username"
                />
                <Button
                  className="mt-5"
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </div>
          ) : userType === "business" && !isOnboardingCompleted ? (
            <OnboardingForm
              loadingHandler={loadingHandler}
              isCompleteHandler={isCompleteHandler}
            />
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="pt-5 text-lg font-medium text-center">
                Your account has been confirmed! You can now start using
                FashionPal. You will be redirected in 10 seconds or you can
                click the button below to enter FashionPal
              </h2>

              <Button
                className="mt-5"
                type="button"
                onClick={() => onEnter()}
              >
                Enter FashionPal
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
};

export default OnboardingContainer;
