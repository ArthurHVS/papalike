import { errorHandler } from "../utilities/index.js";
export class Frontier {
    constructor(mapArray, configurationArray = []) {
        this.value = 0;
        this.mapArray = mapArray;
        this.configurationArray = configurationArray;
        this.crawlArray = []
    }

    getScore(uri) {
        let boolFlag = false
        this.configurationArray.crawl.forEach((el) => {
            if (uri.includes(el)) {
                boolFlag = true
            }
        })
        return boolFlag
    }

    getCrawlArray() {
        return this.crawlArray;
    }

    setCrawlArray(el) {
        return this.crawlArray.push(el)
    }
}