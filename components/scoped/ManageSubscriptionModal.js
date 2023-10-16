// import styles from "../../styles/components/managesubscriptionmodal.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ButtonComponent from '@/components/utility/Button'
import LoadingComponent from '@/components/utility/loading';
import ModalComponent from '@/components/utility/Modal';
import { useCallback } from 'react';

const ManageSubscriptionModal = (props) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    props.subscriptionStatus
  );
  const [subscriptionData, setSubscriptionData] = useState(
    props.subscriptionData
  );

  const [billingDate, setBillingDate] = useState();

  // data returned from route
  const [upgradePlanData, setUpgradePlanData] = useState();
  // data sent to route
  const [upgradeRequest, setUpgradeRequest] = useState();
  const [downgradeRequest, setDowngradeRequest] = useState();

  const [upgradePlanView, setUpgradePlanView] = useState(false);
  const [confirmUpgradeView, setConfirmUpgradeView] = useState();
  const [downgradePlanView, setDowngradePlanView] = useState(false);
  const [confirmDowngradeView, setConfirmDowngradeView] = useState();
  const [confirmCancelView, setConfirmCancelView] = useState(false);

  const [amountDueLoading, setAmountDueLoading] = useState(false);
  const [requestResponseLoading, setRequestResponseLoading] = useState(false);

  const [cancelMessage, setCancelMessage] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  // const { data: session } = useSession({ required: true });

  const planDetailsHandler = (value) => {

    let details = {};
    if (value === "Not Subscribed") {
      details = [
        "5k listing limit",
        "Buy and sell in state",
        "Request books in state",
        "Platform closing fee ($2 flat fee + 10% over $10)",
      ]
    } else if (
      value === "Monthly Plan (State)" ||
      value === "Yearly Plan (State)"
    ) {
      details = [
        "List up to 1000 per month",
        "3-7 day inventory visibility",
      ]
    } else if (
      value === "Monthly Plan (National)" ||
      value === "Yearly Plan (National)"
    ) {
      details = [
        "List up to 5000 per month",
        "3-30 day inventory visibility",
      ]
    }
    return details;
  };

  const upgradePlanDataHandler = useCallback(async () => {

    setAmountDueLoading(true);
    const response = await fetch(
      "api/stripe/get-subscription-upgrade-details",
      {
        method: "POST",
        body: JSON.stringify({
          newPlan: upgradeRequest,
          currentPlan: subscriptionStatus,
        }),
      }
    );
    const data = await response.json();
    setUpgradePlanData(data);
    setAmountDueLoading(false);
  }, [upgradeRequest, subscriptionStatus]);


  const downgradeSubscription = async () => {
    setRequestResponseLoading(true);
    const response = await fetch("api/stripe/update-subscription/downgrade", {
      method: "POST",
      body: JSON.stringify({
        newPlan: downgradeRequest,
        currentPlan: subscriptionStatus,
      }),
    });

    setConfirmDowngradeView(false);
    setDowngradePlanView(false);
    setRequestResponseLoading(false);
    props.onClose();
  };

  const upgradeSubscription = async () => {
    setRequestResponseLoading(true);
    const response = await fetch("api/stripe/update-subscription/upgrade", {
      method: "POST",
      body: JSON.stringify({
        newPlan: upgradeRequest,
        currentPlan: subscriptionStatus,
      }),
    });

    setRequestResponseLoading(false);
    setConfirmUpgradeView(false);
    setUpgradePlanView(false);
    props.onClose();
  };

  const handleUnsubscribe = async () => {
    try {
      setSubLoading(true);
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        setCancelMessage(data.message);
      } else {
        const errorData = await response.json();
        setCancelMessage(
          errorData.message ||
          "An error occurred while canceling the subscription"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setCancelMessage("An error occurred while canceling the subscription");
    } finally {
      setSubLoading(false);
      setTimeout(() => {
        setCancelMessage(null);
        setConfirmCancelView(false);

        props.onClose();
      }, 2500);
    }
  };
  const billingDateHandler = () => {
    const nextBillingDate = new Date(
      props.subscriptionData[0]?.current_period_end * 1000
    );
    const formattedDate = `${nextBillingDate.getMonth() + 1
      }/${nextBillingDate.getDate()}/${nextBillingDate.getFullYear()}`;
    return formattedDate;
  };

  useEffect(() => {

    if (props.subscriptionData) {
      setBillingDate(billingDateHandler());
    }
  }, [props.subscriptionData]);



  useEffect(() => {
    if (props.subscriptionStatus) {
      setSubscriptionStatus(props.subscriptionStatus);
    }
  }, [props.subscriptionStatus]);

  useEffect(() => {
    (async () => {
      await upgradePlanDataHandler();
    })();
  }, [upgradeRequest, upgradePlanDataHandler]);


  const upgradePlanViewHandler = () => {
    setUpgradePlanView(!upgradePlanView);
  };

  const confirmUpgradeViewHandler = (plan) => {
    setConfirmUpgradeView(plan);
    switch (plan) {
      case "Yearly Plan (State)":
        setUpgradeRequest("Yearly Plan (State)");
        break;
      case "Monthly Plan (National)":
        setUpgradeRequest("Monthly Plan (National)");
        break;
      case "Yearly Plan (National)":
        setUpgradeRequest("Yearly Plan (National)");
        break;
      default:
        break;
    }
  };

  const downgradePlanViewHandler = () => {
    setDowngradePlanView(!downgradePlanView);
  };

  const confirmDowngradeViewHandler = (plan) => {
    setConfirmDowngradeView(plan);
    switch (plan) {
      case "Yearly Plan (State)":
        setDowngradeRequest("Yearly Plan (State)");
        break;
      case "Monthly Plan (National)":
        setDowngradeRequest("Monthly Plan (National)");
        break;
      case "Monthly Plan (State)":
        setDowngradeRequest("Monthly Plan (State)");
        break;
      default:
        break;
    }
  };

  const confirmCancelViewHandler = () => {
    setConfirmCancelView(!confirmCancelView);
  };

  const PlanDetails = ({ plan, details }) => (
    <>
      <h6 className="text-sm font-semibold">{plan}</h6>
      <ul id="plan-details" className="text-sm text-black list-disc !mt-2">
        Plan Features:
        {details.map((item, index) => (
          <li key={index} className="text-xs ml-4 !mt-1 text-gray-600 font-normal">{item}</li>
        ))}
      </ul>
    </>
  );



  const SubscriptionTypeHandler = () => {
    if (subscriptionStatus === "Monthly Plan (State)") {
      return (
        <>
          <h6 className="text-base font-semibold text-center">Amount: $15.00</h6>
          <ButtonComponent
            color="blue" full rounded
            onClick={upgradePlanViewHandler}
          >
            Upgrade Plan
          </ButtonComponent>
        </>
      );
    } else if (
      subscriptionStatus === "Monthly Plan (National)" ||
      subscriptionStatus === "Yearly Plan (State)"
    ) {
      return (
        <>
          {subscriptionStatus === "Monthly Plan (National)" ? (
            <h6 className="text-sm font-semibold">Amount: $11.99.00</h6>
          ) : (
            <h6 className="text-sm font-semibold">Amount: $49.99.00</h6>
          )}
          <ButtonComponent
            onClick={upgradePlanViewHandler}
          >
            Upgrade Plan
          </ButtonComponent>
          <ButtonComponent
            full rounded
            onClick={downgradePlanViewHandler}
          >
            Downgrade Plan
          </ButtonComponent>
        </>
      );
    } else if (subscriptionStatus === "Yearly Plan (National)") {
      return (
        <>
          <h6 className="text-sm font-semibold">Amount: $99.99.00</h6>
          <ButtonComponent
            full rounded
            onClick={downgradePlanViewHandler}
          >
            Downgrade Plan
          </ButtonComponent>
        </>
      );
    }
  };

  const UpgradeView = () => {
    if (!confirmUpgradeView) {
      const upgradeMessage = () => {
        return (
          <h6 className="text-sm font-semibold">
            Select your new plan. You will be charged a prorated rate based on
            your current billing cycle
          </h6>
        );
      };
      const backButton = () => {
        return (
          <ButtonComponent
            full rounded
            onClick={upgradePlanViewHandler}
          >
            Go Back
          </ButtonComponent>
        );
      };

      if (subscriptionStatus === "Monthly Plan (State)") {
        return (
          <>
            {upgradeMessage()}
            <ButtonComponent
              color="blue" full rounded
              onClick={() => confirmUpgradeViewHandler("Yearly Plan (State)")}
            >
              Yearly (State) $49.99
            </ButtonComponent>
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmUpgradeViewHandler("Monthly Plan (National)")
              }
            >
              Monthly (National) $11.99
            </ButtonComponent>
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmUpgradeViewHandler("Yearly Plan (National)")
              }
            >
              Yearly (National) $99.99
            </ButtonComponent>
            {backButton()}
          </>
        );
      } else if (subscriptionStatus === "Yearly Plan (State)") {
        return (
          <>
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmUpgradeViewHandler("Yearly Plan (National)")
              }
            >
              Yearly (National) $99.99
            </ButtonComponent>
            {backButton()}
          </>
        );
      } else if (subscriptionStatus === "Monthly Plan (National)") {
        return (
          <>
            {upgradeMessage()}
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmUpgradeViewHandler("Yearly Plan (National)")
              }
            >
              Yearly (National) $99.99
            </ButtonComponent>
            {backButton()}
          </>
        );
      }
    } else {
      return <ConfirmUpgradeView />;
    }
  };

  const ConfirmUpgradeView = () => {
    const goBackHandler = () => {
      setConfirmUpgradeView(null);
    };
    const backButton = () => {
      return (
        <ButtonComponent
          full rounded onClick={goBackHandler}>
          Go Back
        </ButtonComponent>
      );
    };

    switch (confirmUpgradeView) {
      case "Yearly Plan (State)":
        return (
          <>
            <PlanDetails
              plan="New Plan: Yearly (State) $49.99/Year"
              details={planDetailsHandler(confirmUpgradeView)}
            />
            <h6 className="text-sm font-semibold">
              Due Today:{" "}
              {amountDueLoading ? (
                <LoadingComponent type="points" />
              ) : (
                `$${upgradePlanData.amount_due / 100}`
              )}
            </h6>
            {requestResponseLoading ? (
              <LoadingComponent />
            ) : (
              <ButtonComponent
                full rounded color="blue"
                onClick={upgradeSubscription}

              >
                Confirm
              </ButtonComponent>
            )}
            {backButton()}
          </>
        );
      case "Monthly Plan (National)":
        return (
          <>
            <PlanDetails
              plan="New Plan: Monthly (National) $11.99/Monthly"
              details={planDetailsHandler(confirmUpgradeView)}
            />
            <h6 className="text-sm font-semibold">
              Due Today:{" "}
              {amountDueLoading ? (
                <LoadingComponent type="points" />
              ) : (
                `$${(upgradePlanData.amount_due - 3000) / 100}`
              )}
            </h6>
            {requestResponseLoading ? (
              <LoadingComponent />
            ) : (
              <ButtonComponent
                color="blue" full rounded
                onClick={upgradeSubscription}

              >
                Confirm
              </ButtonComponent>
            )}
            {backButton()}
          </>
        );
      case "Yearly Plan (National)":
        return (
          <>
            <PlanDetails
              plan="New Plan: Yearly (National) $99.99/Year"
              details={planDetailsHandler(confirmUpgradeView)}
            />
            <h6 className="text-sm font-semibold">
              Due Today:{" "}
              {amountDueLoading ? (
                <LoadingComponent type="points" />
              ) : (
                `$${upgradePlanData.amount_due / 100}`
              )}
            </h6>
            {requestResponseLoading ? (
              <LoadingComponent />
            ) : (
              <ButtonComponent
                color="blue" full rounded
                onClick={upgradeSubscription}

              >
                Confirm
              </ButtonComponent>
            )}
            {backButton()}
          </>
        );
      default:
        break;
    }
  };

  const DowngradeView = () => {
    if (!confirmDowngradeView) {
      const downgradeMessage = () => {
        return (
          <h6 className="text-sm font-semibold">
            Select your new plan. You will be charged when the new plan goes
            into effect at the end of your current billing cycle.
          </h6>
        );
      };
      const backButton = () => {
        return (
          <ButtonComponent color="blue" full rounded
            onClick={downgradePlanViewHandler}
          >
            Go Back
          </ButtonComponent>
        );
      };

      if (subscriptionStatus === "Yearly Plan (State)") {
        return (
          <>
            {downgradeMessage()}
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmDowngradeViewHandler("Monthly Plan (State)")
              }
            >
              Monthly Plan (State) $15
            </ButtonComponent>
            {backButton()}
          </>
        );
      } else if (subscriptionStatus === "Monthly Plan (National)") {
        return (
          <>
            {downgradeMessage()}
            <ButtonComponent
              color="blue" full rounded
              onClick={() => confirmDowngradeViewHandler("Yearly Plan (State)")}
            >
              Yearly (State) $49.99
            </ButtonComponent>
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmDowngradeViewHandler("Monthly Plan (State)")
              }
            >
              Monthly (State) $15
            </ButtonComponent>
            {backButton()}
          </>
        );
      } else if (subscriptionStatus === "Yearly Plan (National)") {
        return (
          <>
            {downgradeMessage()}
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmDowngradeViewHandler("Monthly Plan (National)")
              }
            >
              Monthly (National) $11.99
            </ButtonComponent>
            <ButtonComponent
              color="blue" full rounded
              onClick={() => confirmDowngradeViewHandler("Yearly Plan (State)")}
            >
              Yearly (State) $49.99
            </ButtonComponent>
            <ButtonComponent
              color="blue" full rounded
              onClick={() =>
                confirmDowngradeViewHandler("Monthly Plan (State)")
              }
            >
              Monthly (State) $15
            </ButtonComponent>
            {backButton()}
          </>
        );
      }
    } else {
      return <ConfirmDowngradeView />;
    }
  };

  const ConfirmDowngradeView = () => {
    const goBackHandler = () => {
      setConfirmDowngradeView(null);
    };

    const backButton = () => {
      return (
        <ButtonComponent
          color="blue" full rounded onClick={goBackHandler}>
          Go Back
        </ButtonComponent>
      );
    };

    switch (confirmDowngradeView) {
      case "Monthly Plan (National)":
        return (
          <>
            <PlanDetails
              plan="New Plan: Monthly (National) $11.99/Monthly"
              details={planDetailsHandler(confirmDowngradeView)}
            />
            <h6 className="text-sm font-semibold">Start Date: {billingDate}</h6>
            {requestResponseLoading ? (
              <LoadingComponent />
            ) : (
              <ButtonComponent
                color="blue" full rounded
                onClick={downgradeSubscription}

              >
                Confirm
              </ButtonComponent>
            )}
            {backButton()}
          </>
        );
      case "Yearly Plan (State)":
        return (
          <>
            <PlanDetails
              plan="New Plan: Yearly (State) $49.99/Year"
              details={planDetailsHandler(confirmDowngradeView)}
            />

            <h6 className="text-sm font-semibold">Start Date: {billingDate}</h6>
            {requestResponseLoading ? (
              <LoadingComponent />
            ) : (
              <ButtonComponent
                color="blue" full rounded
                onClick={downgradeSubscription}

              >
                Confirm
              </ButtonComponent>
            )}
            {backButton()}
          </>
        );
      case "Monthly Plan (State)":
        return (
          <>
            <PlanDetails
              plan="New Plan: Monthly (State) $15/Month"
              details={planDetailsHandler(confirmDowngradeView)}
            />
            <h6 className="text-sm font-semibold">Start Date: {billingDate}</h6>
            {requestResponseLoading ? (
              <LoadingComponent />
            ) : (
              <ButtonComponent
                color="blue" full rounded
                onClick={downgradeSubscription}

              >
                Confirm
              </ButtonComponent>
            )}
            {backButton()}
          </>
        );

      default:
        break;
    }
  };

  const CancelView = () => {
    return (
      <>
        <h6 className="text-sm font-semibold">Are you sure you want to cancel your Subscription?</h6>
        <h6 className="text-sm font-semibold">
          You will retain all plan features until the end of your current
          billing cycle on: {billingDate}
        </h6>
        {subLoading && !cancelMessage ? (
          <LoadingComponent />
        ) : !subLoading && cancelMessage ? (
          <h6 className="text-sm font-semibold">{cancelMessage}</h6>
        ) : (
          <ButtonComponent className="!mx-1"
            color="blue" full rounded onClick={handleUnsubscribe} >
            Yes I am Sure
          </ButtonComponent>
        )}
        <ButtonComponent
          full rounded
          disabled={subLoading}

          onClick={confirmCancelViewHandler}
        >
          Wait go back
        </ButtonComponent>
      </>
    );
  };


  return (
    <ModalComponent open={props.visible} title="Manage Subscription" onClose={props.onClose}>

      {(() => {
        if (!upgradePlanView && !downgradePlanView && !confirmCancelView) {
          return (
            <>
              <h6 className="text-base font-semibold text-center">
                Next Billing Date: {billingDate}
              </h6>
              <SubscriptionTypeHandler />
              <ButtonComponent
                color="red" full rounded
                onClick={confirmCancelViewHandler}
              >
                Cancel Subscription
              </ButtonComponent>
            </>
          );
        } else if (
          upgradePlanView &&
          !downgradePlanView &&
          !confirmCancelView
        ) {
          return <UpgradeView />;
        } else if (
          !upgradePlanView &&
          downgradePlanView &&
          !confirmCancelView
        ) {
          return <DowngradeView />;
        } else {
          return <CancelView />;
        }
      })()}
    </ModalComponent>
  );
};

export default ManageSubscriptionModal;