import { browser } from "$app/environment";

export const updateSelectionClasses = (
	position: string,
	headings: { id: string }[],
) => {
	if (!browser) return;
	const e = document.getElementById(position);
	if (e) {
		e.classList.add("selected-heading");
	}

	for (const heading of headings.filter((h) => h.id !== position)) {
		if (!heading || !heading.id) {
			return;
		}
		const e = document.getElementById(heading.id);
		if (!e) {
			return;
		}
		e.classList.remove("selected-heading");
	}
};
