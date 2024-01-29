import Image from "next/image";
import PeopleSVG from "../assets/people.svg";
import Logo from "../public/images/logo-vertical.jpg";
import { Button, Input, Loading } from "@nextui-org/react";
import { useMemo, useState } from "react";
import IconGoogle from "../assets/svg/icon-google.svg";
import { signIn } from "next-auth/react";
import IconEnvelope from "../assets/svg/icons_envelope.svg";
import ButtonComponent from "@/components/utility/Button";

const providers = [
  {
    name: "google",
    icon: IconGoogle,
  },
];

const SignIn = ({ props }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginEmailSent, setIsLoginEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      setLoading(false);
      return false;
    }

    try {
      await signIn("email", { email, redirect: false });

      setLoading(false);
      setIsLoginEmailSent(true);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setLoading(false);
    }
  };

  const handle0AuthSignIn = (provider) => async () => {
    try {
      await signIn(provider);
    } catch (error) {
      // Handle the error if needed
      console.error("Error during OAuth sign-in:", error);
    }
  };

  const validateEmail = (value) => {
    return value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
  };

  const helper = useMemo(() => {
    if (!email)
      return {
        text: "",
        color: "",
      };
    const isValid = validateEmail(email);
    return {
      text: isValid ? "Valid email" : "Enter a valid email",
      color: isValid ? "success" : "error",
    };
  }, [email]);

  return (
    <div className="sm:flex gap-3 sm:px-3 min-h-screen bg-[#FEFBE8] onboarding-page-container">
      <div
        className="sm:w-1/2 hidden sm:flex items-center justify-center"
        id="people-svg-container"
      >
        <Image
          id="people-svg"
          src={PeopleSVG}
          alt="People Networking"
          width={500}
          height={450}
        />
      </div>
      <div
        className="sm:w-1/2 flex items-center justify-center"
        id="auth-rect-container"
      >
        <div className="bg-white sm:pt-12 sm:pb-3 sm:border rounded-3xl sm:border-gray-700 min-h-screen sm:min-h-[auto] sm:block flex items-center sm:max-w-lg w-full mx-auto px-4 sm:px-12">
          <div className="w-full">
            <div
              id="logo-container"
              className="flex justify-center mb-4"
            >
              <Image
                src={Logo}
                alt="Logo"
                className="!w-56"
              />
            </div>

            <div className="auth-content-container">
              <h2 className="text-xl font-medium text-center">
                Welcome to FashionPal!
              </h2>
              <h2 className="pt-5 text-sm text-center">
                Get started by signing up/in below.
              </h2>
              <form
                id="login-form"
                className="mt-6 flex flex-col"
                onSubmit={handleSubmit}
              >
                <Input
                  required
                  className="w-full"
                  placeholder="Your Email"
                  id="email"
                  name="email"
                  type="email"
                  status={helper.color}
                  color={helper.color}
                  helperColor={helper.color}
                  helperText={helper.text}
                  contentLeft={
                    <Image
                      src={IconEnvelope}
                      alt="mail icon"
                      height="17"
                      width="17"
                      id="bmail-icon"
                    />
                  }
                  onChange={(e) => setEmail(e.target.value)}
                />
                {isLoginEmailSent ? (
                  <div className="bg-green-200 rounded-lg mt-5 py-3 px-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 flex-shrink-0 text-gray-600"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>

                    <div>
                      <h6 className="text-gray-700">
                        Magic Sign In link sent! Check your{" "}
                        <a
                          className="underline text-primary"
                          href="https://mail.google.com/"
                          target="_blank"
                        >
                          email
                        </a>
                      </h6>
                    </div>
                  </div>
                ) : (
                  // ) : loading ? (
                  //   <Loading className="self-center mt-4" />
                  <div className="mt-6">
                    <ButtonComponent
                      loading={loading}
                      full
                      rounded
                      type="submit"
                      disabled={!email || helper.color === "error"}
                    >
                      Continue with email
                    </ButtonComponent>
                  </div>
                  // <Button
                  //   id="login-btn"
                  //   disabled={!email || helper.color === "error"}
                  //   className="w-full mt-5"
                  //   type="submit"
                  // >
                  //   Continue with email
                  // </Button>
                )}
              </form>

              <div className="relative py-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-primary"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white font-medium px-6 text-gray-600">
                    Or
                  </span>
                </div>
              </div>
              <div
                id="social-auth-container"
                className="w-full flex justify-center"
              >
                <Button
                  size={""}
                  light
                  className="social-provider-btn rounded-full !w-fill "
                  onClick={handle0AuthSignIn(providers[0].name)}
                  icon={
                    <Image
                      className=""
                      src={providers[0].icon}
                      alt={`${providers[0].name} icon`}
                      width="30"
                      height="30"
                    />
                  }
                ></Button>
              </div>
              <p className="text-center pt-2 text-sm">
                You will be able to choose your account type after signup.
              </p>
              {/* Add terms of service */}
              <h6 className="text-xs text-center text-gray-500 mt-3"></h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
