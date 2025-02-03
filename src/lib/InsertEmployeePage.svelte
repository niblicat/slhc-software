<script lang="ts">

  import { Label, Input, Radio, Button } from 'flowbite-svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal } from 'flowbite-svelte';
  import { invalidateAll } from '$app/navigation';

  let firstName = $state('');
  let lastName = $state('');
  let email = $state('');
  let dateOfBirth = $state('');
  let isInactive = $state(false);
  let lastActive = $state('');

  let success = $state(true);
  let errorMessage = $state('');
  let successMessage = $state('');

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

  async function handleSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior
    successMessage = '';  
    errorMessage = '';  

    await addEmployee();

    if (success) {
      successMessage = 'Successfully added employee! Refreshing page...';
      setTimeout(() => location.reload(), 2000);    // Refresh the page after 2 secs
    }
    else {
      console.error('Error occurred:', errorMessage);
    }
  }

  export async function addEmployee() {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('isInactive', isInactive.toString());
    if (isInactive) {
      formData.append('lastActive', lastActive);
    }

    // Debug: Log form data
    console.log('Form data to be sent:', Object.fromEntries(formData.entries()));

    try {
      const response = await fetch('/dashboard?/addEmployee', {
        method: 'POST',
        body: formData,
      });
  
      // Debug: Log raw response
      console.log('Raw server response:', response);

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      let serverResponse;
      try {
        serverResponse = await response.json();
      } 
      catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Server Response:', serverResponse);
    } 
    catch (error: any) {
      console.error('Error during fetch or JSON parsing:', error);
      displayError(error.message || 'An error occurred');
    }
  }

</script>

<div class="center text-2xl">Add a New Employee</div>

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
<Button 
  class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" 
  style="width:200px" 
  on:click={handleSubmit}
>Submit</Button>
</div>

<div>
  {#if successMessage}
    <div class="text-green-600 mt-4">
      {successMessage}
    </div>
  {/if}

  {#if !success && errorMessage}
    <div class="text-red-600 mt-4">
      {errorMessage}
    </div>
  {/if}
</div>



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