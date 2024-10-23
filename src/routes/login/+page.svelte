<script lang="ts">
    import { page } from "$app/stores"
    import { SignIn } from "@auth/sveltekit/components"
    import { signIn } from "@auth/sveltekit/client"
  
    let password = ""
</script>

<h1>SvelteKit Auth Example</h1>
<div class="container">
  <p>
    This is an example site to demonstrate how to use
    <a href="https://kit.svelte.dev/">SvelteKit</a>
    with <a href="https://sveltekit.authjs.dev">SvelteKit Auth</a> for authentication.
  </p>

  <div class="session-code">
    <div class="session-code-header">
      <h3>Session</h3>
    </div>
    <div class="session-code-body">
      <pre>
        {JSON.stringify($page.data.session, null, 2)}
      </pre>
    </div>
  </div>

  <div class="login-cards">
    <div class="card">
      <!-- <div class="card-header">
        <h3>Server</h3>
      </div> -->
      <div class="card-body">
        <!-- <p>
          These actions are all using the components exported from
          <code>@auth/sveltekit/components</code> to run via form actions.
        </p> -->
        <div class="actions">
          <SignIn provider="google">
            <span slot="submitButton">
              <img
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google Logo"
                width="20"
                height="20"
              />
              Google
            </span>
          </SignIn>
          <div class="or-split">or</div>
          <!-- <SignIn provider="credentials">
            <span slot="submitButton">Sign In with Credentials</span>
            <div slot="credentials" style="width: 100%;">
              <div class="wrapper-form" style="width: 100%;">
                <div class="input-wrapper">
                  <label for="server-password">Password</label>
                  <input
                    type="password"
                    id="server-password"
                    name="password"
                    placeholder="password"
                    required
                  />
                </div>
              </div>
            </div>
          </SignIn> -->
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>Client</h3>
      </div>
      <div class="card-body">
        <p>
          These actions are all using the methods exported from
          <code>@auth/sveltekit/client</code>
        </p>
        <div class="actions">
          <div class="wrapper-form social-btn">
            <button on:click={() => signIn("google")}>
              <img
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google Logo"
                width="20"
                height="20"
              />
              Google
            </button>
          </div>
          <!-- <div class="or-split">or</div>
          <div class="wrapper-form">
            <div class="input-wrapper">
              <label for="client-password">Password</label>
              <input
                bind:value={password}
                type="password"
                placeholder="password"
                id="client-password"
                name="password"
                required
              />
            </div>
            <button on:click={() => signIn("credentials", { password })}>
              Sign In with Credentials
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</div>
