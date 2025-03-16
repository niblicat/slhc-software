<script lang="ts">
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';

    // Props
    export let rightBaselineHearingData: Array<number> = [];
    export let rightNewHearingData: Array<number> = [];
    export let leftBaselineHearingData: Array<number> = [];
    export let leftNewHearingData: Array<number> = [];
    export let selectedYear: string = "No year selected";

    // Chart Selection
    let isRightEar = false;
    let showBoth = true;
    
    const toggleChart = (ear: string) => {
        if (ear === 'both') {
            showBoth = true;
        } else {
            isRightEar = ear === 'right';
            showBoth = false;
        }
    };

    // Title for the chart that changes based on selected year
    $: plotTitle = selectedYear !== "No year selected" 
        ? `Audiogram for ${selectedYear}` 
        : "No Data Selected";
</script>

<div class="chart-container w-full max-w-xl">
    {#if showBoth}
        <ScatterPlot 
            plotTitle={plotTitle}
            baselineHearingData={rightBaselineHearingData.concat(leftBaselineHearingData)}
            newHearingData={rightNewHearingData.concat(leftNewHearingData)}
            labels={['Right Baseline', 'Right New', 'Left Baseline', 'Left New']}
            noDataSelected={selectedYear === "No year selected"}
        />
    {:else if isRightEar}
        <ScatterPlot 
            plotTitle={plotTitle}
            baselineHearingData={rightBaselineHearingData} 
            newHearingData={rightNewHearingData} 
            labels={['Right Baseline', 'Right New']}
            noDataSelected={selectedYear === "No year selected"}
        />
    {:else}
        <ScatterPlot 
            plotTitle={plotTitle}
            baselineHearingData={leftBaselineHearingData} 
            newHearingData={leftNewHearingData} 
            labels={['Left Baseline', 'Left New']}
            noDataSelected={selectedYear === "No year selected"}
        />
    {/if}
    <div class="mt-4 flex justify-center w-full">
        <ButtonGroup class="*:!ring-primary-700 w-full">
            <Button class="cursor-pointer flex-1" color="blue" on:click={() => toggleChart('left')}>Left</Button>
            <Button class="cursor-pointer flex-1" color="red" on:click={() => toggleChart('right')}>Right</Button> 
            <Button class="cursor-pointer flex-1" color="purple" on:click={() => toggleChart('both')}>Both</Button> 
        </ButtonGroup>
    </div>
</div>