import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const content = await import("../../static/resume.md?raw").then((m) => {
		console.log(m);
		return m.default;
	});

	return { content };
};
