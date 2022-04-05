import { Configuration } from "./seeders/index.js";
import { Crawler, Frontier } from './frontier/index.js';

// let myConfiguration = new Configuration('papalike.conf.json')
// let myFrontier = new Frontier(myConfiguration.getMapArray(), myConfiguration.getScoreConfig());
let myCrawler = new Crawler('papalike.conf.json')
await myCrawler.crawlMap();
await myCrawler.crawlOver();

// mapArray.forEach((map) => { 
    // myFrontier.getScore(map)
// })

// myFrontier.getCrawlArray();


