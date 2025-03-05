<script lang="ts">
    interface Props {
        sub?: boolean
        children?: any
        caption?: any
    }

    let { children, caption, sub = false }: Props = $props();
</script>

<div class="p-4">
    {#if sub}
        <h1 class="text-2xl text-center">
            {@render children?.()}
        </h1>
    {:else}
        <h2 class="text-2xl text-center">
            {@render children?.()}
        </h2>
    {/if}
    {#if caption}
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400 text-center">
            {@render caption?.()}
        </p>
    {/if}
</div>