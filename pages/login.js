import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { NotificationManager } from "react-notifications";

function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailInPutError, setEmailInputError] = useState(false);
  const [passwordInPutError, setPasswordInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    validate();
  }, [email, password]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Server-side input validation
    if (!email || !password) {
      setError("Invalid inputs");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        // Update the callbackUrl to a valid URL
        callbackUrl: `${window.location.origin}/business`,
        redirect: false,
      });

      if (res?.ok) {
        // Successful authentication
        router.push("/business");
      } else {
        // Failed authentication
        setError("Failed! Check your input and try again.");
        NotificationManager.error("Failed! Check your input and try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      NotificationManager.error("An error occurred. Please try again later.");
    }
  }

  function validateEmail(email) {
    // Regular expression pattern for validating email addresses
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the pattern
    return emailPattern.test(email);
  }

  function validate() {
    let emailIsValid = validateEmail(email);

    if (!emailIsValid) {
      setEmailInputError(true);
      return;
    }
    if (password.length < 6) {
      setPasswordInputError(true);
    } else {
      setEmailInputError(false);
      setPasswordInputError(false);
    }
  }
  return (
    <div className="flex justify-center items-center m-auto p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`border-${
              emailInPutError ? "red-500" : ""
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="text"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={` border-${
              passwordInPutError ? "red-500" : ""
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            placeholder="******************"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <p className="text-red-500 text-xs italic">
            Please choose a password.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2  px-4 rounded  focus:outline-none  focus:shadow-outline"
            type="submit"
            disabled={isLoading ? true : false}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
