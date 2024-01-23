const compiledHtml = `<html>
<head>
  <title>Discount Sale Email Alert</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body
  bgcolor="#FFFFFF"
  leftmargin="0"
  topmargin="0"
  marginwidth="0"
  marginheight="0"
>
  <!-- Save for Web Slices (Discount Sale Email Alert.psd) -->
  <table
    id="Table_01"
    width="680"
    height="1032"
    border="0"
    cellpadding="0"
    cellspacing="0"
  >
    <tr>
      <td colspan="5">
        <img src="{{discountImageOne}}" width="680" height="516" alt="" />
      </td>
    </tr>
    <tr>
      <td rowspan="6">
        <img src="{{discountImageTwo}}" width="108" height="516" alt="" />
      </td>
      <td colspan="3">
        <a href="https://blank.com/" target="_Blank">
          <img
            src="{{discountImageThree}}"
            width="468"
            height="91"
            border="0"
            alt=""
        /></a>
      </td>
      <td rowspan="6">
        <img src="{{discountImageFour}}" width="104" height="516" alt="" />
      </td>
    </tr>
    <tr>
      <td colspan="3">
        <img src="{{discountImageFive}}" width="468" height="36" alt="" />
      </td>
    </tr>
    <tr>
      <td rowspan="4">
        <img src="{{discountImageSix}}" width="73" height="389" alt="" />
      </td>
      <td>
        <a href="https://blank.com/" target="_Blank">
          <img
            src="{{discountImageSeven}}"
            width="311"
            height="66"
            border="0"
            alt=""
        /></a>
      </td>
      <td rowspan="4">
        <img src="{{discountImageEight}}" width="84" height="389" alt="" />
      </td>
    </tr>
    <tr>
      <td>
        <img src="{{discountImageNine}}" width="311" height="16" alt="" />
      </td>
    </tr>
    <tr>
      <td>
        <a href="https://blank.com/" target="_Blank">
          <img
            src="{{discountImageTen}}"
            width="311"
            height="87"
            border="0"
            alt=""
        /></a>
      </td>
    </tr>
    <tr>
      <td>
        <img src="{{discountImageEleven}}" width="311" height="220" alt="" />
      </td>
    </tr>
  </table>
  <!-- End Save for Web Slices -->
</body>
</html>
`;

const discountEmail = { compiledHtml: compiledHtml };

export default discountEmail;
