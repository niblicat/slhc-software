<script lang="ts">
    import { page } from '$app/state';
    import CustomNavbar from '$lib/CustomNavbar.svelte';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
    import type { UserSimple } from '$lib/MyTypes';
	import PageTitle from '$lib/PageTitle.svelte';
	import { STRING_INDEX_CAPTION, STRING_INDEX_WELCOME } from '$lib/strings.js';
    import { LoginStatus, loginMessages } from '$lib/utility';
    import { Alert } from 'flowbite-svelte';

    let { data } = $props();

    // get login status
    let loginStatus = $state(LoginStatus.None);
    $effect(() => {
        if (data.loginStatus) loginStatus = data.loginStatus;
    })

    let badLogin = $state(false);
    const badLoginStatuses = [LoginStatus.NoSession, LoginStatus.NoID, LoginStatus.NoEmail, LoginStatus.NoName];
    $effect(() => {
        badLogin = badLoginStatuses.includes(loginStatus);
    })

    // Sidebar state and visibility 
    let sidebarOpen = $state(false);
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    let user: UserSimple = {
        loggedIn: !!page.data.session?.user,
        name: page.data.session?.user?.name ?? "Not logged in",
        email: page.data.session?.user?.email ?? "",
        avatar: page.data.session?.user?.image ?? ""
    }

</script>

<CustomNavbar {user} sidebarOpen={sidebarOpen} toggle={toggleSidebar} />

<main id="content" class="min-h-dvh w-full bg-gray-100 dark:bg-gray-900 pt-24">
    <ErrorMessage success={loginStatus === LoginStatus.None} type={badLogin ? "error" : "notice"}
        errorMessage={loginMessages[loginStatus]} />

    <!-- Main content -->
    <section class="flex flex-col items-center justify-center py-12">
        <PageTitle>
            {STRING_INDEX_WELCOME}
            {#snippet caption()}
                {STRING_INDEX_CAPTION}
            {/snippet}
        </PageTitle>
        <div class="max-w-3xl text-center">

            <!-- Correct Image Reference -->
            <img src="landingpage/SIUE_logo_2024.png" alt="SIUE Logo">

        </div>
    </section>
</main>