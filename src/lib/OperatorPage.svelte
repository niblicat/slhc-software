<script lang="ts">
    // TODO: export users and their statuses
    // TODO: make svelte store writables
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';

    type Operator = {
        name: string,
        email: string,
        googleID: string,
        isOP: boolean
        selected: boolean
    };

    let operators: Array<Operator> = [
        {name: "e", email: "e2", googleID: "e3", isOP: true, selected: false},
        {name: "fabian", email: "fabian@2", googleID: "fabiangoogle", isOP: true, selected: false},
        {name: "rosie", email: "rosie@2", googleID: "rosiegoogle", isOP: false, selected: false},
        {name: "sage", email: "sage@2", googleID: "sagegoogle", isOP: true, selected: false},
    ]

    // use selectedOperators to modify user selected operators
    let selectedOperators: Array<Operator> = [];

    $: selectedOperators = operators.filter((e) => e.selected == true)

    // TODO: add indicator showing that people cannot change their email after it has been set. They must switch to a different Google account
</script>

<!-- figure out if this should be main -->
<div class="h-screen flex justify-center">
    <Table hoverable={true}>
        <TableHead>
            <TableHeadCell class="!p-4">
              <Checkbox />
            </TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Google ID</TableHeadCell>
            <TableHeadCell>Is Operator</TableHeadCell>
            <TableHeadCell>
                <span class="sr-only">Edit</span>
            </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each operators as operator}
                <TableBodyRow>
                    <TableBodyCell class="!p-4">
                        <Checkbox bind:checked={operator.selected} />
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.name}
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.email}
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.googleID}
                    </TableBodyCell>
                    <TableBodyCell>
                        <Checkbox checked={operator.isOP} />
                    </TableBodyCell>
                    <TableBodyCell>
                        <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    {#each selectedOperators as op}{op.name}.{/each}
    
</div>

<!-- 
<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
  </script>
  
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell class="!p-4">
        <Checkbox />
      </TableHeadCell>
      <TableHeadCell>Product name</TableHeadCell>
      <TableHeadCell>Color</TableHeadCell>
      <TableHeadCell>Category</TableHeadCell>
      <TableHeadCell>Price</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">Edit</span>
      </TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        <TableBodyCell>Apple MacBook Pro 17"</TableBodyCell>
        <TableBodyCell>Sliver</TableBodyCell>
        <TableBodyCell>Laptop</TableBodyCell>
        <TableBodyCell>$2999</TableBodyCell>
        <TableBodyCell>
          <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
        </TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        <TableBodyCell>Microsoft Surface Pro</TableBodyCell>
        <TableBodyCell>White</TableBodyCell>
        <TableBodyCell>Laptop PC</TableBodyCell>
        <TableBodyCell>$1999</TableBodyCell>
        <TableBodyCell>
          <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
        </TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        <TableBodyCell>Magic Mouse 2</TableBodyCell>
        <TableBodyCell>Black</TableBodyCell>
        <TableBodyCell>Accessories</TableBodyCell>
        <TableBodyCell>$99</TableBodyCell>
        <TableBodyCell>
          <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
        </TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
-->