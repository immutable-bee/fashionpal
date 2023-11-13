import Image from "next/image";
import PeopleSVG from "../assets/svg/people.svg";
import Logo from "../public/images/logo-vertical.jpg";
import { Button, Input, Loading } from "@nextui-org/react";
import { useMemo, useState } from "react";
import IconGoogle from "../assets/svg/icon-google.svg";
import { signIn } from "next-auth/react";
import IconEnvelope from "../assets/svg/icons_envelope.svg";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) return false;

    signIn("email", { email, redirect: false }).then(
      setTimeout(() => {
        setLoading(false);
        setIsLoginEmailSent(true);
      }, 2000)
    );
  };

  const handle0AuthSignIn = (provider) => () => signIn(provider);

  const validateEmail = (value) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
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
    <div className="sm:flex sm:px-3 min-h-screen bg-[#FEFBE8] onboarding-page-container">
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
                  <h6 className="self-center mt-4">Magic Sign In Link Sent!</h6>
                ) : loading ? (
                  <Loading className="self-center mt-4" />
                ) : (
                  <Button
                    id="login-btn"
                    className="w-full mt-5"
                    type="submit"
                  >
                    Continue with email
                  </Button>
                )}
              </form>
              <div class="relative py-4">
                <div
                  class="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div class="w-full border-t border-[#ffc71f]"></div>
                </div>
                <div class="relative flex justify-center text-sm font-medium leading-6">
                  <span class="bg-white font-medium px-6 text-gray-600">
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
                  className="social-provider-btn rounded-full !w-fill"
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
