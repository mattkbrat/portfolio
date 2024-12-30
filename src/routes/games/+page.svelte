<script lang="ts">
import { goto } from "$app/navigation";
import { onMount } from "svelte";

onMount(() => {
	goto("/games/tic-tac-toe");
});
</script>

<svelte:head>
	<title>Games</title>
</svelte:head>
