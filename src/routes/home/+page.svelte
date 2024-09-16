<script lang="ts">
    export let data;

    $: users = data.users.map(row => ({
        username: row.username,
        password: row.password
    })) as Array<{ username: string; password: string }>;
</script>

<h1>users</h1>
<div>
    <ul>
        {#each users as { username, password } (username)}
            <li><div>{username} - {password}</div></li>
        {/each}
    </ul>
</div>