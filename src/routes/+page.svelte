<script lang="ts">
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