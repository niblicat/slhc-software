<script>
	export let open = false
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
	<nav class="p-12 text-xl">
		<a class="block" href="/">Tester Page</a>
		<a class="block" href="/home">Home</a>
		<a class="block" href="/login">Login</a>
		<a class="block" href="#Employees">Employees</a>
		<a class="block" href="#Mailings">Mailings</a>
		<a class="block" href="#Admin">Admin</a>
		<a class="block" href="#InsertEmployees">Insert Employees</a>
	</nav>
</aside>

<style>
	aside {
		width: 25%;
		left: -25%;
		transition: left 0.3s ease-in-out;
		z-index: 100;
	}
	
	.open {
		left: 0
	}
</style>