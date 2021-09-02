chrome.tabs.getSelected(null, function (tab) {
	if (tab.url.includes("https://www.facebook.com/stories/"))
		chrome.tabs.executeScript(null, {
			file: "./src/js/inject.js",
		});
	else notDetect();
});

chrome.runtime.onConnect.addListener(listenPort);

function listenPort(port) {
	console.log("connect port " + port.name);

	port.onMessage.addListener(function (dt) {
		if (!dt.success) return notDetect();

		if (dt.type == "user") {
			fb.fb_dtsg = dt.fb_dtsg;
			fb.jazoest = dt.jazoest;
			fb.actor_id = dt.id;
			return;
		}
		if (fb.avt == dt.avt && fb.name == dt.name && fb.hashId == dt.hashId)
			return;

		fb.hashId = dt.hashId;
		fb.avt = dt.avt;
		fb.name = dt.name;
		fb.threadId = decodeBase64(dt.hashId).split(":").pop();
		renderUser();
	});
}

function notDetect() {
	fb.hashId = "";
	fb.threadId = "";
	fb.avt = "";
	fb.name = "";
	if (!$(".not-detect").length)
		$("#story").html(
			"<div class='not-detect'>⚠️ Không phát hiện story!!!</div>"
		);
}
