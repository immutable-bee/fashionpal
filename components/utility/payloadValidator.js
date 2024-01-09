const PayloadValidator = (payload, params) => {
  let issueForParam = "";
  const invalidParams = params.some((param) => {
    if (
      payload[param] === null ||
      payload[param] === undefined ||
      payload[param] === ""
    ) {
      issueForParam = param;
      return true;
    }
    return false;
  });

  if (invalidParams) {
    return { status: true, issueForParam: issueForParam };
  } else {
    return { status: false };
  }
};
export default PayloadValidator;
