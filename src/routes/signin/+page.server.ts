import { signIn } from "$auth"
import type { Actions } from "./$types"
import type { PageServerLoad } from "./$types"

export const actions = { default: signIn } satisfies Actions