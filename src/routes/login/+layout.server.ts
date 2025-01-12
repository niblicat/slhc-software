import type { LayoutServerLoad } from "./$types"

// Loads serverside any data we need
export const load: LayoutServerLoad = async (event) => {
  return {
    session: await event.locals.auth()
  }
}