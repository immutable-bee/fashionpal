import { useState } from "react";
import SmartPricingImage from "../assets/website/smart_pricing.png";
import ProfitableDiscountingImage from "../assets/website/profitable_discounting.png";
import OneTouchCheckoutImage from "../assets/website/one_tourch_checkout.png";
import RelevantMarketingImage from "../assets/website/relevant_marketing.png";
import AnalyticsImage from "../assets/website/analytics.png";
import Image from "next/image";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  return (
    <div>
      <div className="w-full flex-shrink-0 bg-white flex justify-between items-center p-2">
        <div className="">
          {isMenuOpen ? (
            <img
              onClick={() => setIsMenuOpen(false)}
              src="/images/x-cross.svg"
              width={40}
              height={40}
            />
          ) : (
            <img
              onClick={() => setIsMenuOpen(true)}
              src="/images/hamburger-menu.svg"
              width={40}
              height={40}
            />
          )}
        </div>

        <div>
          <img
            width={250}
            height={250}
            src="/images/logo.png"
          />
        </div>

        <div className="">
          <img
            src="/images/person.svg"
            width={40}
            height={40}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-6rem)] bg-[url('../assets/website/cover.png')] bg-cover bg-no-repeat flex items-center justify-center">
        <div className="bg-white w-full mx-auto max-w-4xl rounded-3xl min-h-[20rem] flex items-center justify-center px-4 py-5">
          <div>
            <h3 className="text-gray-500 text-3xl">
              Inventory Management Software Tailored to Second Hand Fashion
            </h3>

            <div className="flex justify-center items-center mt-6 gap-4">
              <button className="bg-primary hover:scale-110 w-[35%] h-14 rounded-lg text-2xl font-medium text-white duration-300 ease-in-out">
                Login
              </button>
              <button className="border-[3px] border-primary w-[35%] h-14 rounded-lg text-2xl text-gray-700 font-medium hover:scale-110 duration-300 ease-in-out">
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div>
          <div
            className="flex items-center justify-between gap-4 px-2 hover:bg-gray-50 duration-300 ease-in-out cursor-pointer py-2 border-y border-gray-400 w-full"
            onClick={() => setIsCollapseOpen(!isCollapseOpen)}
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-10 h-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>

              <h3 className="text-2xl mt-1 text-gray-600">
                The Value We Offer
              </h3>
            </div>
            {/* {!isCollapseOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            )} */}
          </div>

          <p className="text-lg text-gray-600 mt-3">
            FashionPal is more than just a management tool; it's your
            personalized assistant in the demanding world of fashion.
            Understanding that each fashion business comes with its unique
            challenges and customer demands, our platform adapts to your
            specific needs. By incorporating insights directly from your
            customer data, FashionPal ensures that every decision you make is
            informed and targeted for success. Experience not only a smoother
            operation but also a strategy that's tailored to boost your
            profitability and customer satisfaction. With FashionPal, navigate
            the complexities of fashion management effortlessly and watch your
            business thrive in alignment with your customers' evolving
            preferences.
          </p>
        </div>
        <div className="mt-20">
          <div className="flex rounded-3xl overflow-hidden my-12">
            <div className=" w-1/3">
              <Image
                src={SmartPricingImage}
                alt="Smart Pricing Illustration"
              />
            </div>
            <div className="bg-primary w-2/3 px-10 py-4 flex items-center">
              <div>
                <h1 className="text-white font-semibold text-5xl">
                  Smart Pricing
                </h1>

                <h3 className="text-lg text-white mt-4">
                  Eliminate pricing guesswork of each unique item and allow our
                  Al tool to find the best price for you in seconds!
                </h3>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row-reverse rounded-3xl overflow-hidden my-12">
            <div className=" w-1/3">
              <Image
                src={ProfitableDiscountingImage}
                alt="Profitable Discounting Illustration"
              />
            </div>
            <div className="bg-indigo-500 w-2/3 px-10 py-4 flex items-center">
              <div>
                <h1 className="text-white font-semibold text-5xl">
                  Profitable Discounting
                </h1>

                <h3 className="text-lg text-white mt-4">
                  Maximize profits on fresh inventory by using the automated
                  repricer to gradually adjust the prices of individual items as
                  they age, avoiding drastic profit cuts.
                </h3>
              </div>
            </div>
          </div>
          <div className="flex rounded-3xl overflow-hidden my-12">
            <div className=" w-1/3">
              <Image
                src={OneTouchCheckoutImage}
                alt="One Touch Checkout Illustration"
              />
            </div>
            <div className="bg-primary w-2/3 px-10 py-4 flex items-center">
              <div>
                <h1 className="text-white font-semibold text-5xl">
                  One Touch Checkout
                </h1>

                <h3 className="text-lg text-white mt-4">
                  Enjoy an employee-friendly POS experience designed to minimize
                  errors and capture detailed sales information of each loyal
                  customer.
                </h3>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row-reverse rounded-3xl overflow-hidden my-12">
            <div className=" w-1/3">
              <Image
                src={RelevantMarketingImage}
                alt="Profitable Discounting Illustration"
              />
            </div>
            <div className="bg-indigo-500 w-2/3 px-10 py-4 flex items-center">
              <div>
                <h1 className="text-white font-semibold text-5xl">
                  Relevant Marketing
                </h1>

                <h3 className="text-lg text-white mt-4">
                  Affract your customers back to the store with automated emails
                  showcasing new and relevant items tailored just for them.
                </h3>
              </div>
            </div>
          </div>
          <div className="flex rounded-3xl overflow-hidden my-12">
            <div className=" w-1/3">
              <Image
                src={AnalyticsImage}
                alt="One Touch Checkout Illustration"
              />
            </div>
            <div className="bg-primary w-2/3 px-10 py-4 flex items-center">
              <div>
                <h1 className="text-white font-semibold text-5xl">Analytics</h1>

                <h3 className="text-lg text-white mt-4">
                  FashionPal delves deep into the intricate details of your
                  items and essential business metrics, empowering you to make
                  well-informed business decisions.
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className=" max-w-4xl mx-auto px-8">
          <p className="text-xl text-gray-500 mt-3 text-center">
            Unlike the typical inventory management software that adds to your
            daily workload, FashionPal is crafted to genuinely streamline your
            tasks and boost profitability. <br /> <br />
            Eliminate your daily headaches with outdated software tools and
            start using a software engine that works for you. <br /> <br />
            Create your FashionPal account today!
          </p>

          <div className="flex justify-center items-center mt-6 gap-4">
            <button className="bg-primary hover:scale-110 w-[35%] h-14 rounded-lg text-2xl font-medium text-white duration-300 ease-in-out">
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const main = () => {
  return <HomeHeader />;
};

export default main;
