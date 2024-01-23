const compiledHtml = `<html>
<head>
<title>Error</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<!-- Save for Web Slices (Error.psd) -->
<table id="Table_01" width="680" height="864" border="0" cellpadding="0" cellspacing="0">
	<tr>
		<td colspan="3">
			<img src="{{errorImageOne}}" width="680" height="579" alt=""></td>
	</tr>
	<tr>
		<td rowspan="2">
			<img src="{{errorImageTwo}}" width="122" height="285" alt=""></td>
		<td>
			<a href="https://web.blank.com/" target="_Blank">
				<img src="{{errorImageThree}}" width="279" height="107" border="0" alt=""></a></td>
		<td rowspan="2">
			<img src="{{errorImageFour}}" width="279" height="285" alt=""></td>
	</tr>
	<tr>
		<td>
			<img src="{{errorImageFive}}" width="279" height="178" alt=""></td>
	</tr>
</table>
<!-- End Save for Web Slices -->
</body>
</html>`;

const errorEmail = { compiledHtml: compiledHtml };

export default errorEmail;
