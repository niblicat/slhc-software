import type { RequestEvent } from "@sveltejs/kit"

export function handleSearchRedirect(event: RequestEvent) {
    const redirectTo = event.url.pathname + event.url.search
    return '/dashboard?redirectTo=${redirectTo}'
}