import { derived, writable } from "svelte/store";

export const isDark = writable(false);

export const svgStroke = derived(isDark, (isDark) =>
	isDark ? "black" : "white",
);
