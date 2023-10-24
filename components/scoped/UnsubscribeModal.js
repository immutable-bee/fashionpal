import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import LoadingComponent from "@/components/utility/loading";
import ModalComponent from "@/components/utility/Modal";
const UnsubscribeModal = (props) => {
  return (
    <ModalComponent
      open={props.isUnsubscribeModalOpen}
      onClose={props.handleSubscriptionModal}
      title="Confirm cancel subscription"
      footer={
        <div id="unsubscribe-modal-foot">
          {!props.loading && !props.cancelMessage ? (
            <div className="flex justify-center">
              <ButtonComponent
                color="blue"
                full
                rounded
                id="confirm-unsubscribe-btn"
                className="!mx-1"
                onClick={props.cancelbtn}
              >
                Yes I&apos;m sure
              </ButtonComponent>
              <ButtonComponent
                full
                rounded
                id="close-unsubscribe-modal-btn"
                className="!mx-1"
                onClick={props.closebtn}
              >
                Go back
              </ButtonComponent>
            </div>
          ) : props.loading && !props.cancelMessage ? (
            <div id="unsubscribe-loading-container">
              <LoadingComponent
                id="unsubscribe-modal-loading"
                color="primary"
                size="md"
              />
            </div>
          ) : (
            <div id="cancel-subscription-message">{props.cancelMessage}</div>
          )}
        </div>
      }
    >
      <>
        <h4 className="text-base">
          Are you sure you want to cancel your Subscription?
        </h4>
      </>
    </ModalComponent>
  );
};

export default UnsubscribeModal;
