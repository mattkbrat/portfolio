<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import SvelteMarkdown from 'svelte-markdown';
	import ArchivedResume from '$lib/archived-resume.svelte';

	import TableOfContents from '$lib/TableOfContents.svelte';
	import { goto } from '$app/navigation';

	let resumeContent = '';

	let headings: string[] = [];
	let frontmatter = '';
	let position = '';

	let visibilities: { id: string; visible: boolean }[] = [];

	const setSelected = (id: string, selected = true) => {
		const e = document.getElementById(id);
		if (!e) return;
		if (selected) {
			e.classList.add('selected-heading');
		} else {
			e.classList.remove('selected-heading');
		}
	};

	$: if (visibilities) {
		const lastVisible = visibilities.find((v) => v.visible);
		if (lastVisible) {
			position = `#${lastVisible.id}`;
			setSelected(lastVisible.id);
		}

		visibilities.forEach((v) => {
			if (v.id === lastVisible?.id) {
				return;
			}
			setSelected(v.id, false);
		});

		// visibilities.forEach((v) => {
		// 	const e = document.getElementById(v.id);
		// 	if (!e) return;
		// 	if (v.visible) {
		// 		e.classList.add('selected-heading');
		// 	} else {
		// 		e.classList.remove('selected-heading');
		// 	}
		// });
	}

	function onVisible(
		element: HTMLElement,
		callback: ({ id, status }: { id: string; status: boolean }) => void
	) {
		visibilities.push({
			id: element.id,
			visible: false
		});
		new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				const index = visibilities.findIndex((v) => v.id === element.id);
				const isVisible = entry.intersectionRatio > 0;
				visibilities[index].visible = isVisible;
			});
		}).observe(element);
		if (!callback) return new Promise((r) => (callback = r));
	}

	const handleHeadingChange = (manualFilter?: string) => {
		Array.from(document.getElementsByTagName('h2')).forEach((e) => {
			const filter = manualFilter || $page.url.hash.toLowerCase();
			const lookup = e.id.toLowerCase();

			const isSelected = lookup && filter.endsWith(lookup);
			if (isSelected) {
				e.classList.add('selected-heading');
				!manualFilter && e.scrollIntoView();
			} else {
				e.classList.remove('selected-heading');
			}
		});
	};

	$: if (resumeContent.length > 0 && headings.length == 0) {
		setTimeout(() => {
			const docHeadings = document.getElementsByTagName('h2');

			const asArray = Array.from(docHeadings);

			asArray.forEach((e) => {
				if (!e.id) return;
				onVisible(e, () => {});
			});

			headings = asArray.map((h) => h.id).filter(Boolean);
		}, 150);
	}

	onMount(() => {
		fetch('https://raw.githubusercontent.com/mattkbrat/portfolio/main/README.md')
			.then(async (res) => {
				const allContent = await res.text();

				const [, properties, ...content] = allContent.split('---');

				frontmatter = properties.trim().split('\n').join('\n\n');
				resumeContent = content.join('\n');
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
			<div class="block lg:hidden">
				<TableOfContents style={'inline'} {headings} {position} />
			</div>
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

<div class="right-0 bottom-0 hidden lg:block fixed">
	<TableOfContents style="sticky" {headings} {position} />
</div>
