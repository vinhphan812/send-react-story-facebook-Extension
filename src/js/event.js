chrome.tabs.getSelected(null, function (tab) {
	if (tab.url.includes("https://www.facebook.com/stories/"))
		chrome.tabs.executeScript(null, { file: "./src/js/inject.js" });
	else notDetect();
});

chrome.runtime.onConnect.addListener(listenPort);

// chrome.runtime.onConnectExternal.addListener(listenPort);

// chrome.runtime.onMessage.addListener((message) => {
// 	console.log("onMessage");
// 	console.log(message);
// });

// chrome.runtime.onMessageExternal.addListener((message) => {
// 	console.log("ex");
// 	console.log(message);
// });

function listenPort(port) {
	console.log("connect port " + port.name);

	port.onMessage.addListener(function ({
		hashId,
		name,
		avt,
		fb_dtsg,
		jazoest,
		id,
		success,
	}) {
		console.log("1");
		if (!success) return notDetect();
		const threadId = decodeBase64(hashId).split(":").pop();

		fb.fb_dtsg = fb_dtsg;
		fb.jazoest = jazoest;
		fb.actor_id = id;
		fb.threadId = threadId;

		renderUser(avt, name, threadId);
	});
}

function notDetect() {
	$("#story").html(
		"<div class='not-detect'>⚠️ Không phát hiện story!!!</div>"
	);
}
