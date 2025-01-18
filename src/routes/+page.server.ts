import { sql } from '@vercel/postgres'
import { page } from '$app/stores';
import { redirect } from '@sveltejs/kit'
import { addUserToAdminDatabase, checkAdminStatus, LoginStatus } from '$lib/utility';
import { AdminStatus } from '$lib/utility';;

export const load = async (event) => {
    const session = await event.locals.auth();

    if (session) {
        const adminStatus = await checkAdminStatus(session)
        switch (adminStatus) {
            case AdminStatus.HasPerms:
                console.log("User HAS perms");
                redirect(303, '/dashboard');

            case AdminStatus.NoPerms:
                console.log("User DOES NOT have perms");
                return { loginStatus: LoginStatus.NoPerms };

            case AdminStatus.NotListed:
                console.log("Not Listed");
                if (!session.user) return { loginStatus: LoginStatus.NoSession };
                if (!session.user.email) return { loginStatus: LoginStatus.NoEmail };
                if (!session.user.name) return { loginStatus: LoginStatus.NoName };

                // all checks passed, let's make a new user
                const email = session.user.email;
                const name = session.user?.name;
                const googleID = session.user.id;
                await addUserToAdminDatabase(email, name);
                return { loginStatus: LoginStatus.NoPerms };
        }
    }
    return { LoginStatus: LoginStatus.None }
}