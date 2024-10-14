// interpret.ts
// Used to intepret user data and detect if there has been STS

import { left } from "@popperjs/core";
import { error } from "@sveltejs/kit";

function findAverage(...args: number[]) {
    let sum = 0;
    for (var i = 0; i < args.length; ++i)
        sum += args[i]

    let average = sum / args.length
    return average;
}

// used to identify hearing anomolies for each ear
enum AnomolyStatus {
    none,
    base,
    same,
    better,
    worse,
    STS,
    warning
}

class EarAnomolyStatuses {
    leftStatus: AnomolyStatus;
    rightStatus: AnomolyStatus;
    baseYear: number;
    comparedYear: number;

    constructor(leftStatus: AnomolyStatus, rightStatus: AnomolyStatus, baseYear: number, comparedYear: number) {
        this.leftStatus = leftStatus;
        this.rightStatus = rightStatus;
        this.baseYear = baseYear;
        this.comparedYear = comparedYear;
    }
}

class HearingDataOneEar {
    hz500: number;
    hz1000: number;
    hz2000: number;
    hz3000: number;
    hz4000: number;
    hz6000: number;
    hz8000: number;

    constructor(hz500: number, hz1000: number, hz2000: number, hz3000: number, hz4000: number, hz6000: number, hz8000: number) {
        this.hz500 = hz500;
        this.hz1000 = hz1000;
        this.hz2000 = hz2000;
        this.hz3000 = hz3000;
        this.hz4000 = hz4000;
        this.hz6000 = hz6000;
        this.hz8000 = hz8000;
    }
}

class HearingScreening {
    year: number;
    leftEar: HearingDataOneEar;
    rightEar: HearingDataOneEar;

    constructor(year: number, leftEar: HearingDataOneEar, rightEar: HearingDataOneEar) {
        this.year = year;
        this.leftEar = leftEar;
        this.rightEar = rightEar;
    }
}

class UserHearingScreeningHistory {
    age: number;
    currentYear: number;
    screenings: Array<HearingScreening>;

    constructor(age: number, currentYear: number, screenings: Array<HearingScreening>) {
        this.age = age;
        this.currentYear = currentYear;
        this.screenings = screenings;
    }

    /**
     * GetStatusForEar
     * Returns the anomoly status for an ear given data for two years
     */
    private GetStatusForEar(beforeEarData: HearingDataOneEar, afterEarData: HearingDataOneEar) {
        // Get the status for one ear
        let unweighedAverageChange = this.GetAverageDecibalChangeForOneEar(beforeEarData, afterEarData);
        let weighedAverageChange = this.GetAverageDecibalChangeForOneEarForMainLevels(beforeEarData, afterEarData);

        // a larger value is worse
        if (weighedAverageChange >= 10) return AnomolyStatus.STS;
        if (unweighedAverageChange >= 10) return AnomolyStatus.warning;
        else if (unweighedAverageChange >= 5) return AnomolyStatus.worse;
        else if (unweighedAverageChange == 0) return AnomolyStatus.same;
        else return AnomolyStatus.better;
    }

    /**
     * GenerateHearingReport
     */
    public GenerateHearingReport() {
        let arrayLength = this.screenings.length;
        if (arrayLength == 0) throw error; // TODO: throw specific error

        let reportArray: EarAnomolyStatuses[] = [];
        let bestScreening = this.screenings[0];

        // push base status for the first hearing screening
        reportArray.push(new EarAnomolyStatuses(AnomolyStatus.base, AnomolyStatus.base, -1, this.screenings[0].year));

        for (var i = 1; i < arrayLength; i++) {
            let beforeYear: HearingScreening = this.screenings[i - 1];
            let afterYear: HearingScreening = this.screenings[i];

            let leftAnomolyStatus = this.GetStatusForEar(beforeYear.leftEar, afterYear.leftEar);
            let rightAnomolyStatus = this.GetStatusForEar(beforeYear.rightEar, afterYear.rightEar);

            let currentAnomolyStatuses = new EarAnomolyStatuses(leftAnomolyStatus, rightAnomolyStatus, beforeYear.year, afterYear.year);
            reportArray.push(currentAnomolyStatuses);

        }
        // TODO: generate a list of anomoly statuses for each year
    }

    /**
     * GetAverageDecibalChangeSTS
     * Used to find the average decibal change in a specific ear to detect STS
     * STS is detected if there was an average of 10+ dB change
     */
    private GetAverageDecibalChangeForOneEarForMainLevels(hdata1: HearingDataOneEar, hdata2: HearingDataOneEar): number {
        // ONLY CHECK 2k, 3k, 4k
        // TODO: use age table?
        let diff2000 = hdata2.hz2000 - hdata1.hz2000;
        let diff3000 = hdata2.hz3000 - hdata1.hz3000;
        let diff4000 = hdata2.hz4000 - hdata1.hz4000;

        let average = findAverage(diff2000, diff3000, diff4000);

        return average;
    }
    /**
     * GetAverageDecibalChangeSTS
     * Used to find the average decibal change in a specific ear to detect overall hearing changes
     */
    private GetAverageDecibalChangeForOneEar(hdata1: HearingDataOneEar, hdata2: HearingDataOneEar): number {
        // ONLY CHECK 2k, 3k, 4k
        // TODO: use age table?
        let diff500 = hdata2.hz500 - hdata1.hz1000;
        let diff1000 = hdata2.hz1000 - hdata1.hz1000;
        let diff2000 = hdata2.hz2000 - hdata1.hz2000;
        let diff3000 = hdata2.hz3000 - hdata1.hz3000;
        let diff4000 = hdata2.hz4000 - hdata1.hz4000;
        let diff6000 = hdata2.hz6000 - hdata1.hz6000;
        let diff8000 = hdata2.hz8000 - hdata1.hz8000;

        let average = findAverage(diff500, diff1000, diff2000, diff3000, diff4000, diff6000, diff8000);

        return average;
    }
}