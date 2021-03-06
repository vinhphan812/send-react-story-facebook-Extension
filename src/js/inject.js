console.clear();
console.debug("🚀 Facebook React Extension by Vinh Phan 🚀");

if (chrome) {
	const regexs = [
			/(?<=USER_ID":")(.*)(?=","NAME)/g,
			/(?<=")(.{29})(?=","async)/g,
			/(?<=jazoest=)(\d*)(?=",")/g,
		],
		body = document.querySelector("html").innerHTML;

	let fb_dtsg = "",
		jazoest = "";

	const id = body.match(regexs[0])[0].split('"')[0];
	if (body.match(/token/g)) {
		fb_dtsg = body.match(regexs[1])[0];
		jazoest = body.match(regexs[2])[0];
	}
	try {
		const port = chrome.runtime.connect(chrome.runtime.id, {
			name: "react-fb",
		});
		port.postMessage({
			success: true,
			type: "user",
			fb_dtsg,
			jazoest,
			id,
		});

		const sendPort = setInterval(() => {
			sendDataStory(port);
		}, 100);
		port.onDisconnect.addListener(() => {
			clearInterval(sendPort);
		});
	} catch (error) {}
}

function sendDataStory(port) {
	try {
		const selected = [
			"div.k4urcfbm.l9j0dhe7.taijpn5t.datstx6m.j83agx80.bp9cbjyn",
			".q9iuea42.qs4al1v0.eprw1yos.a4d05b8z.sibfvsnu.px9q9ucb.j2ut9x2k.p4hiznlx.a8c37x1j.qypqp5cg.bixrwtb6.q676j6op",
			".oajrlxb2.gs1a9yip.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.q9uorilb.mg4g778l.btwxx1t3.pfnyh3mw.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.abiwlrkh.p8dawk7l.d2edcug0",
		];

		const hashId = document
				.querySelector(selected[0])
				.getAttribute("data-id"),
			avt = document.querySelector(selected[1])?.getAttribute("src"),
			name = document.querySelector(selected[2])?.textContent;

		if (hashId && name && avt)
			port.postMessage({
				hashId,
				name,
				avt,
				type: "story",
				success: true,
			});
		else port.postMessage({ success: false });
	} catch (error) {
		console.log(error);
	}
}
