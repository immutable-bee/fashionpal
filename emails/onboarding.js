const compiledHtml = `<html>
<head>
  <title>Login</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body
  bgcolor="#FFFFFF"
  leftmargin="0"
  topmargin="0"
  marginwidth="0"
  marginheight="0"
>
  <!-- Save for Web Slices (Login.psd) -->
  <table
	id="Table_01"
	width="680"
	height="864"
	border="0"
	cellpadding="0"
	cellspacing="0"
  >
	<tr>
	  <td colspan="3">
		<img src="{{loginImageOne}}" width="680" height="774" alt="" />
	  </td>
	</tr>
	<tr>
	  <td rowspan="2">
		<img src="{{loginImageTwo}}" width="460" height="90" alt="" />
	  </td>
	  <td>
		<a href="https://web.blank.com/" target="_Blank">
		  <img
			src="{{loginImageThree}}"
			width="156"
			height="46"
			border="0"
			alt=""
		/></a>
	  </td>
	  <td rowspan="2">
		<img src="{{loginImageFour}}" width="64" height="90" alt="" />
	  </td>
	</tr>
	<tr>
	  <td>
		<img src="{{loginImageFive}}" width="156" height="44" alt="" />
	  </td>
	</tr>
  </table>
  <!-- End Save for Web Slices -->
</body>
</html>
`;

const onboardingEmail = { compiledHtml: compiledHtml };

export default onboardingEmail;
