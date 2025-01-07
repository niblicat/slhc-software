<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

  import { Label, Input, Helper, Radio, Button } from 'flowbite-svelte';
  import { invalidateAll } from '$app/navigation';

  let firstName = '';
  let lastName = '';
  let email = '';
  let dateOfBirth = '';
  let isInactive = false;
  let lastActive = '';

  let success = true;
  let errorMessage = '';

  function displayError(message: string) {
    errorMessage = message;
    success = false;
  }

  async function addEmployee() {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('isInactive', isInactive.toString());
    if (isInactive) {
      formData.append('lastActive', lastActive);
    }

    const response = await fetch('/dashboard?/addEmployee', {
      method: 'POST',
      body: formData,
    });

    try {
      const serverResponse = await response.json();

      if (serverResponse.success) {
        success = true;
        await invalidateAll(); // Invalidate the cache and refresh the table.
        firstName = '';
        lastName = '';
        email = '';
        dateOfBirth = '';
        lastActive = '';
        isInactive = false;
      } else {
        displayError(serverResponse.message);
      }
    } catch (error: any) {
      displayError(error.message);
    }
  }

</script>

<div class="center text-2xl">Add a New Employee</div>

<div class="mb-6 form">
  <Label for="firstName" class="block mb-2">Employee First Name</Label>
  <Input id="firstName" placeholder="first name" required/>
  <!-- <Helper class="mt-2" color="green">
    <span class="font-medium">Well done!</span>
    Some success message.
  </Helper> -->
</div>
<div class="mb-6 form">
  <Label for="lastName" class="block mb-2">Employee Last Name</Label>
  <Input id="lastName" placeholder="last name" required/>
  <!-- <Helper class="mt-2" color="green">
    <span class="font-medium">Well done!</span>
    Some success message.
  </Helper> -->
</div>
<div class="mb-6 form">
  <Label for="email" class="block mb-2">Employee Email</Label>
  <Input type="email" id="email" placeholder="email@siue.edu" required/>
  <!-- <Helper class="mt-2" color="green">
    <span class="font-medium">Well done!</span>
    Some success message.
  </Helper> -->
</div>
<div class="mb-6 form">
  <Label for="DOB" class="block mb-2">Employee Date of Birth</Label>
  <Input type="date" id="DOB"required/> 
  <!-- <Helper class="mt-2" color="green">
    <span class="font-medium">Well done!</span>
    Some success message.
  </Helper> -->
</div>
<div class="form">
  <Label for="employeeStatus" class="block mb-2">Employement Status</Label>
  <Radio name="employmentStatus" checked={true} on:change={() => isInactive = false}>Active</Radio>
  <Radio name="employmentStatus" on:change={() => isInactive = true}>Inactive</Radio>
</div>

{#if isInactive}
<div class="mb-6 form">
  <Label for="dropDate" class="block mb-2">Last Active Date</Label>
  <Input type="date" id="dropDate" placeholder="last active date" />
</div>
{/if}

<div class="form">
  <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" style="width:200px">Submit</Button>
</div>

<div class="form">
  <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" style="width:200px" on:click={addEmployee}>Submit</Button>
</div>
{#if !success}
<span class="text-red-600">{errorMessage}</span>
{/if}

<style>
  .center {
  margin: auto;
  width: 50%;
  padding: 10px;
  text-align: center;
}

.form {
  margin: auto;
  width: 60%;
  padding: 10px;
}
</style>