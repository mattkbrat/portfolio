<script lang="ts">
import { browser } from "$app/environment";
import showdown from "showdown";
import { onMount } from "svelte";
const { markdown = "", id = "" } = $props();

onMount(() => {
	if (!browser) return;
	const converter = new showdown.Converter();
	const html = converter.makeHtml(markdown);
	const div = document.getElementById(id);
	if (div) {
		div.innerHTML = html;
	}
});
</script>

<div class="break-word flex flex-col" {id}></div>
