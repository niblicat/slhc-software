// interpret.ts
// Used to intepret user data and detect if there has been STS

// import { base } from "$service-worker";
// import { left } from "@popperjs/core";
import { error } from "@sveltejs/kit";
import {AGE_CORRECTION_TABLE_MALE, AGE_CORRECTION_TABLE_FEMALE} from './agetable'
import type {HertzCorrectionForAge} from './agetable'


export enum PersonSex {
    Female,
    Male,
    Other
}

function findAverage(...args: number[]) {
    let sum = 0;
    for (var i = 0; i < args.length; ++i)
        sum += args[i]

    let average = sum / args.length
    return average;
}

// used to identify hearing anomolies for each ear
export enum AnomalyStatus {
    None = 0,
    Base = 1,
    Same = 2,
    Better = 3,
    Improvement = 4,
    Worse = 5,
    STS = 6,
    Warning = 7
}

class EarAnomalyStatus {
    leftStatus: AnomalyStatus;
    rightStatus: AnomalyStatus;
    reportYear: number;
    leftBaselineYear: number;
    rightBaselineYear: number;

    constructor(leftStatus: AnomalyStatus, rightStatus: AnomalyStatus, reportYear: number, leftBaselineYear: number, rightBaselineYear: number) {
        this.leftStatus = leftStatus;
        this.rightStatus = rightStatus;
        this.reportYear = reportYear;
        this.leftBaselineYear = leftBaselineYear;
        this.rightBaselineYear = rightBaselineYear;
    }
}

export class HearingDataOneEar {
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

export class HearingScreening {
    year: number;
    leftEar: HearingDataOneEar;
    rightEar: HearingDataOneEar;

    constructor(year: number, leftEar: HearingDataOneEar, rightEar: HearingDataOneEar) {
        this.year = year;
        this.leftEar = leftEar;
        this.rightEar = rightEar;
    }
}

export class UserHearingScreeningHistory {
    age: number;
    sex: PersonSex;
    currentYear: number;
    screenings: Array<HearingScreening>;

    constructor(age: number, personSex: PersonSex, currentYear: number, screenings: Array<HearingScreening>) {
        this.age = age;
        this.currentYear = currentYear;
        this.screenings = screenings;
        this.sex = personSex;
    }

    /**
     * GetStatusForEar
     * Returns the anomaly status for an ear given data for two years
     */
    private GetStatusForEar(baselineEarData: HearingDataOneEar, beforeEarData: HearingDataOneEar, afterEarData: HearingDataOneEar, correction: HertzCorrectionForAge): AnomalyStatus {
        // Get the status for one ear
        // let unweighedAverageChange = this.GetAverageDecibelChangeForOneEar(beforeEarData, afterEarData); // compares current year and YEAR PRIOR (only main 3 points WITHOUT AGE)
        let weighedAverageChange = this.GetAverageDecibelChangeForOneEarForMainLevels(baselineEarData, afterEarData, correction); // compares current year and BASELINE (only main 3 points WITH AGE )
        let yearPriorAverageChange = this.GetAverageDecibelChangeForOneEarForMainLevels(beforeEarData, afterEarData, correction, false); // compares current year and YEAR PRIOR (only main 3 points WITH AGE )

        // a larger value is worse
        if (weighedAverageChange >= 10) return AnomalyStatus.STS;
        if (yearPriorAverageChange >= 10) return AnomalyStatus.Warning;
        else if (weighedAverageChange <= -7) return AnomalyStatus.Improvement; // baseline redefinition (-7 may be different number)
        else if (yearPriorAverageChange >= 3) return AnomalyStatus.Worse; // i think +/-3 is the correct turning point
        else if (yearPriorAverageChange <= -3) return AnomalyStatus.Better; 
        else return AnomalyStatus.Same;
    }

