<script lang="ts">
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';

    // Props
    export let RightBaselineHearingData: Array<number> = [];
    export let RightNewHearingData: Array<number> = [];
    export let LeftBaselineHearingData: Array<number> = [];
    export let LeftNewHearingData: Array<number> = [];

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
</script>

<div class="chart-container w-full max-w-xl">
    {#if showBoth}
        <ScatterPlot 
            plotTitle="Both Ears"
            baselineHearingData={RightBaselineHearingData.concat(LeftBaselineHearingData)}
            newHearingData={RightNewHearingData.concat(LeftNewHearingData)}
            labels={['Right Baseline', 'Right New', 'Left Baseline', 'Left New']}
        />
    {:else if isRightEar}
        <ScatterPlot 
            plotTitle="Right Ear"
            baselineHearingData={RightBaselineHearingData} 
            newHearingData={RightNewHearingData} 
            labels={['Right Baseline', 'Right New']}
        />
    {:else}
        <ScatterPlot 
            plotTitle="Left Ear"
            baselineHearingData={LeftBaselineHearingData} 
            newHearingData={LeftNewHearingData} 
            labels={['Left Baseline', 'Left New']}
        />
    {/if}
    <div class="mt-4 flex justify-center">
        <ButtonGroup class="*:!ring-primary-700">
            <Button class="cursor-pointer" color="blue" style="width:175px" on:click={() => toggleChart('left')}>Left</Button>
            <Button class="cursor-pointer" color="red" style="width:175px" on:click={() => toggleChart('right')}>Right</Button> 
            <Button class="cursor-pointer" color="purple" style="width:175px" on:click={() => toggleChart('both')}>Both</Button> 
        </ButtonGroup>
    </div>
</div>