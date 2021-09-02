if (chrome) {
	const port = chrome.runtime.connect(chrome.runtime.id, {
		name: "react-fb",
	});

	const regexs = [
		/(?<=,"profileSwitcherEligibleProfiles":)(.*)(?="name":")/g,
		/(?<=fb_dtsg","value":")(.*)(?="device_switchable_accounts)/g,
		/\"id\":\"|\",\"name\":/g,
		/,"value":"|"},{"name":"/g,
	];
	var body = document.body.innerHTML;
	let fb_dtsg = "",
		jazoest = "";

	const id = body.match(regexs[0])[0].split(regexs[2])[1];
	if (body.match(/fb_dtsg/g)) {
		const [a, b, c] = body.match(regexs[1])[0].split(regexs[3]);
		fb_dtsg = a;
		jazoest = c;
	}

	sendDataStory(port, fb_dtsg, jazoest, id);
	document.body.onclick = function () {
		setTimeout(function () {
			sendDataStory(port, fb_dtsg, jazoest, id);
		}, 200);
	};
}

function sendDataStory(port, fb_dtsg, jazoest, id) {
	try {
		const selected = [
			"div.k4urcfbm.l9j0dhe7.taijpn5t.datstx6m.j83agx80.bp9cbjyn",
			".q9iuea42.qs4al1v0.eprw1yos.a4d05b8z.sibfvsnu.px9q9ucb.j2ut9x2k.p4hiznlx.a8c37x1j.qypqp5cg.bixrwtb6.q676j6op",
			".oajrlxb2.gs1a9yip.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.q9uorilb.mg4g778l.btwxx1t3.pfnyh3mw.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.abiwlrkh.p8dawk7l.d2edcug0",
		];

		const hashId = document
				.querySelector(selected[0])
				.getAttribute("data-id"),
			avt = document.querySelector(selected[1]).getAttribute("src"),
			name = document.querySelector(selected[2]).textContent;

		port.postMessage(
			{ hashId, name, avt, fb_dtsg, jazoest, id, success: true },
			function (res) {
				console.log(res);
			}
		);
	} catch (error) {
		port.postMessage({ false: true });
	}
}
