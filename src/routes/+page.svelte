<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
import { onMount } from "svelte";
import { page } from "$app/stores";

import SvelteMarkdown from "svelte-markdown";
import ArchivedResume from "$lib/archived-resume.svelte";

let resumeContent = "";

let headings: string[] = [];
let frontmatter = "";

const handleHeadingChange = () => {
	Array.from(document.getElementsByTagName("h2")).forEach((e) => {
		const filter = $page.url.hash.toLowerCase();
		const lookup = e.id.toLowerCase();

		const isSelected = lookup && filter.endsWith(lookup);
		if (isSelected) {
			e.classList.add("selected-heading");
			e.scrollIntoView();
		} else {
			e.classList.remove("selected-heading");
		}
	});
};

$: if (resumeContent.length > 0 && headings.length == 0) {
	setTimeout(() => {
		const docHeadings = document.getElementsByTagName("h2");
		headings = Array.from(docHeadings)
			.map((h) => h.id)
			.filter(Boolean)
			.slice(1);
	}, 150);
}

onMount(() => {
	fetch("https://raw.githubusercontent.com/mattkbrat/portfolio/main/README.md")
		.then(async (res) => {
			const allContent = await res.text();

			const [, properties, ...content] = allContent.split("---");

			frontmatter = properties.trim().split("\n").join("\n\n");
			resumeContent = content.join("\n");
		})
		.then(handleHeadingChange);
});

$: if ($page.url.hash) {
	handleHeadingChange();
}
</script>

<div class="container h-full mx-auto pt-4 flex justify-center items-center text-lg/6">
	{#if resumeContent}
		<div class="space-y-5">
			<h1 class="h1">Matthew Bratrsovsky</h1>

			<section id="table-of-contents" class="print:hidden">
				<h3>Table of Contents</h3>
				<ul class="list-disc">
					{#each headings as heading}
						{@const heading_text = heading.replace('-', ' ')}
						<li>
							<a href={`#${heading}`}>
								{heading_text}
							</a>
						</li>
					{/each}
				</ul>
			</section>
			<SvelteMarkdown source={resumeContent} />

			<div class="outline outline-2 outline-offset-2 px-4 text-sm print:hidden">
				<h2 class="!text-sm underline">Frontmatter</h2>
				<SvelteMarkdown source={frontmatter} />
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<ArchivedResume />
		</div>
	{/if}
</div>
