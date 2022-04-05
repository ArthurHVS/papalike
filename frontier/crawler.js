import { errorHandler, requestConfiguration } from "../utilities/index.js";
import { Configuration } from "../seeders/index.js";
import { Frontier } from "./frontier.js";
import xml2js from 'xml2js';
import axios from "axios";
import * as cheerio from 'cheerio';

export class Crawler {
    constructor(baseFile) {
        this.configuration = new Configuration(baseFile)
        this.configurationArray = this.configuration.getScoreConfig();
        this.frontier = new Frontier(this.configuration.getMapArray, this.scoreConfig);
        this.getCrawlArray = this.frontier.getCrawlArray
        this.setCrawlArray = this.frontier.setCrawlArray
        this.crawlArray = this.frontier.crawlArray
        this.getScore = this.frontier.getScore

    }
    getCrawlArray() {
        return this.frontier.crawlArray
    }
    async crawlMap(map = this.configuration.baseMap) {
        await axios.get(map, requestConfiguration).then((response) => {
            let parser = new xml2js.Parser();
            parser.parseString(response.data, (err, result) => {
                if (err) { errorHandler(err.message); }
                if (result.sitemapindex) {
                    result.sitemapindex.sitemap.forEach((el) => {
                        if (this.getScore(el.loc[0])) {
                            this.setCrawlArray(el.loc[0]);
                            this.crawlOver();
                        }
                    })
                }
                if (result.urlset) {
                    result.urlset.url.forEach((el) => {
                        if (this.getScore(el.loc[0])) {
                            this.setCrawlArray(el.loc[0]);
                            this.crawlOver();
                        }
                    })
                }
            })
        })
        return 0;
    }
    async crawlPage(page) {
        let pageData = null;
        await axios.get(page, requestConfiguration).then((response) => {
            const $ = cheerio.load(response.data, null, false);
            pageData = $("*[class$='__description selectable']").text();
        })
        return pageData
    }
    async crawlOver() {
        while (this.frontier.crawlArray.length > 0) {
            try {
                let uri = this.frontier.crawlArray.pop();
                if (uri) {
                    if (uri.split('.').pop() === 'xml') {
                        return this.crawlMap(uri);
                    }
                    else {
                        return this.crawlPage(uri);
                    }
                }
                this.crawlOver();
            }
            catch (err) {
                throw new Error(err.message)
            }
        }
    }
}