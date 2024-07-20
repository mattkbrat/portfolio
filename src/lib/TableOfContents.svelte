<script lang="ts">
import Toc from "./icons/TOC.svelte";
import { headings, position } from "$lib/stores/content";

export let style: "sticky" | "inline" = "inline";

$: isInline = style === "inline";
</script>

<section id="table-of-contents" class="print:hidden group flex flex-col">
	<div class={isInline ? 'hidden' : 'group-hover:opacity-25 transition-opacity'}>
		<Toc />
	</div>
	<div class={isInline ? 'contents' : 'hidden group-hover:contents'}>
		{#if isInline}
			<div class="flex flex-row flex-wrap items-center">
				{#each $headings as { heading, href }, i}
					<a
						class="flex-1 uppercase px-4 py-2 text-center outline-primary-200 outline-2 flex flex-row gap-2 justify-center"
						class:text-primary-400-500-token={href === `#${$position}`}
						{href}
					>
						<span class="text-sm">{i + 1})</span>
						{heading}
					</a>
				{/each}
			</div>

			<hr class="w-full h-2" />
		{:else}
			<ul
				class:list-dict={isInline}
				class:list-none={!isInline}
				class:uppercase={!isInline}
				class="bg-gray-200/75 dark:bg-gray-900/75"
			>
				{#each $headings as { heading, href }}
					<li class:ml-0={!isInline} class="dark:hover:text-gray-200 hover:text-gray-800">
						<a class:text-primary-400-500-token={href === `#${$position}`} {href}>
							{heading}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<span class:hidden={isInline} class="dark:text-gray-200">{$position}</span>
