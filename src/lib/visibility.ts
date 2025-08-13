type OnVisibileParams = {
	element: HTMLElement;
	callback: ({ id, status }: { id: string; status: boolean }) => void;
	visibilities: { id: string; visible: boolean }[];
};

export const onVisible = ({
	element,
	callback,
	visibilities,
}: OnVisibileParams) => {
	visibilities.push({
		id: element.id,
		visible: false,
	});
	new IntersectionObserver((entries) => {
		for (const entry of entries) {
			const index = visibilities.findIndex((v) => v.id === element.id);
			const isVisible = entry.intersectionRatio > 0;
			visibilities[index].visible = isVisible;
		}
	}).observe(element);
	if (!callback)
		return new Promise((r) => {
			callback = r;
		});
};
