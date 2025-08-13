<script lang="ts">
import Toc from "$lib/icons/TOC.svelte";
import { headings, position } from "./stores/content";
</script>

<section
	id="table-of-contents"
	class="group hidden items-center gap-x-2 uppercase hover:flex-col hover:items-start md:flex print:hidden"
>
	<Toc />
	<div class="hidden group-hover:contents">
		<ul class="sticky top-0 list-disc bg-gray-50 dark:!bg-gray-950">
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
</section>
