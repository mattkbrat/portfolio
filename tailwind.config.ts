import { join } from "path";
import type { Config } from "tailwindcss";
import { skeleton } from "@skeletonlabs/tw-plugin";

export default {
	darkMode: "class",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		join(
			require.resolve("@skeletonlabs/skeleton"),
			"../**/*.{html,js,svelte,ts}",
		),
	],
	safelist: ["bg-primary-400-500-token", "bg-tertiary-400-500-token"],
	theme: {
		extend: {
			animation: {
				"bounce-once": "bounce 1s ease-in-out 1",
			},
		},
	},
	plugins: [
		skeleton({
			themes: {
				preset: [
					{
						name: "vintage",
						enhancements: true,
					},
				],
			},
		}),
	],
} satisfies Config;
