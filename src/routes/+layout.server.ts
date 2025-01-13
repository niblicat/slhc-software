// export const load = async ({ locals }) => {
//     const session = await locals.getSession();
//     const loggedIn = !!session?.user;
  
//     return {
//       loggedIn,
//     };
//   };
import type { LayoutServerLoad } from "./$types"

// Loads serverside any data we need
export const load: LayoutServerLoad = async (event) => {
  return {
    // Our serverside handle is adding data to event.locals for us
    session: await event.locals.auth()
  }
}