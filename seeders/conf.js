import fs from 'fs'
import { checkURL, enumerators, errorHandler, requestConfiguration } from '../utilities/index.js';
import axios from 'axios';
import xml2js from 'xml2js';
export class Configuration {
    constructor(baseFile) {
        this.rootPackage = fs.readFileSync(baseFile);
        this.configurationObject = JSON.parse(String(this.rootPackage))
        this.mapSchema = null;
        this.baseMap = `${this.configurationObject.main_target}sitemap.xml`;
    }
    checkMainTarget() {
        return checkURL(this.configurationObject.main_target)
    }
    getBaseMap() {
        if (this.checkMainTarget()) {
            let map = null;
            axios.get(this.baseMap, requestConfiguration).then((response) => {
                let parser = new xml2js.Parser();
                parser.parseString(response.data, (err, result) => {
                    (result.sitemapindex.$ ? this.mapSchema = result.sitemapindex.$ : this.mapSchema = null)
                    map = result
                })
            }).catch((err)=>{
                let myMessage = {
                    error: enumerators.errorMessages.badConfiguration,
                    reason: err.message
                }
                errorHandler(myMessage)
            })
            return map;
        }
    }
    async getMapArray() {
        let map = await this.getBaseMap()
        if (map.sitemapindex.sitemap){
            return map.sitemapindex.sitemap;
        }
        else return -1;
    }
    getScoreConfig(){
        return this.configurationObject.frontier_scores;
    }
}