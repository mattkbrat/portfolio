import type { Snippet } from "svelte";

export type OnClick = () => void;
export type Content = { text: string; id: string; onClick?: OnClick } | string;

export type WithLinkTabProps = {
	asLinks?: true;
	useHash?: boolean;
	rootUrl: string;
};

export type WithButonTabProps = {
	trackUrl?: true;
	index: {
		index: number;
		onChange: (index: number) => void;
	};
};

export type TabProps = {
	tabs: Content[];
	title: Content;
};

export type TabComponentProps = (TabProps & { children: Snippet }) &
	(WithLinkTabProps | WithButonTabProps);
