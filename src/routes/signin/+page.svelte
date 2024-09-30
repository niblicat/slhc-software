<script lang="ts">
    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

<h2>Login</h2>
{#if form?.invalidCred}
    <p>Invalid credentials</p>
{/if}
<form method="POST">
    <input name="username" placeholder="Username" required>
    <input name="password" type="password" placeholder="Password" required>
    <button type="submit">Submit</button>
</form>
