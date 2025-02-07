<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from 'chart.js';

    
    interface Props {
        // Export properties if needed
        baselineHearingData: number[];
        newHearingData: number[];
        plotTitle: string;
        labels: string[];
    }

    let {
        baselineHearingData,
        newHearingData,
        plotTitle,
        labels
    }: Props = $props();

    let chart: any;

    // Custom tick values
    const customTicksX = [500, 1000, 2000, 3000, 4000, 6000, 8000];
    const customTicksY = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, -10];

    function getPointStyle(label: string) {
        if (label.includes("Right Baseline")) return "rect";
        if (label.includes("Left Baseline")) return "rect";
        if (label.includes("Right New")) return "circle";
        if (label.includes("Left New")) return "crossRot";
    }

    function getPointRadius(label: string) {
        if (label.includes("Right Baseline")) return 6;
        if (label.includes("Left Baseline")) return 6;
        if (label.includes("Right New")) return 5;
        if (label.includes("Left New")) return 9;
    }

    function getColor(label: string) {
        if (label.includes("Right Baseline")) return 'rgba(166, 5, 39, 1)';
        if (label.includes("Left Baseline")) return 'rgba(10, 81, 128, 1)';
        if (label.includes("Right New")) return 'rgba(255, 99, 132, 1)';
        if (label.includes("Left New")) return 'rgba(54, 162, 235, 1)';
    }

    onMount(() => {
        Chart.register(...registerables); // Register all necessary components

        const ctx = document.getElementById("scatterPlot") as HTMLCanvasElement;
        chart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
                        label: labels[0],
                        data: customTicksX.map((p, i) => ({ x: p, y: baselineHearingData[i] })),
                        pointStyle: getPointStyle(labels[0]),
                        pointRadius: getPointRadius(labels[0]),
                        pointHoverRadius: getPointRadius(labels[0]),  // Match hover radius with normal radius
                        backgroundColor: getColor(labels[0]),
                        borderColor: getColor(labels[0]),
                        borderWidth: 2,
                        showLine: true,
                        fill: false,
                        lineTension: 0
                    },
                    {
                        label: labels[1],
                        data: customTicksX.map((p, i) => ({ x: p, y: newHearingData[i] })),
                        pointStyle: getPointStyle(labels[1]),
                        pointRadius: getPointRadius(labels[1]),
                        pointHoverRadius: getPointRadius(labels[1]),  // Match hover radius with normal radius
                        backgroundColor: getColor(labels[1]),
                        borderColor: getColor(labels[1]),
                        borderWidth: 2,
                        showLine: true,
                        fill: false,
                        lineTension: 0
                    },
                    labels.length > 2 && {
                        label: labels[2],
                        data: customTicksX.map((p, i) => ({ x: p, y: baselineHearingData[baselineHearingData.length / 2 + i] })),
                        pointStyle: getPointStyle(labels[2]),
                        pointRadius: getPointRadius(labels[2]),
                        pointHoverRadius: getPointRadius(labels[2]),  // Match hover radius with normal radius
                        backgroundColor: getColor(labels[2]),
                        borderColor: getColor(labels[2]),
                        borderWidth: 2,
                        showLine: true,
                        fill: false,
                        lineTension: 0
                    },
                    labels.length > 2 && {
                        label: labels[3],
                        data: customTicksX.map((p, i) => ({ x: p, y: newHearingData[newHearingData.length / 2 + i] })),
                        pointStyle: getPointStyle(labels[3]),
                        pointRadius: getPointRadius(labels[3]),
                        pointHoverRadius: getPointRadius(labels[3]),  // Match hover radius with normal radius
                        backgroundColor: getColor(labels[3]),
                        borderColor: getColor(labels[3]),
                        borderWidth: 2,
                        showLine: true,
                        fill: false,
                        lineTension: 0
                    }].filter(Boolean)
            },
            options: {
                responsive: true,
                hover: {
                    mode: 'nearest',
                    intersect: false,
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Frequency (Hz)',
                            font: {
                                size: 16
                            }
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
                            text: 'Hearing Level (dB)',
                            font: {
                                size: 16
                            }
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
                    },
                    legend: {
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    });

    // Reactive block to update chart data dynamically
    $effect(() => {
        if (chart) {
            // Dynamically update datasets
            chart.data.datasets = [
                {
                    label: labels[0],
                    data: customTicksX.map((p, i) => ({ x: p, y: baselineHearingData[i] })),
                    pointStyle: getPointStyle(labels[0]),
                    pointRadius: getPointRadius(labels[0]),
                    pointHoverRadius: getPointRadius(labels[0]),
                    backgroundColor: getColor(labels[0]),
                    borderColor: getColor(labels[0]),
                    borderWidth: 2,
                    showLine: true,
                    fill: false,
                    lineTension: 0
                },
                {
                    label: labels[1],
                    data: customTicksX.map((p, i) => ({ x: p, y: newHearingData[i] })),
                    pointStyle: getPointStyle(labels[1]),
                    pointRadius: getPointRadius(labels[1]),
                    pointHoverRadius: getPointRadius(labels[1]),
                    backgroundColor: getColor(labels[1]),
                    borderColor: getColor(labels[1]),
                    borderWidth: 2,
                    showLine: true,
                    fill: false,
                    lineTension: 0
                },
                labels.length > 2 && {
                    label: labels[2],
                    data: customTicksX.map((p, i) => ({ x: p, y: baselineHearingData[baselineHearingData.length / 2 + i] })),
                    pointStyle: getPointStyle(labels[2]),
                    pointRadius: getPointRadius(labels[2]),
                    pointHoverRadius: getPointRadius(labels[2]),
                    backgroundColor: getColor(labels[2]),
                    borderColor: getColor(labels[2]),
                    borderWidth: 2,
                    showLine: true,
                    fill: false,
                    lineTension: 0
                },
                labels.length > 2 && {
                    label: labels[3],
                    data: customTicksX.map((p, i) => ({ x: p, y: newHearingData[newHearingData.length / 2 + i] })),
                    pointStyle: getPointStyle(labels[3]),
                    pointRadius: getPointRadius(labels[3]),
                    pointHoverRadius: getPointRadius(labels[3]),
                    backgroundColor: getColor(labels[3]),
                    borderColor: getColor(labels[3]),
                    borderWidth: 2,
                    showLine: true,
                    fill: false,
                    lineTension: 0
                },
            ].filter(Boolean);

            chart.update(); // Ensure the chart reflects the updated data
        }
    });

</script>

<canvas id="scatterPlot" width="700" height="700"></canvas>
