<script lang="ts">
export let headings: string[] = [];
export let style: "sticky" | "inline" = "inline";

$: isInline = style === "inline";

export let position = "";
</script>

<section id="table-of-contents" class="print:hidden">
	<h3>{isInline ? 'Table of Contents' : 'TOC'}</h3>
	{#if isInline}
		<div class="flex flex-row flex-wrap items-center">
			{#each headings as heading, i}
				{@const heading_text = heading.replace('-', ' ')}
				<a
					class="flex-1 uppercase px-4 py-2 text-center outline-primary-200 outline-2 flex flex-row gap-2 justify-center"
					class:text-primary-400-500-token={position.includes(heading)}
					href={`#${heading}`}
				>
					<span class="text-sm">{i + 1})</span>
					{heading_text}
				</a>
			{/each}
		</div>

		<hr class="w-full h-2" />
	{:else}
		<ul class:list-dict={isInline} class:list-none={!isInline} class:uppercase={!isInline}>
			{#each headings as heading}
				{@const heading_text = heading.replace('-', ' ')}
				<li class:ml-0={!isInline}>
					<a class:text-primary-400-500-token={position.includes(heading)} href={`#${heading}`}>
						{heading_text}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
