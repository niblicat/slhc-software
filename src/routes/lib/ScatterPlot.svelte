<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from 'chart.js';

    // Export properties if needed
    export let baselineHearingData: number[];
    export let newHearingData: number[];
    export let plotTitle: string;

    let chart: any;

    // Custom tick values
    const customTicksX = [500, 1000, 2000, 3000, 4000, 6000, 8000];
    const customTicksY = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, -10];

    onMount(() => {
        Chart.register(...registerables); // Register all necessary components

        const ctx = document.getElementById("scatterPlot") as HTMLCanvasElement;
        chart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
                        label: 'Baseline',
                        data: customTicksX.map((p, i) => ({ x: p, y: baselineHearingData[i] })),
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Current Year',
                        data: customTicksX.map((p, i) => ({ x: p, y: newHearingData[i] })),
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Frequency (Hz)'
                        },
                        min: Math.min(...customTicksX),  // Ensure the x-axis starts from the minimum value of custom ticks
                        max: Math.max(...customTicksX),  // Ensure the x-axis ends at the maximum value of custom ticks
                        ticks: {
                            values: customTicksX,  // Set exact tick values
                            autoSkip: false,  // Ensure no ticks are skipped
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Hearing Level (dB)'
                        },
                        min: Math.min(...customTicksY),
                        max: Math.max(...customTicksY),
                        ticks: {
                            values: customTicksY,
                            autoSkip: false,
                        },
                        reverse: true
                    }
                },
                plugins: {
                title: {
                    display: true,
                    text: plotTitle,
                    font: {
                        size: 20
                    },
                    padding: {
                        top: 20,
                        bottom: 0
                    }
                }
            }
            }
        });
    });
</script>

<canvas id="scatterPlot" width="700" height="700"></canvas>
