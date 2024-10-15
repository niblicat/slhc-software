// interpret.ts
// Used to intepret user data and detect if there has been STS

import { base } from "$service-worker";
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
    None,
    Base,
    Same,
    Better,
    Worse,
    STS,
    Warning
}

class EarAnomolyStatuses {
    leftStatus: AnomolyStatus;
    rightStatus: AnomolyStatus;
    reportYear: number;

    constructor(leftStatus: AnomolyStatus, rightStatus: AnomolyStatus, reportYear: number) {
        this.leftStatus = leftStatus;
        this.rightStatus = rightStatus;
        this.reportYear = reportYear;
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
    private GetStatusForEar(baselineEarData: HearingDataOneEar, beforeEarData: HearingDataOneEar, afterEarData: HearingDataOneEar): AnomolyStatus {
        // Get the status for one ear
        let unweighedAverageChange = this.GetAverageDecibalChangeForOneEar(beforeEarData, afterEarData);
        let weighedAverageChange = this.GetAverageDecibalChangeForOneEarForMainLevels(baselineEarData, afterEarData);

        // a larger value is worse
        if (weighedAverageChange >= 10) return AnomolyStatus.STS;
        if (unweighedAverageChange >= 10) return AnomolyStatus.Warning;
        else if (unweighedAverageChange >= 5) return AnomolyStatus.Worse;
        else if (unweighedAverageChange == 0) return AnomolyStatus.Same;
        else return AnomolyStatus.Better;
    }

    /**
     * GenerateHearingReport
     * Returns an array of EarAnomolyStatuses for each year
     */
    public GenerateHearingReport(): EarAnomolyStatuses[] {
        let arrayLength = this.screenings.length;
        if (arrayLength == 0) throw error; // TODO: throw specific error

        let reportArray: EarAnomolyStatuses[] = [];
        // Record the average for each each and move the index when the average is Better
        let bestLeftEarIndex = 0;
        let bestLeftEarAverage = Infinity;
        let bestRightEarIndex = 0;
        let bestRightEarAverage = Infinity;

        bestLeftEarAverage = this.GetAverageDecibalsForSTSRangeForOneEar(this.screenings[0].leftEar);
        bestRightEarAverage = this.GetAverageDecibalsForSTSRangeForOneEar(this.screenings[0].rightEar);

        // push base status for the first hearing screening
        reportArray.push(new EarAnomolyStatuses(AnomolyStatus.Base, AnomolyStatus.Base, this.screenings[0].year));

        for (var i = 1; i < arrayLength; i++) {
            let beforeYear: HearingScreening = this.screenings[i - 1];
            let afterYear: HearingScreening = this.screenings[i];

            let newLeftEarAverage = this.GetAverageDecibalsForSTSRangeForOneEar(this.screenings[i].leftEar);
            let newRightEarAverage = this.GetAverageDecibalsForSTSRangeForOneEar(this.screenings[i].rightEar);

            if (this.ShouldUpdateBaseline(bestLeftEarAverage, newLeftEarAverage)) {
                bestLeftEarIndex = i;
                bestLeftEarAverage = newLeftEarAverage;
            }
            if (this.ShouldUpdateBaseline(bestRightEarAverage, newRightEarAverage)) {
                bestRightEarIndex = i;
                bestRightEarAverage = newRightEarAverage;
            }

            let baselineLeftScreening = this.screenings[bestLeftEarIndex];
            let baselineRightScreening = this.screenings[bestRightEarIndex];

            let leftAnomolyStatus = this.GetStatusForEar(baselineLeftScreening.leftEar, beforeYear.leftEar, afterYear.leftEar);
            let rightAnomolyStatus = this.GetStatusForEar(baselineRightScreening.rightEar, beforeYear.rightEar, afterYear.rightEar);

            let currentAnomolyStatuses = new EarAnomolyStatuses(leftAnomolyStatus, rightAnomolyStatus, afterYear.year);
            reportArray.push(currentAnomolyStatuses);
        }
        return reportArray;
    }

    /**
     * UpdateBaselineForOneEar
     * OSHA does not specify a definition of significant
        improvement. However, an example in Appendix F of the Hearing Conservation
        Amendment illustrates revision of the baseline after an improvement of 5 dB in
        the average of hearing thresholds at 2, 3, and 4 kHz.
     */
    private ShouldUpdateBaseline(currentAverage: number, newAverage: number): boolean {
        if (newAverage <= currentAverage - 5) return true;
        else return false;
    }

    /**
     * GetAverageDecibalsForSTSRangeForOneEar
     * Used to find the average decibals in a specific ear
     * Useful for changing baseline if average improves
     */
    private GetAverageDecibalsForSTSRangeForOneEar(hdata: HearingDataOneEar): number {
        let hz2000 = hdata.hz2000;
        let hz3000 = hdata.hz3000;
        let hz4000 = hdata.hz4000;
        
        let average = findAverage(hz2000, hz3000, hz4000);
        
        return average;
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