 
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
//import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
//import { AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_SECRET } from "$env/static/private"

dotenv.config(); // Provides access to the environment file
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
});