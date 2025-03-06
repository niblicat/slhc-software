<script lang="ts">
    import { Button } from "flowbite-svelte";
    import { PageCategory } from "./MyTypes";
    import { InfoCircleSolid } from "flowbite-svelte-icons";
    import { Tooltip } from "flowbite-svelte"

    interface Props {
        page: PageCategory
        infoModal: boolean
    }
    const defaultCategory = PageCategory.Home;

    let {page = defaultCategory, infoModal = $bindable(false)}: Props = $props();
</script>

{#if page != PageCategory.Home}
    <Button size="sm" color="none" class="p-1! cursor-pointer mr-4" on:click={() => infoModal = true}>
        <InfoCircleSolid />
    </Button>
    <Tooltip placement="left">Learn more about this page</Tooltip>
{/if}