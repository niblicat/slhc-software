<script lang="ts">
    interface Props {
        success: boolean,
        errorMessage: string
    }

    const defaultMessage: string = "Error message is currently not being passed into ErrorMessage component";

    let { success = false, errorMessage = defaultMessage }: Props = $props();

</script>

{#if !success}
    <p class="mt-1 text-sm font-normal text-red-600 dark:text-red-300">{errorMessage}</p>
{/if}