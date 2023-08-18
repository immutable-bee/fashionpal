import { Modal, Button } from "@nextui-org/react";

const TCModal = (props) => {
  return (
    <Modal
      scroll
      className="modal-base-container"
      open={props.viewstate}
      onClose={props.closehandler}
      width="40vw"
    >
      <Modal.Header className="modal-header">
      <h4 className="modal-title">Terms &amp; Conditions</h4>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <p>
          Terms and Conditions for Membership with Buy Local Books Network
          <br></br>
          Please read these Terms and Conditions carefully before submitting
          your application for membership with the Buy Local Books Network. By
          submitting your application, you agree to be bound by these Terms and
          Conditions.
          <br></br>Application and Membership:<br></br>The Buy Local Books
          Network is an exclusive network for bookstores in the United States.
          Upon submission of your application, you will be able to login to the
          Buy Local Books Network. However, you will not have access to sell or
          buy books until the approval process is complete. We reserve the right
          to refuse membership to any bookstore at our sole discretion.<br></br>
          Access to the Buy Local Books Network:<br></br>Upon approval of your
          membership, you will have access to the Buy Local Books Network&apos;s
          features. This access is non-transferable and intended solely for your
          use.<br></br>Listing and Selling Books:<br></br>
          As a member of the Buy Local Books Network, you will have the ability
          to list and sell books through the Network. You will be responsible
          for complying with all applicable laws and regulations related to the
          sale of books. We will not be liable for any violations committed by
          you.<br></br>
          Service Fees:<br></br>There is no fee associated with submitting an
          application for membership with the Buy Local Books Network. However,
          we reserve the right to charge service fees for the use of the
          Network. Any service fees will be clearly disclosed to you.<br></br>
          Listing Fees:
          <br></br>There are no listing fees associated with listing books for
          sale through the Network.
          <br></br>Payment Processing:<br></br>We use a third-party payment
          processor to handle all transactions made through the Buy Local Books
          Network. We are not responsible for any issues related to payment
          processing, including but not limited to fraudulent charges,
          chargebacks, or disputes.
          <br></br>Intellectual Property:<br></br>All content included on the
          Buy Local Books Network, including text, graphics, logos, images, and
          software, is the property of our company or its suppliers and
          protected by copyright laws. The content may not be used or reproduced
          without express written permission from us.<br></br>Limitation of
          Liability:<br></br>We will not be liable for any damages arising out
          of your membership with the Buy Local Books Network, including but not
          limited to lost profits, direct or indirect damages, or consequential
          damages.<br></br>Governing Law and Jurisdiction:<br></br>These terms
          and conditions shall be governed by and interpreted in accordance with
          the laws of the United States of America. Any dispute arising from
          these terms and conditions shall be subject to the exclusive
          jurisdiction of the competent courts in the United States of America.
          <br></br>Changes to Terms and Conditions:<br></br>
          We reserve the right to modify these Terms and Conditions at any time
          without prior notice. Any changes will be posted on the Buy Local
          Books Network and will apply to all members.
          <br></br>
          <br></br>Buy Local Books Network Privacy Policy<br></br>At Buy Local
          Books Network, we are committed to protecting your privacy. This
          Privacy Policy outlines the types of information we collect, how we
          use that information, and your rights with respect to your personal
          information.<br></br>
          Information Collection:<br></br>
          We collect certain personally identifiable information, such as your
          name, email address, and phone number, when you submit an application
          for membership. We do not sell or rent your personal information to
          third parties. In addition, we automatically collect certain
          non-personally identifiable information, such as your IP address,
          browser type, and operating system, when you visit our website. We may
          use this information to analyze trends, track usage, and improve our
          website and services. Use of Information:<br></br>We use personal
          information collected through the Buy Local Books Network for the
          following purposes:<br></br>- To process your application for
          membership<br></br>- To communicate with you regarding your membership
          and related services<br></br>- To provide and improve our services
          <br></br>- To comply with applicable laws and regulations<br></br>
          Data Sharing:<br></br> We may share your personal information with
          third-party service providers who perform services on our behalf, such
          as payment processing, website hosting, and email delivery. We require
          these service providers to maintain the confidentiality of your
          personal information and not use it for any other purpose. We may also
          share your personal information with law enforcement, government
          officials, or other third parties in response to a subpoena, court
          order, or other legal process, or if we believe disclosure is
          necessary or appropriate to protect our rights, property, or safety,
          or the rights, property, or safety of our customers or others.
          <br></br>Data Retention:<br></br>We retain personal information for as
          long as necessary to fulfill the purposes outlined in this Privacy
          Policy, unless a longer retention period is required or permitted by
          law.<br></br>Your Rights:<br></br>Under certain circumstances, you
          have the right to request access to and deletion of your personal
          information, as well as the right to object to processing and to data
          portability. You also have the right to opt-out of certain types of
          communications from us.<br></br>Security: We take reasonable measures
          to protect your personal information from unauthorized access, use,
          disclosure, and destruction.<br></br>Changes to this Privacy Policy:
          <br></br>We reserve the right to modify this Privacy Policy at any
          time by posting an updated version on our website. If we make material
          changes to this Privacy Policy, we will notify you by email or by
          posting a notice on our website.
        </p>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        {" "}
        <Button onClick={props.closebtn} id="modal-close-btn">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TCModal;
