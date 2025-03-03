<script lang="ts">
	import { Button, Modal } from "flowbite-svelte";
    import { PageCategory } from "./MyTypes";
	import Information from "./Information.svelte";
	import { InfoCircleSolid } from "flowbite-svelte-icons";
	import { Tooltip } from "flowbite-svelte"

    interface Props {
        page?: PageCategory
    }
    const defaultCategory = PageCategory.Home;

    let {page = defaultCategory}: Props = $props();

    let infoModal = $state(false);
</script>

{#if page != PageCategory.Home}
    <Modal title="Information" bind:open={infoModal} placement="top-right" outsideclose>
        <Information {page} />
        
        <svelte:fragment slot="footer">
            <Button class="cursor-pointer" color="primary" on:click={() => infoModal = false}>OK</Button>
        </svelte:fragment>
    </Modal>

    <Button size="sm" color="none" class="p-1! cursor-pointer" on:click={() => infoModal = true}>
        <InfoCircleSolid />
    </Button>
    <Tooltip placement='left'>Learn more about this page</Tooltip>
{/if}