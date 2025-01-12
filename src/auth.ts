import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import { AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_SECRET } from "$env/static/private"
 
// If Google talks BACK to our application, it is handled by the "handle" here
export const { handle, signIn, signOut } = SvelteKitAuth({
  // This providers object will be our list of providers that can be used to login to the site
  providers: [
    Google({ clientId: AUTH_GOOGLE_CLIENT_ID, clientSecret: AUTH_GOOGLE_SECRET})
  ]
})