<script lang="ts">
    import { Accordion, AccordionItem, Li } from "flowbite-svelte";
    import { PageCategory, type InformationPerCategory } from "./MyTypes";
    import { getInformationPerCategory } from "./infopercategory.svelte";

    let informationPerCategory: InformationPerCategory[] | null = getInformationPerCategory();

    interface Props {
        page?: PageCategory
    }
    const defaultCategory = PageCategory.Home;

    let {page = defaultCategory}: Props = $props();
</script>

{#if informationPerCategory}
    <Accordion>
        {#each informationPerCategory as main}
            <AccordionItem class="cursor-pointer">
                <span slot="header">{main.header}</span>
                {#each main.points as point}
                    <Li>{@html point}</Li>
                {/each}
                {#if main.sub}
                    <Accordion class="bg-gray-100">
                        {#each main.sub as sub}
                            <AccordionItem class="cursor-pointer">
                            <span slot="header">{sub.header}</span>
                            {#each sub.points as point}
                                <Li>{@html point}</Li>
                            {/each}
                        </AccordionItem>
                        {/each}
                    </Accordion>
                {/if}
            </AccordionItem>
        {/each}
    </Accordion>
{/if}