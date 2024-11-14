/**
 * Using puppeteer-with-fingerprints package // https://www.npmjs.com/package/puppeteer-with-fingerprints
 * a plugin for the puppeteer framework that allows you to change a browser fingerprint, 
 * generate a virtual identity and improve your browser's stealth.
 */

import puppeteer from "puppeteer-extra";
import randomUserAgent from 'random-useragent'
/**
 * 
 * @param url 
 * @param headless 
 * Explaination : Puppeteer uses default property navigator.webdriver as true which define it 
 */
async function scrapUsingUserAgentPlugins(url: string, headless: boolean){
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    const userAgent = randomUserAgent.getRandom();
    await page.setUserAgent(userAgent);
    await page.goto(url)
    // extract the message of the test result
    const resultElement = await page.$("#res")
    const message = await resultElement.evaluate(e => e.textContent)
    console.log(message);
    await browser.close();
    
}
scrapUsingUserAgentPlugins("https://arh.antoinevastel.com/bots/areyouheadless", true);

// import puppeteer from "puppeteer"

// (async () => {
//     // set up the browser and launch it
//     const browser = await puppeteer.launch()

//     // open a new blank page
//     const page = await browser.newPage()

//     // navigate the page to the target page
//     await page.goto("https://arh.antoinevastel.com/bots/areyouheadless")

//     // extract the message of the test result
//     const resultElement = await page.$("#res")
//     const message = await resultElement.evaluate(e => e.textContent)

//     // print the resulting message
//     console.log(`The result of the test is "%s"`, message);

//     // close the current browser session
//     await browser.close()
// })()