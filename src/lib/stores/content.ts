import { derived, writable } from "svelte/store";

type Heading = {
	heading: string;
	href: string;
	id: string;
};

const defaultHeadings: Heading[] = [];
export const headings = writable(defaultHeadings);

type PositionManager = { lastChanged: number; position: string };

export const minChangeDiff = 10;
export const positionManager = writable({
	lastChanged: 0,
	position: "",
} as PositionManager);
export const position = derived(positionManager, (p) => p.position);
export const changePosition = (
	id: string,
	pm: PositionManager,
	force = false,
) => {
	if (!force && pm.position === id) return;
	const now = new Date().getTime();
	if (now - pm.lastChanged < minChangeDiff) {
		// console.log("Not enough time elapsed", id);
		return;
	}
	positionManager.set({ lastChanged: now, position: id });
};
