<script lang="ts">
    export let data;

    $: pets = data.pets.map(row => ({
        name: row.name,
        owner: row.owner
    })) as Array<{ name: string; owner: string }>;

    let checker = false;
    function DoSomething() {
        checker = !checker;
    }


</script>
<h1>welcome to the jungle</h1>

<button
on:click={() => {
    DoSomething();
}}>
do something
</button>

<input type="checkbox" checked={checker}>

<h2>database test</h2>
<div>
    <p>my pets (if you do not see any pets, something is wrong)</p>
    <ul>
        {#each pets as { name, owner } (name)}
            <li><div>{name} - {owner}</div></li>
        {/each}
    </ul>
</div>