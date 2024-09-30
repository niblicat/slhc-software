<script lang="ts">
    import type { ActionData } from './$types';
    
    export let form: ActionData;
</script>

<h2>Login</h2>
{#if form?.invalidCred}
    <p>Invalid credentials</p>
{/if}

<div class="signin">
    <div class="card">
        <div class="provider">
            <form action="http://localhost:5173/auth/signin/google" method="POST">
                <input type="hidden" name="csrfToken" value={form?.csrfToken}>
                <input type="hidden" name="callbackUrl" value="/dashboard"> <!-- Redirect to home page after sign-in -->
                <button type="submit" class="button" style="--provider-bg: #fff; --provider-bg-hover: color-mix(in srgb, #1a73e8 30%, #fff); --provider-dark-bg: #161b22; --provider-dark-bg-hover: color-mix(in srgb, #1a73e8 30%, #000);" tabindex="0">
                    <span style="filter: invert(1) grayscale(1) brightness(1.3) contrast(9000); mix-blend-mode: luminosity; opacity: 0.95;">
                        Sign in with Google
                    </span>
                    <img loading="lazy" height="24" src="https://authjs.dev/img/providers/google.svg" alt="Google SignIn">
                </button>
            </form>
        </div>
    </div>
</div>

<style>
    .signin {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .card {
        background: #f9f9f9; /* Background color for the card */
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 10px 0; /* Space between cards */
        padding: 16px; /* Padding inside the card */
        width: 300px; /* Set a width for the cards */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .provider {
        width: 100%; /* Make the provider section take full width of the card */
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 4px;
        padding: 10px 16px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s ease;
    }
</style>
