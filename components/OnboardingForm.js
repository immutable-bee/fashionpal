import { useState } from "react";
import Image from "next/image";
import { Checkbox, Input, Button, Modal } from "@nextui-org/react";
// import * as notify from "../../../bibliopal-nextjs/pages/api/notifier/notify";
import { NotificationManager } from "react-notifications";
import ButtonComponent from "@/components/utility/Button";

const stateOptions = [
  { key: "al", value: "AL", text: "Alabama" },
  { key: "ak", value: "AK", text: "Alaska" },
  { key: "az", value: "AZ", text: "Arizona" },
  { key: "ar", value: "AR", text: "Arkansas" },
  { key: "ca", value: "CA", text: "California" },
  { key: "co", value: "CO", text: "Colorado" },
  { key: "ct", value: "CT", text: "Connecticut" },
  { key: "de", value: "DE", text: "Delaware" },
  { key: "fl", value: "FL", text: "Florida" },
  { key: "ga", value: "GA", text: "Georgia" },
  { key: "hi", value: "HI", text: "Hawaii" },
  { key: "id", value: "ID", text: "Idaho" },
  { key: "il", value: "IL", text: "Illinois" },
  { key: "in", value: "IN", text: "Indiana" },
  { key: "ia", value: "IA", text: "Iowa" },
  { key: "ks", value: "KS", text: "Kansas" },
  { key: "ky", value: "KY", text: "Kentucky" },
  { key: "la", value: "LA", text: "Louisiana" },
  { key: "me", value: "ME", text: "Maine" },
  { key: "md", value: "MD", text: "Maryland" },
  { key: "ma", value: "MA", text: "Massachusetts" },
  { key: "mi", value: "MI", text: "Michigan" },
  { key: "mn", value: "MN", text: "Minnesota" },
  { key: "ms", value: "MS", text: "Mississippi" },
  { key: "mo", value: "MO", text: "Missouri" },
  { key: "mt", value: "MT", text: "Montana" },
  { key: "ne", value: "NE", text: "Nebraska" },
  { key: "nv", value: "NV", text: "Nevada" },
  { key: "nh", value: "NH", text: "New Hampshire" },
  { key: "nj", value: "NJ", text: "New Jersey" },
  { key: "nm", value: "NM", text: "New Mexico" },
  { key: "ny", value: "NY", text: "New York" },
  { key: "nc", value: "NC", text: "North Carolina" },
  { key: "nd", value: "ND", text: "North Dakota" },
  { key: "oh", value: "OH", text: "Ohio" },
  { key: "ok", value: "OK", text: "Oklahoma" },
  { key: "or", value: "OR", text: "Oregon" },
  { key: "pa", value: "PA", text: "Pennsylvania" },
  { key: "ri", value: "RI", text: "Rhode Island" },
  { key: "sc", value: "SC", text: "South Carolina" },
  { key: "sd", value: "SD", text: "South Dakota" },
  { key: "tn", value: "TN", text: "Tennessee" },
  { key: "tx", value: "TX", text: "Texas" },
  { key: "ut", value: "UT", text: "Utah" },
  { key: "vt", value: "VT", text: "Vermont" },
  { key: "va", value: "VA", text: "Virginia" },
  { key: "wa", value: "WA", text: "Washington" },
  { key: "wv", value: "WV", text: "West Virginia" },
  { key: "wi", value: "WI", text: "Wisconsin" },
  { key: "wy", value: "WY", text: "Wyoming" },
];

const TCModalContent = () => {
  return (
    <>
      <Modal.Header>
        <h1 className="text-2xl">Terms and Conditions</h1>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h1 className="text-lg">1. Introduction</h1>
          <p>
            1.1. Welcome to FashionPal. These Terms and Conditions
            &quot;Terms&quot; govern your use of our website, available at
            FashionPal.app, and the services provided therein.
          </p>
          <p>
            1.2. By using our website, you accept these Terms in full. If you
            disagree with these Terms or any part of them, you must not use our
            website.
          </p>

          <h1 className="text-lg">2. Definitions</h1>
          <p>
            &quot;Consumer User&quot; refers to individuals using our platform
            to search for clothing.
          </p>
          <p>
            &quot;Business User&quot; refers to businesses or individuals adding
            clothing to our database.
          </p>

          <h1 className="text-lg">3. Use of the Website</h1>
          <p>
            3.1. Users must provide accurate, complete, and current information
            when setting up an account or setting alerts.
          </p>
          <p>
            3.2. Our platform provides information about clothing items
            available based on the data input by Business Users. FashionPal is
            not responsible for any discrepancies between the data provided by
            the Business User and the actual item availability or condition.
          </p>

          <h1 className="text-lg">4. Payments</h1>
          <p>
            4.1. All payments made on FashionPal are processed securely through
            our payment partner, Square. Please refer to Square&#39;s terms of
            service and privacy policy for more details on payment processing.
          </p>

          <h1 className="text-lg">5. Limitation of Liability</h1>
          <p>
            5.1. FashionPal will not be held responsible for any errors,
            inaccuracies, or discrepancies in the data provided by Business
            Users.
          </p>
          <p>
            5.2. Consumer Users acknowledge that clothing availability, prices,
            and conditions are subject to change without notice, and FashionPal
            will not be held liable for any inconveniences or losses stemming
            from these changes
          </p>

          <h1 className="text-lg">6. Intellectual Property</h1>
          <p>
            6.1. All content, graphics, user and visual interfaces, and the
            selection and coordination thereof, and all software, products,
            works, and services offered on or through our website, including,
            but not limited to, the design, structure, &quot;look and
            feel&quot;, are owned by FashionPal, its licensors, vendors, agents,
            or its content providers.
          </p>

          <h1 className="text-lg">7. Termination</h1>
          <p>
            7.1. FasionPal reserves the right to terminate or suspend any
            account at its sole discretion, without notice, for conduct that it
            believes violates these Terms or is harmful to other users,
            FashionPal, third parties, or for any other reason.
          </p>

          <h1 className="text-lg">8. Changes to the Terms</h1>
          <p>
            8.1. FashionPal reserves the right to change these Terms from time
            to time at its sole discretion. The updated version will be
            effective as soon as it is accessible.
          </p>
        </div>
      </Modal.Body>
    </>
  );
};

