<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

  import { Label, Input, Helper, Radio} from 'flowbite-svelte';
  import { Button } from 'flowbite-svelte';

  let isInactive = false;

</script>

<div class="center text-2xl">Add a New Employee  </div>

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