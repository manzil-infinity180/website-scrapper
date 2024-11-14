import { Browser } from 'puppeteer';
import {scrapObject, twitterObject} from './pageScrapper'
type TWebsite = "website" | "twitter" | "linkedin" | "reddit"
/**
 * 
 * @param browserInstance 
 * @param {TWebsite} website 
 */
export async function ScrappAll(browserInstance : Promise<Browser>, website: TWebsite) {
    let browser : Browser;
    try{
        browser = await browserInstance;
        if (website === "website"){
            await scrapObject.scraper(browser);
        }else if (website === "twitter"){
            await twitterObject.scraper(browser);
        }
       

    }catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}