    /**
     * GetAgeCorrectiveDecibelAdjustment
     * Returns the decibel adjustment given a baseline and current age
     */
    private GetAgeCorrectiveDecibelAdjustment(baselineAge: number): HertzCorrectionForAge {
        function GetRowValue(val: number): number {
            return Math.min(Math.max(val, 20), 60);
        }
        let correctionTable: Array<HertzCorrectionForAge>;
        switch (this.sex) {
            case PersonSex.Female:
                correctionTable = AGE_CORRECTION_TABLE_FEMALE;
                break;
            case PersonSex.Male:
                correctionTable = AGE_CORRECTION_TABLE_MALE;
                break;
            default:
                correctionTable = AGE_CORRECTION_TABLE_MALE;
                break;
        }
        // need to clamp values between 20 and 60 because the age table does not
        // have data for outside that range
        let baselineAgeRowValue = GetRowValue(baselineAge);
        let currentAgeRowValue = GetRowValue(this.age);

        let baselineCorrection: HertzCorrectionForAge | undefined = correctionTable.find((i) => i.age == baselineAge);
        let currentCorrection: HertzCorrectionForAge | undefined = correctionTable.find((i) => i.age == this.age);
        if (!baselineCorrection) throw error; // TODO: specific error
        if (!currentCorrection) throw error; // TODO: specific error

        let difference: HertzCorrectionForAge = { 
            age: 0,
            hz1000: (currentCorrection.hz1000 - baselineCorrection.hz1000),
            hz2000: (currentCorrection.hz2000 - baselineCorrection.hz2000),
            hz3000: (currentCorrection.hz3000 - baselineCorrection.hz3000),
            hz4000: (currentCorrection.hz4000 - baselineCorrection.hz4000),
            hz6000: (currentCorrection.hz6000 - baselineCorrection.hz6000)
        }
        
        return difference;
    }

