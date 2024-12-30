<script>
import Tabs from "$lib/components/tabs/Tabs.svelte";
import { headingIsVisible } from "$lib/stores/content";
import { onMount } from "svelte";

const { children } = $props();

onMount(() => {
	headingIsVisible.set(false);
});
</script>

<Tabs title="games" tabs={['tic-tac-toe']} trackUrl asLinks rootUrl="/games">
	{@render children()}
</Tabs>