const OnboardingForm = ({ isCompleteHandler, loadingHandler }) => {
  const [isStepOne, setIsStepOne] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTCModalOpen, setIsTCModalOpen] = useState(false);

  const [formData, setFormData] = useState();

  const isValidHttpUrl = (str) => {
    const valid = /^((https?|ftp):\/\/)?[^\s/$.?#]+\.[^\s/$.?#]+[^\s]*$/.test(
      str
    );
    return valid;
  };
  const formStepHandler = () => {
    if (isStepOne) {
      // Check if required fields in step one are filled
      if (!formData?.businessName) {
        NotificationManager.error("Business  name is required!");
        return;
      } else if (formData?.url && !isValidHttpUrl(formData?.url)) {
        NotificationManager.error("Invalid website URL!");
        return;
      }

      setIsStepOne(false);
    } else {
      setIsStepOne(true);
    }
  };

  const tcModalOpenHandler = () => {
    setIsTCModalOpen(true);
  };

  const tcModalCloseHandler = () => {
    setIsTCModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.businessStreet) {
      NotificationManager.error("Street is required!");
      return;
    } else if (!formData?.businessCity) {
      NotificationManager.error("City url is required!");
      return;
    } else if (!formData?.businessState) {
      NotificationManager.error("State url is required!");
      return;
    } else if (!formData?.businessZip) {
      NotificationManager.error("Zip code url is required!");
      return;
    } else if (!agreedToTerms) {
      NotificationManager.error(
        "Please agree to the terms and conditions before proceeding"
      );
      return;
    }

    loadingHandler(true);

    try {
      const res = await fetch("/api/auth/onboarding/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to onboard user");
      }

      await res.json();
      loadingHandler(false);
      isCompleteHandler();
    } catch (err) {
      // notify.error(err)
      console.error(err);
      loadingHandler(false);
    }
  };

  return (
    <>
      <div className="auth-content-container pb-8">
        {!isStepOne && (
          <div
            id="onboarding-back-btn "
            onClick={formStepHandler}
            className="flex justify-center !mt-5 py-1 bg-primary w-7 rounded-full border border-black cursor-pointer hover:opacity-80"
            size={""}
          >
            <Image
              src="https://www.buylocalbooksnetwork.com/icons/icon-chevron.svg"
              alt="chevron icon"
              height="17"
              width="17"
              id="chevron-icon"
            />
          </div>
        )}

        <div className="mt-6">
          {isStepOne ? (
            <div className="w-full flex flex-col items-center">
              <Input
                onChange={handleChange}
                className="onboard-fields my-2"
                placeholder="Store Business Name"
                name="businessName"
              />
              <Input
                onChange={handleChange}
                className="onboard-fields my-2"
                placeholder="Website Url"
                name="url"
              />
              <div className="mt-5 w-full">
                <ButtonComponent
                  full
                  rounded
                  onClick={formStepHandler}
                >
                  Next
                </ButtonComponent>
              </div>
            </div>
          ) : (
            <form
              id="onboarding-form"
              className="mt-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                <Input
                  onChange={handleChange}
                  className="onboard-fields  my-2"
                  name="businessStreet"
                  placeholder="Business Address"
                />

                <Input
                  onChange={handleChange}
                  className="onboard-fields  my-2"
                  name="businessCity"
                  placeholder="Business City"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                <select
                  name="businessState"
                  onChange={handleChange}
                  className="
                      border-[#f1f3f5]
                      rounded-xl
                      bg-[#f1f3f5]
                      text-[#787878]
                      h-10
                      my-2 px-2
                      "
                >
                  {stateOptions.map((state) => (
                    <option
                      key={state.key}
                      value={state.value}
                    >
                      {state.text}
                    </option>
                  ))}
                </select>
                <Input
                  onChange={handleChange}
                  className="small-onboard-fields  my-2"
                  name="businessZip"
                  placeholder="Zip Code"
                />
              </div>

              <div
                id="onboarding-form-tc-row"
                className="flex items-center mt-3"
              >
                <Checkbox
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  id="onboarding-form-tc-checkbox"
                  className="mr-2"
                  size={"sm"}
                ></Checkbox>
                <h6 id="onboarding-form-tc-agree-text">I agree to the</h6>
                <h6
                  id="onboarding-form-tc-link"
                  className="text-primary ml-1 cursor-pointer"
                  onClick={tcModalOpenHandler}
                >
                  Terms and Conditions
                </h6>
              </div>
              <div className="mt-5 w-full">
                <ButtonComponent
                  full
                  rounded
                  type="submit"
                >
                  Submit
                </ButtonComponent>
              </div>
            </form>
          )}
        </div>
        <Modal
          open={isTCModalOpen}
          closeButton
          onClose={tcModalCloseHandler}
        >
          <TCModalContent />
        </Modal>
      </div>
    </>
  );
};

export default OnboardingForm;
