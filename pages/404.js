/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "next/router";

const error = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className={`sm:p-4 sm:min-h-[calc(100vh-6.5rem)] sm:flex items-center  justify-center ${
        router && router.asPath === "/" && "sr-only"
      }`}
    >
      <div className="max-w-7xl w-full py-6 h-[calc(100vh-6.5rem)] sm:h-auto mx-auto bg-white sm:rounded-2xl overflow-hidden pb-2">
        <h1 className="text-9xl text-center text-primary">404</h1>
        <h3 className="text-[#77838F] mt-3 font-light text-center text-xl sm:text-2xl">
          OOPPS! THE PAGE YOU WERE LOOKING FOR, COULDN'T BE FOUND.
        </h3>
        <h3 className="text-[#535353] mt-4 font-light text-center text-lg sm:text-xl">
          Try the search below to find matching pages:
        </h3>
        <div className="flex justify-center mt-5">
          <button
            type="button"
            className="bg-primary text-lg rounded-3xl px-20 justify-center items-center h-14 font-medium text-white hover:opacity-90"
            onClick={() => handleGoBack()}
          >
            <span className="flex justify-center"> Take Me Back </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default error;
