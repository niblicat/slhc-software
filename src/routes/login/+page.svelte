<script lang="ts">
    import type { PageData, ActionData } from './$types';
	
	// export let data: PageData;
    export let form: ActionData;
</script>

<h2>login</h2>
{#if form?.invalidCred == true}
    Invalid credentials
{/if}
<form method="POST">
    <input name="username">
    <input name="password" type="password">

    <button>submit</button>
</form>