/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import SmartPricingImage from "../assets/website/smart_pricing.png";
import ProfitableDiscountingImage from "../assets/website/profitable_discounting.png";
import OneTouchCheckoutImage from "../assets/website/one_tourch_checkout.png";
import RelevantMarketingImage from "../assets/website/relevant_marketing.png";
import AnalyticsImage from "../assets/website/analytics.png";
import Image from "next/image";
import WebsiteHeader from "@/components/utility/WebsiteHeader";
import Link from "next/link";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [formData, setFormData] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div>
      <div className="h-[4rem] sm:h-[5rem]">
        <WebsiteHeader />
      </div>

      <div className="h-[35rem] sm:h-[calc(100vh-6rem)] bg-center bg-[url('../assets/website/cover.png')] bg-cover bg-no-repeat flex items-center justify-center">
        <div className="bg-white sm:mx-auto max-w-4xl rounded-xl sm:rounded-3xl min-h-[20rem] sm:min-h-[20rem] flex items-center justify-center px-8 sm:px-8 sm:w-full w-[90%] py-4 sm:py-5">
          <div>
            <h3 className="text-gray-700 text-xl sm:text-[1.8rem] text-center">
              Inventory Management Software Tailored to Second Hand Fashion
            </h3>
            <p className="text-gray-500 text-center mt-3 text-base sm:text-lg mx-4">
              Your digital fashion ally. Tailored to your unique needs, it
              transforms customer insights into success strategies. Elevate your
              operations, boost profitability, and enhance customer
              satisfaction, all in one sleek platform. Navigate fashion's
              complexities with ease and watch your business flourish
            </p>

            <div className="flex justify-center items-center mt-6 gap-4">
              <Link href="#pricing">
                <button className="bg-primary hover:scale-110 w-[40vw] sm:w-72 h-14 rounded-lg text-lg sm:text-2xl font-medium text-white duration-300 ease-in-out">
                  Start now
                </button>
              </Link>
              <a
                href="https://calendly.com/nate-fpal/30min"
                target="_black"
              >
                <button className="border-[3px] border-primary w-[40vw] sm:w-72 h-14 rounded-lg text-lg sm:text-2xl text-gray-700 font-medium hover:scale-110 duration-300 ease-in-out">
                  Book a demo
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-12">
        <div className="mt-20">
          <div className="sm:flex sm:border-non border rounded-3xl overflow-hidden my-12">
            <div className=" sm:w-1/3">
              <Image
                src={SmartPricingImage}
                alt="Smart Pricing Illustration"
              />
            </div>
            <div className="bg-primary sm:w-2/3 px-10 py-4 flex items-center">
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
          <div className="sm:flex sm:border-non border sm:flex-row-reverse rounded-3xl overflow-hidden my-12">
            <div className=" sm:w-1/3">
              <Image
                src={ProfitableDiscountingImage}
                alt="Profitable Discounting Illustration"
              />
            </div>
            <div className="bg-indigo-500 sm:w-2/3 px-10 py-4 flex items-center">
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
          <div className="sm:flex sm:border-non border rounded-3xl overflow-hidden my-12">
            <div className=" sm:w-1/3">
              <Image
                src={OneTouchCheckoutImage}
                alt="One Touch Checkout Illustration"
              />
            </div>
            <div className="bg-primary sm:w-2/3 px-10 py-4 flex items-center">
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
          <div className="sm:flex sm:border-non border sm:flex-row-reverse rounded-3xl overflow-hidden my-12">
            <div className=" sm:w-1/3">
              <Image
                src={RelevantMarketingImage}
                alt="Profitable Discounting Illustration"
              />
            </div>
            <div className="bg-indigo-500 sm:w-2/3 px-10 py-4 flex items-center">
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
          <div className="sm:flex sm:border-non border rounded-3xl overflow-hidden my-12">
            <div className=" sm:w-1/3">
              <Image
                src={AnalyticsImage}
                alt="One Touch Checkout Illustration"
              />
            </div>
            <div className="bg-primary sm:w-2/3 px-10 py-4 flex items-center">
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

          {/* <div className="flex justify-center items-center mt-6 gap-4">
            <Link href="/auth">
              <button className="bg-primary hover:scale-110 w-52 sm:w-64 h-14 rounded-lg text-xl sm:text-2xl font-medium text-white duration-300 ease-in-out">
                Create an Account
              </button>
            </Link>
          </div> */}
        </div>
      </div>

      <div id="pricing">
        <div class="grid grid-cols-1 sm:grid-cols-3 my-20 mx-auto max-w-6xl px-3 sm:px-6">
          <div class="border sm:pb-10 my-3 sm:my-0">
            <div class="sm:h-[300px] border-b  flex flex-col justify-between py-6">
              <div class="px-[68px]">
                <h2 class="text-center text-black text-2xl font-medium">
                  Basics{" "}
                </h2>

                <h1 class="flex items-start justify-center font-bold text-center pt-3">
                  <span class="text-4xl">$</span>
                  <span class="text-4xl">19.99</span>
                </h1>
                <h4 class="text-center text-gray-500">0-1 EMPLOYEES</h4>
              </div>

              <h4 class="text-center italic text-sm text-gray-500 px-3">
                For stores running solo or with part-time help.
              </h4>
              <div class="flex justify-center px-[68px]">
                <button class="bg-primary px-3 h-[52px] w-full text-white rounded-lg text-lg hover:scale-110 duration-300 ease-in-out">
                  Get Started
                </button>
              </div>
            </div>
            <div class="sm:h-[300px] pt-12 mb-10">
              <ul class="list-disc px-[40px]">
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> 100 Al Listing
                  Credits
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span>Automated Sales
                  Discounting
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span>Square
                  Integration
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span>Email and
                  Social Marketing
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span>Main Category
                  Analytics
                </li>
              </ul>
            </div>
          </div>

          <div class="border sm:pb-10 my-3 sm:my-0 sm:-mt-[46px]">
            <div class="bg-primary w-full h-2 hidden sm:block"></div>
            <div class="h-[338px] border-b  flex flex-col justify-between pb-6 pt-2">
              <h2 class="text-center text-yellow-500 text-xl font-medium hidden sm:block">
                Growth
              </h2>

              <div class="px-[68px]">
                <h2 class="text-center text-black text-2xl font-medium">
                  Growth
                </h2>
                <h1 class="flex items-start justify-center font-bold text-center">
                  <span class="text-4xl">$</span>
                  <span class="text-4xl">99.99</span>
                </h1>
                <h4 class="text-center text-gray-500">1-5 EMPLOYEES</h4>
              </div>

              <h4 class="text-center italic text-sm text-gray-500 px-3">
                For stores ready to maximize profitability and streamline
                workflows.
              </h4>
              <div class="flex justify-center px-[68px]">
                <button class="bg-primary px-3 h-[52px] w-full text-white rounded-lg text-lg hover:scale-110 duration-300 ease-in-out">
                  Get Started
                </button>
              </div>
            </div>
            <div class="sm:h-[300px] pt-12 mb-10">
              <ul class="list-disc px-[40px]">
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> Unlimited Al
                  Listing Credits
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> Smart
                  Aged-Inventory Repricer
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span>Square
                  Integration
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> Email and
                  Social Marketing
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> Advanced
                  Business Metrics
                </li>
              </ul>
            </div>
          </div>
          <div class="border sm:pb-10 my-3 sm:my-0">
            <div class="sm:h-[300px] border-b  flex flex-col justify-between py-6">
              <div class="px-[68px]">
                <h2 class="text-center text-black text-2xl font-medium">
                  Volume
                </h2>

                <h1 class="flex items-start justify-center font-bold text-center pt-3">
                  <span class="text-4xl">$</span>
                  <span class="text-4xl">299.99</span>
                </h1>
                <h4 class="text-center text-gray-500">5+ EMPLOYEES</h4>
              </div>

              <h4 class="text-center italic text-sm text-gray-500 px-3">
                For stores with more than $50K Monthly Sales
              </h4>
              <div class="flex justify-center px-[68px]">
                <button class="bg-primary px-3 h-[52px] w-full text-white rounded-lg text-lg hover:scale-110 duration-300 ease-in-out">
                  Get Started
                </button>
              </div>
            </div>
            <div class="sm:h-[300px] pt-12 mb-10">
              <ul class="list-disc px-[40px]">
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> All Growth
                  Features InIcuded
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> Discounted
                  Transaction Fee
                </li>
                <li class="mb-2 flex items-center text-black text-xl font-nomal">
                  <span class="text-primary mr-3">&#10003;</span> Priority
                  Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        class="max-w-7xl mx-auto mt-20 pb-20 px-3 sm:px-6"
        id="contact-us"
      >
        <h1 class="text-3xl sm:text-5xl text-gray-700 font-medium">
          Contact Us
        </h1>
        <form onSubmit={handleSubmit}>
          <div class="grid grid-cols-2 mt-8 sm:mt-12 gap-5">
            <input
              type="text"
              name="name"
              class="rounded-2xl border border-gray-400 px-3 sm:px-6 w-full focus:outline-none py-3 text-lg text-gray-600"
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              required
              class="rounded-2xl border border-gray-400 px-3 sm:px-6 w-full focus:outline-none py-3 text-lg text-gray-600"
              placeholder="Email *"
              onChange={handleChange}
            />
          </div>
          <div class="mt-8">
            <input
              type="tel"
              name="phone"
              class="rounded-2xl border border-gray-400 px-3 sm:px-6 w-full focus:outline-none py-3 text-lg text-gray-600"
              placeholder="Phone number *"
              onChange={handleChange}
            />
          </div>
          <div class="mt-8">
            <textarea
              placeholder="Comment"
              name="comment"
              class="rounded-2xl border border-gray-400 px-3 sm:px-6 w-full focus:outline-none py-3 text-lg text-gray-600"
              id=""
              cols="30"
              rows="4"
              onChange={handleChange}
            ></textarea>
          </div>
          <div class="mt-6 sm:mt-6">
            <button
              class="rounded-xl px-12  py-[14px] text-xl text-gray-50 font-medium bg-primary hover:scale-110 duration-300 ease-in-out"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const main = () => {
  return <HomeHeader />;
};

export default main;
