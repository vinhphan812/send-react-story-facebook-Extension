class Facebook {
	server = "https://m.facebook.com";
	threadId;
	storyId;
	fb_dtsg;
	jazoest;
	actor_id;
	token;

	regex = {
		token: /(?<=accessToken\\":\\")(.*)(?=\\",\\"useLocalFilePreview)/g,
		userId: /(?<=ACCOUNT_ID\\":\\")(.*)(?=\\",\\"USER_ID)/g,
		title: /(?<=<title>)(.*)(?=<\/title>)/g,
		thread: /(?<=threadId:\")([0-9]*)(?=\")/g,
		fbDtsg: /(?<=name="fb_dtsg" value=\")(.*)(?=\" autocomplete=\"off\" \/><input)/g,
		jazoest: /(?<=name="jazoest" value=\")(.*)(?=\" autocomplete=\"off\" \/><div)/g,
	};
	constructor() {}
	requestServer(data = { path: "/", form: "" }) {
		return new Promise(async (resolve, reject) => {
			const option = {
				method: typeof data.form === "object" ? "POST" : "GET",
				headers: {
					"Content-Type":
						"application/x-www-form-urlencoded;charset=UTF-8",
				},
			};
			if (data.form) {
				option.body = formData(data.form);
			}
			const res = await fetch(this.server + data.path, option);
			resolve(await res.text());
		});
		function formData(details) {
			var formBody = [];
			for (var property in details) {
				var encodedKey = encodeURIComponent(property);
				var encodedValue = encodeURIComponent(details[property]);
				formBody.push(encodedKey + "=" + encodedValue);
			}
			return formBody.join("&");
		}
	}
	sendReactStory(react) {
		return new Promise(async (resolve, reject) => {
			if (!this.fb_dtsg || !this.jazoest) await this.getField();
			const { threadId, fb_dtsg, jazoest, actor_id } = this;

			const queries = JSON.stringify({
				o0: {
					doc_id: "1459763854077111",
					query_params: {
						input: {
							client_mutation_id: client_mutation_id(),
							actor_id,
							thread_id: threadId,
							message: react,
							story_reply_type: "LIGHT_WEIGHT",
							is_lightweight_reaction: true,
							lightweight_reaction_actions: {
								reaction: react,
								offsets: [0],
							},
						},
					},
				},
			});

			const res = await this.requestServer({
				path: "/api/graphqlbatch",
				form: {
					fb_dtsg,
					jazoest,
					queries,
				},
			});
			const { error, o0 } = JSON.parse(res.split("\n")[0]);

			if (error) {
				resolve({
					succes: false,
					msg: error.debug_info,
					description: error.description,
					errorCode: error.code,
				});
			} else resolve({ success: true, res: o0 });
		});
		function client_mutation_id() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
				/[xy]/g,
				function (a) {
					var b = (Math.random() * 16) | 0;
					a = a == "x" ? b : (b & 3) | 8;
					return a.toString(16);
				}
			);
		}
	}
}

const fb = new Facebook();
