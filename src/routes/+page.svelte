<script lang="ts">
import { browser } from "$app/environment";
import { goto, replaceState } from "$app/navigation";
import SvelteMarkdown from "$lib/SvelteMarkdown.svelte";
import { onMount } from "svelte";
import "../lib/styles/main.css";
import {
	TableOfContents,
	updateSelectionClasses,
} from "$lib/features/portfolio";
import { onVisible } from "$lib/visibility";
import { page } from "$app/state";
import {
	minChangeDiff,
	changePosition,
	headingIsVisible,
	headings,
	positionManager,
	position,
} from "$lib/features/portfolio/stores/content";
const { data } = $props();
const documentData = $state(data.content);
const resume = $derived(documentData.split("---").map((s) => s.trim()));
const [_, frontmatter, summary, resumeContent] = $derived(
	resume.length === 4 ? resume : ["", "", ""],
);

let hasLoaded: boolean | string = false;

const visibilities: { id: string; visible: boolean }[] = $state([]);

$effect(() => {
	if (!visibilities.length || !hasLoaded) return;

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
		updateSelectionClasses($position, $headings);
	}
});

$effect(() => {
	const current = visibilities.find((i) => i.id === "Links")?.visible || false;
	if ($headingIsVisible === current) return;
	headingIsVisible.set(current);
});

$effect(() => {
	if (!resumeContent.length || hasLoaded) return;

	const docHeadings = document.getElementsByTagName("h2");

	const asArray = Array.from(docHeadings).filter((h) => h.id);

	const profileLinks = document
		.getElementById("matthewbratrsovsky")
		?.closest("div")?.children?.[1];

	if (profileLinks) {
		const previousHeading =
			profileLinks.previousElementSibling as HTMLHeadingElement;
		previousHeading.id = "Links";
		if (previousHeading) {
			asArray.unshift(previousHeading);
		}
		profileLinks.id = "profile-links";
	}
	for (const heading of asArray) {
		onVisible({
			element: heading,
			callback: () => {},
			visibilities,
		});
		heading.classList.add("margin-top-nav");
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
	styleAnchors();
	const heading = document.getElementsByTagName("h1").item(0);

	if (heading) {
		onVisible({
			element: heading,
			callback: () => {},
			visibilities,
		});
	}
	hasLoaded = true;
});

$effect(() => {
	const hash = page.url.hash;
	if (!hash) {
		return;
	}
	const id = hash.slice(1);
	changePosition(id, $positionManager, true);
	const element = document.getElementById(id);
	if (document.getElementById(id)?.checkVisibility()) return;
	element?.scrollIntoView();
});

function styleAnchors() {
	const anchors = Array.from(
		document.getElementsByTagName("a"),
	) as HTMLAnchorElement[];
	const filtered = anchors.filter((a) => {
		const { hostname } = new URL(a.href);
		return (
			!hostname.includes("mattkbrat.com") && !hostname.includes("localhost")
		);
	});
	for (const a of filtered) {
		a.classList.add("external-link");
		a.target = "_blank";
	}
}

$effect(() => {
	if (page.url.hash || !browser) return;
	goto("#profile-links", { replaceState: true });
});

onMount(() => {
	console.log(
		"%cWell, Howdy! : - )",
		"color: blue; font-family: sans-serif; font-size: 1em; font-weight: bolder; text-shadow: #000 1px 1px;",
	);
	if (browser) {
		window.addEventListener("hashchange", () => {
			const { hash } = window.location;
			changePosition(hash.slice(1), $positionManager, true);
		});
	}
});
</script>

<svelte:head>
	<title>Resume - Matthew Bratrsovsky</title>
	<meta
		name="description"
		content="Full stack developer with a passion for collaboration, creativity and colleagues who share similar values. I am most practiced in TypeScript, Rust and Postgres and I love learning new technologies."
	/>
</svelte:head>

<div class="flex" id="resume-body">
	<div
		class="container h-full mx-auto pt-4 flex justify-center items-center text-lg/6"
		id="content-container"
	>
		{#if resumeContent}
			<div id="resume-content" class="gap-6 space-y-6">
				<div class="block lg:hidden">
					<TableOfContents style={'inline'} />
				</div>
				<SvelteMarkdown markdown={`${summary}\n${resumeContent}`} id="content" />

				<div class="outline outline-2 outline-offset-2 px-4 text-sm print:hidden">
					<h2 class="!text-sm underline">Frontmatter</h2>
					<ul>
						{#each frontmatter.split('\n') as line}
							<li>
								{line}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
	<div class="hidden lg:block fixed left-32">
		<TableOfContents style="sticky" />
	</div>
</div>
