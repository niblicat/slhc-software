import { signIn } from "$auth";
import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async (event) => {
    const session = await signIn(event);

    // Redirect to dashboard after successful login
    if (session?.user) {
      throw redirect(303, "/dashboard");
    }

    // If login fails, redirect to the landing page
    throw redirect(303, "/");
  }
};
