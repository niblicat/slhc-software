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
<header class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2">
	<nav class="flex">
		<a class="block" href="/">Tester Page</a>
		<a class="block" href="/home">Home</a>
		<a class="block" href="/login">Login</a>
	</nav> 
	
</header>

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