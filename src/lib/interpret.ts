// interpret.ts
// Used to intepret user data and detect if there has been STS

// used to identify hearing anomolies for each ear
enum AnomolyStatus {
    none,
    same,
    better,
    worse,
    STS,
    other
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
     * GenerateHearingReport
     */
    public GenerateHearingReport() {
        
    }

    /**
     * GetAverageDecibalChangeSTS
     * Used to find the average decibal change in a specific ear to detect STS
     * STS is detected if there was an average of 10+ dB change
     */
    private GetAverageDecibalChangeForOneEar(hdata1: HearingDataOneEar, hdata2: HearingDataOneEar): AnomolyStatus {
        // ONLY CHECK 2k, 3k, 4k
        // TODO: use age table?
        let diff2000 = hdata2.hz2000 - hdata1.hz2000;
        let diff3000 = hdata2.hz3000 - hdata1.hz3000;
        let diff4000 = hdata2.hz4000 - hdata1.hz4000;

        let average = (diff2000 + diff3000 + diff4000) / 3;

        // TODO: CORRECT THE STATUS
        return AnomolyStatus.none;
    }
}