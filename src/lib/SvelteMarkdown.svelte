<script lang="ts">
import { onMount } from "svelte";

import showdown from "showdown";
export let markdown = "";
export let id = "";

onMount(() => {
	const converter = new showdown.Converter();
	const html = converter.makeHtml(markdown);
	const div = document.getElementById(id);
	if (div) {
		div.innerHTML = html;
	}
});
</script>

<div class="break-word flex flex-col" {id}></div>