    /**
     * GenerateHearingReport
     * Returns an array of EarAnomalyStatus for each year
     */
    public GenerateHearingReport(): EarAnomalyStatus[] {
        let arrayLength = this.screenings.length;
        if (arrayLength == 0) throw error; // TODO: throw specific error

        let reportArray: EarAnomalyStatus[] = [];
        // Record the average for each each and move the index when the average is Better
        let bestLeftEarIndex = 0;
        let bestLeftEarYear = this.screenings[0].year;
        let bestLeftEarAverage = Infinity;
        let bestRightEarIndex = 0;
        let bestRightEarYear = this.screenings[0].year;
        let bestRightEarAverage = Infinity;

        bestLeftEarAverage = this.GetAverageHertzForSTSRangeForOneEar(this.screenings[0].leftEar);
        bestRightEarAverage = this.GetAverageHertzForSTSRangeForOneEar(this.screenings[0].rightEar);

        // push base status for the first hearing screening
        reportArray.push(new EarAnomalyStatus(AnomalyStatus.Base, AnomalyStatus.Base, this.screenings[0].year, this.screenings[0].year, this.screenings[0].year));

        for (var i = 1; i < arrayLength; i++) {
            let previousScreening: HearingScreening = this.screenings[i - 1];
            let afterScreening: HearingScreening = this.screenings[i];

            let newLeftEarAverage = this.GetAverageHertzForSTSRangeForOneEar(this.screenings[i].leftEar);
            let newRightEarAverage = this.GetAverageHertzForSTSRangeForOneEar(this.screenings[i].rightEar);

            let baselineLeftScreening = this.screenings[bestLeftEarIndex];
            let baselineRightScreening = this.screenings[bestRightEarIndex];

            // get the age that the user was at during baseline
            let baselineLeftAge = baselineLeftScreening.year - this.currentYear + this.age;
            let baselineRightAge = baselineRightScreening.year - this.currentYear + this.age;

            console.log("==================================================");
            console.log("current year of report: ", this.screenings[i].year);
            console.log("current age of report: ", this.age);
            console.log("left baseline year: ", baselineLeftScreening.year, "left baseline age: ", baselineLeftAge, "right baseline year: ", baselineRightScreening.year, " right baseline age: ", baselineRightAge);

            let ageCorrectionLeft = this.GetAgeCorrectiveDecibelAdjustment(baselineLeftAge);
            let ageCorrectionRight = this.GetAgeCorrectiveDecibelAdjustment(baselineRightAge);

            console.log("left age correction: ", ageCorrectionLeft, " right age correction: ", ageCorrectionRight);

            let leftAnomalyStatus = this.GetStatusForEar(baselineLeftScreening.leftEar, previousScreening.leftEar, afterScreening.leftEar, ageCorrectionLeft);
            let rightAnomalyStatus = this.GetStatusForEar(baselineRightScreening.rightEar, previousScreening.rightEar, afterScreening.rightEar, ageCorrectionRight);

            let currentAnomalyStatuses = new EarAnomalyStatus(leftAnomalyStatus, rightAnomalyStatus, afterScreening.year, bestLeftEarYear, bestRightEarYear);
            reportArray.push(currentAnomalyStatuses);

            // update baselines after report has confirmed improvement (otherwise the new baseline will compare to itself for redefinition year) 
            if (this.ShouldUpdateBaseline(bestLeftEarAverage, newLeftEarAverage)) {
                bestLeftEarIndex = i;
                bestLeftEarAverage = newLeftEarAverage;
                bestLeftEarYear = this.screenings[i].year;
            }
            if (this.ShouldUpdateBaseline(bestRightEarAverage, newRightEarAverage)) {
                bestRightEarIndex = i;
                bestRightEarAverage = newRightEarAverage;
                bestRightEarYear = this.screenings[i].year;
            }
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
     * GetAverageHertzForSTSRangeForOneEar
     * Used to find the average hertz in a specific ear
     * Useful for changing baseline if average improves
     */
    private GetAverageHertzForSTSRangeForOneEar(hdata: HearingDataOneEar): number {
        let hz2000 = hdata.hz2000;
        let hz3000 = hdata.hz3000;
        let hz4000 = hdata.hz4000;
        
        let average = findAverage(hz2000, hz3000, hz4000);
        
        return average;
    }

    /**
     * GetAverageDecibelChangeSTS
     * Used to find the average decibel change in a specific ear to detect STS
     * STS is detected if there was an average of 10+ dB change
     */
    private GetAverageDecibelChangeForOneEarForMainLevels(hdata1: HearingDataOneEar, hdata2: HearingDataOneEar, ageCorrection: HertzCorrectionForAge, doAgeCorrection: boolean = true): number {
        // ONLY CHECK 2k, 3k, 4k

        // console.log("DATA BASELINE/PRIOR: ", hdata1);
        // console.log("DATA NEW: ", hdata2);

        let diff2000 = hdata2.hz2000 - hdata1.hz2000;
        let diff3000 = hdata2.hz3000 - hdata1.hz3000;
        let diff4000 = hdata2.hz4000 - hdata1.hz4000;

        if (doAgeCorrection) {
            diff2000 -= ageCorrection.hz2000;
            diff3000 -= ageCorrection.hz3000;
            diff4000 -= ageCorrection.hz4000;

            console.log("2000 data2-data1-correction:", diff2000, " = ", hdata2.hz2000, " - ", hdata1.hz2000, " - ", ageCorrection.hz2000);
            console.log("3000 data2-data1-correction:", diff3000, " = ", hdata2.hz3000, " - ", hdata1.hz3000, " - ", ageCorrection.hz3000);
            console.log("4000 data2-data1-correction:", diff4000, " = ", hdata2.hz4000, " - ", hdata1.hz4000, " - ", ageCorrection.hz4000);
        }

        if (!doAgeCorrection) {
        console.log("2000 data2-data1:", diff2000, " = ", hdata2.hz2000, " - ", hdata1.hz2000);
        console.log("3000 data2-data1:", diff3000, " = ", hdata2.hz3000, " - ", hdata1.hz3000);
        console.log("4000 data2-data1:", diff4000, " = ", hdata2.hz4000, " - ", hdata1.hz4000);
        }

        let average = findAverage(diff2000, diff3000, diff4000);
        console.log("weighted average:", average);

        return average;
    }

    /**
     * GetAverageDecibelChangeSTS
     * Used to find the average decibel change in a specific ear to detect overall hearing changes
     */
    private GetAverageDecibelChangeForOneEar(hdata1: HearingDataOneEar, hdata2: HearingDataOneEar): number {
        // TODO: use age table?
        let diff500 = hdata2.hz500 - hdata1.hz500;
        let diff1000 = hdata2.hz1000 - hdata1.hz1000;
        let diff2000 = hdata2.hz2000 - hdata1.hz2000;
        let diff3000 = hdata2.hz3000 - hdata1.hz3000;
        let diff4000 = hdata2.hz4000 - hdata1.hz4000;
        let diff6000 = hdata2.hz6000 - hdata1.hz6000;
        let diff8000 = hdata2.hz8000 - hdata1.hz8000;

        let average = findAverage(diff500, diff1000, diff2000, diff3000, diff4000, diff6000, diff8000);
        //let average = findAverage(diff2000, diff3000, diff4000);


        // console.log("DATA YEAR BEFORE: ", hdata1);
        // console.log("DATA NEW: ", hdata2);
        // console.log("2000 data2-data1:", diff2000, " = ", hdata2.hz2000, " - ", hdata1.hz2000);
        // console.log("3000 data2-data1:", diff3000, " = ", hdata2.hz3000, " - ", hdata1.hz4000);
        // console.log("4000 data2-data1:", diff4000, " = ", hdata2.hz4000, " - ", hdata1.hz4000);
        // console.log("unweighted average: ", average);

        return average;
    }
}

interface HearingDataEntry {
    year: number;
    left: { hz500: number; hz1000: number; hz2000: number; hz3000: number; hz4000: number; hz6000: number; hz8000: number };
    right: { hz500: number; hz1000: number; hz2000: number; hz3000: number; hz4000: number; hz6000: number; hz8000: number };
}


