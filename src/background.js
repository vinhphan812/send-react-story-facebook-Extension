chrome.webRequest.onBeforeSendHeaders.addListener(
	function (details) {
		//console.log(JSON.stringify(details));
		var headers = details.requestHeaders,
			blockingResponse = {};

		console.log(details);

		for (var i = 0, l = headers.length; i < l; ++i) {
			if (headers[i].name == "Origin") {
				headers[i].value = "https://www.facebook.com";
				console.log(headers[i].value);
				break;
			}
		}

		blockingResponse.requestHeaders = headers;
		return blockingResponse;
	},
	{ urls: ["https://m.facebook.com/*"] },
	["extraHeaders", "requestHeaders", "blocking"]
);
// ["<all_urls>"]
