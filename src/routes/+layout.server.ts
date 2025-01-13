// export const load = async ({ locals }) => {
//     const session = await locals.getSession();
//     const loggedIn = !!session?.user;
  
//     return {
//       loggedIn,
//     };
//   };
import type { LayoutServerLoad } from "./$types"
import { checkAdminStatus } from "./+page.server"

// Loads serverside any data we need
export const load: LayoutServerLoad = async (event) => {
  // Retrieve the session data from locals
    // Our serverside handle is adding data to event.locals for us
    const session = await event.locals.auth()

    if (session?.user?.email) {
      // Check if the user is an administrator
      const isAdmin = await checkAdminStatus(session.user.email)

      if (isAdmin) {
        return {
          session,
          isAdmin: true,
        }
      }
    }

    return {
      session,
      isAdmin: false,
    }
}