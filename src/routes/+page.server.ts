// // import { redirect } from "@sveltejs/kit";

// // export const load = async ({ parent, url }) => {
// //   const parentData = await parent();

// //   // Redirect to the landing page if not logged in and trying to access a restricted page
// //   if (!parentData.loggedIn && url.pathname !== '/') {
// //     throw redirect(302, "/");
// //   }
// // };
// export const load = async ({ locals }) => {
//     const session = await locals.getSession();
//     const loggedIn = !!session?.user;
  
//     return {
//       loggedIn,
//     };
//   };
