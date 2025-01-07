<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

  import { Label, Input, Radio, Button } from 'flowbite-svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal } from 'flowbite-svelte';
  import { invalidateAll } from '$app/navigation';

  let firstName = '';
  let lastName = '';
  let email = '';
  let dateOfBirth = '';
  let isInactive = false;
  let lastActive = '';

  let success = true;
  let errorMessage = '';

  // Employee type
  type Employee = {
    employee_id: number;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    last_active: string | null;
  };

  // Employees list
  let employees: Employee[] = [];

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
      console.log('Server Response:', serverResponse);

      if (serverResponse.success) {
        success = true;
        await invalidateAll(); // Invalidate the cache and refresh the table.
        window.location.reload();
        firstName = '';
        lastName = '';
        email = '';
        dateOfBirth = '';
        lastActive = '';
        isInactive = false;
      } else {
        displayError(serverResponse.message || 'Unknown error');
      }
    } catch (error: any) {
      displayError(error.message || 'An error occurred');
    }
  }

</script>

<div class="center text-2xl">Add a New Employee</div>

<form on:submit|preventDefault={addEmployee}>

<div class="mb-6 form">
  <Label for="firstName" class="block mb-2">Employee First Name</Label>
  <Input id="firstName" bind:value={firstName} placeholder="First Name" required />
</div>

<div class="mb-6 form">
  <Label for="lastName" class="block mb-2">Employee Last Name</Label>
  <Input id="lastName" bind:value={lastName} placeholder="Last Name" required />
</div>

<div class="mb-6 form">
  <Label for="email" class="block mb-2">Employee Email</Label>
  <Input id="email" type="email" bind:value={email} placeholder="email@company.com" required />
</div>

<div class="mb-6 form">
  <Label for="dateOfBirth" class="block mb-2">Employee Date of Birth</Label>
  <Input id="dateOfBirth" type="date" bind:value={dateOfBirth} required />
</div>

<div class="form">
  <Label for="employmentStatus" class="block mb-2">Employment Status</Label>
  <Radio name="employmentStatus" bind:checked={isInactive} on:change={() => isInactive = false}>Active</Radio>
  <Radio name="employmentStatus" bind:checked={isInactive} on:change={() => isInactive = true}>Inactive</Radio>
</div>

{#if isInactive}
  <div class="mb-6 form">
    <Label for="lastActive" class="block mb-2">Last Active Date</Label>
    <Input id="lastActive" type="date" bind:value={lastActive} />
  </div>
{/if}

<div class="form">
  <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" style="width:200px" type="submit">Submit</Button>
</div>

{#if !success}
<span class="text-red-600">{errorMessage}</span>
{/if}

</form>


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