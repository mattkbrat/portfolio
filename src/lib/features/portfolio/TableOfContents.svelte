<script lang="ts">
import Toc from "$lib/icons/TOC.svelte";
import { headings, position } from "./stores/content";
</script>

<section
	id="table-of-contents"
	class="group hidden items-center gap-x-2 hover:flex-col hover:items-start xl:flex print:hidden"
>
	<div class={'transition-opacity group-hover:opacity-25'}>
		<Toc />
	</div>
	<div class="hidden group-hover:contents">
		<ul class="list-disc bg-gray-200/75 uppercase dark:bg-gray-900/75">
			{#each $headings as { heading, href }}
				{@const isCurrent = href === `#${$position}`}
				<li class="hover:text-gray-800 dark:hover:text-gray-200">
					<a
						class:!text-primary-600={isCurrent}
						class:!dark:text-primary-400={isCurrent}
						{href}
						data-sveltekit-replacestate
					>
						{heading}
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<span class="hidden lg:block">
		{$position}
	</span>
</section>
