import { join } from "path";
import type { Config } from "tailwindcss";
import { skeleton } from "@skeletonlabs/skeleton/plugin";
import { vintage } from "@skeletonlabs/skeleton/themes";

export default {
	darkMode: "class",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		join(
			require.resolve("@skeletonlabs/skeleton-svelte"),
			"../**/*.{html,js,svelte,ts}",
		),
	],
	safelist: ["bg-success-400-600", "bg-error-400-600"],
	theme: {
		extend: {
			animation: {
				"bounce-once": "bounce 1s ease-in-out 1",
			},
		},
	},
	plugins: [
		skeleton({
			themes: [vintage],
		}),
	],
} satisfies Config;
