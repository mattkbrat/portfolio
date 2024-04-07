<script lang="ts">
	export let headings: string[] = [];
	export let style: 'sticky' | 'inline' = 'inline';

	$: isInline = style === 'inline';

	export let position = '';
</script>

<section id="table-of-contents" class="print:hidden">
	<h3>{isInline ? 'Table of Contents' : 'TOC'}</h3>
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
</section>
