<script lang="ts">
import { onMount } from "svelte";

import ArchivedResume from "$lib/archived-resume.svelte";

import TableOfContents from "$lib/TableOfContents.svelte";
import SvelteMarkdown from "$lib/SvelteMarkdown.svelte";

import {
	headings,
	position,
	changePosition,
	positionManager,
	minChangeDiff,
} from "$lib/stores/content";

let resumeContent = "";

let frontmatter = "";
let hasLoaded: boolean | string = false;

import { page } from "$app/stores";
import { replaceState } from "$app/navigation";
import { browser } from "$app/environment";

let visibilities: { id: string; visible: boolean }[] = [];

const updateSelectionClasses = () => {
	if (!browser) return;
	const e = document.getElementById($position);
	if (e) {
		e.classList.add("selected-heading");
	}

	for (const heading of $headings.filter((h) => h.id !== $position)) {
		if (!heading || !heading.id) {
			// console.warn('Invalid heading', heading);
			return;
		}
		const e = document.getElementById(heading.id);
		if (e) {
			// console.log('unselecting', heading, $position);
			e.classList.remove("selected-heading");
		} else {
			// console.log('No element by id', heading.id);
		}
	}
};

$: if (visibilities && hasLoaded) {
	const lastVisible = visibilities.find((v) => v.visible);
	if (
		lastVisible &&
		((typeof hasLoaded === "string" && lastVisible.id !== hasLoaded) ||
			!!hasLoaded)
	) {
		const now = new Date().getTime();
		if (now - $positionManager.lastChanged > minChangeDiff) {
			const lastVisibleId = lastVisible.id;
			const asHref = `/#${lastVisibleId}`;
			replaceState(asHref, "");
			changePosition(lastVisibleId, $positionManager);
		}
		updateSelectionClasses();
	}
}

function onVisible(
	element: HTMLElement,
	callback: ({ id, status }: { id: string; status: boolean }) => void,
) {
	visibilities.push({
		id: element.id,
		visible: false,
	});
	new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const index = visibilities.findIndex((v) => v.id === element.id);
			const isVisible = entry.intersectionRatio > 0;
			visibilities[index].visible = isVisible;
		});
	}).observe(element);
	if (!callback) return new Promise((r) => (callback = r));
}

// $: if ($page.url.hash) {
// 	setSelected($page.url.hash.slice(1));
// }

$: if (resumeContent.length > 0 && $headings.length === 0) {
	setTimeout(() => {
		const docHeadings = document.getElementsByTagName("h2");

		const asArray = Array.from(docHeadings).filter((h) => h.id);

		const profileLinks = document.getElementById("profile-links");

		if (profileLinks instanceof HTMLHeadingElement) {
			asArray.unshift(profileLinks);
		}
		// asArray.push("profile-links");
		for (const heading of asArray) {
			onVisible(heading, () => {});
		}
		headings.set(
			asArray
				.map((h) => {
					return {
						heading: h.innerText.length < 10 ? h.innerText : h.id,
						href: `#${h.id}`,
						id: h.id,
					};
				})
				.filter(Boolean),
		);
		const { hash } = window.location;
		if (hash) {
			const id = hash.slice(1);
			changePosition(id, $positionManager, true);
			const element = document.getElementById(hash.slice(1));
			element?.scrollIntoView();
			hasLoaded = id;
		}
	}, 150);
}

const styleAnchors = () => {
	const anchors = Array.from(
		document.getElementsByTagName("a"),
	) as HTMLAnchorElement[];

	anchors
		.filter(
			(a) =>
				(a.href.includes("https") || a.href.includes("mailto")) &&
				a.id !== "github-corner",
		)
		.forEach((a) => {
			a.classList.add("external-link");
			a.target = "_blank";
		});
};

$: if (!$page.url.hash && browser) {
	goto("#profile-links", { replaceState: true });
}
onMount(() => {
	console.log(
		"%cWell, Howdy! : - )",
		"color: blue; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;",
	);
	window.addEventListener("hashchange", () => {
		const { hash } = window.location;
		changePosition(hash.slice(1), $positionManager, true);
	});
	fetch("https://raw.githubusercontent.com/mattkbrat/portfolio/main/README.md")
		.then(async (res) => {
			const allContent = await res.text();

			const [, properties, ...content] = allContent.split("---");

			frontmatter = properties.trim().split("\n").join("\n\n");
			resumeContent = content.join("\n");
		})
		.then(styleAnchors);
});
</script>

<svelte:head>
	<title>Resume - Matthew Bratrsovsky</title>
	<meta
		name="description"
		content="Full stack developer with a passion for collaboration, creativity and colleagues who share similar values. I am most practiced in TypeScript, Rust and Postgres and I love learning new technologies."
	/>
</svelte:head>

<div class="flex">
	<div class="container h-full mx-auto pt-4 flex justify-center items-center text-lg/6">
		{#if resumeContent}
			<div id="resume-content" class="gap-6 space-y-6">
				<div class="block lg:hidden">
					<TableOfContents style={'inline'} {headings} {position} />
				</div>
				<SvelteMarkdown markdown={resumeContent} id="content" />

				<div class="outline outline-2 outline-offset-2 px-4 text-sm print:hidden">
					<h2 class="!text-sm underline">Frontmatter</h2>
					<SvelteMarkdown markdown={frontmatter} id="frontmatter" />
				</div>
			</div>
		{:else}
			<div id="resume-content" class="flex flex-col gap-4">
				<ArchivedResume />
			</div>
		{/if}
	</div>
	<div class="hidden lg:block fixed left-32">
		<TableOfContents style="sticky" />
	</div>
</div>
