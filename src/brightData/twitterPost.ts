import dotenv from 'dotenv'
dotenv.config()
import puppeteer from 'puppeteer-core'

async function startScraping() {
    const BROWSER_WS = process.env.BRIGHT_DATA;
    try{
        console.log('Connecting to Scraping Browser...');
        const browser =await puppeteer.connect({
            browserWSEndpoint: BROWSER_WS,
        });
        const page = await browser.newPage();
        await page.goto('https://x.com/kuberdenis/status/1854970093278462447');
        const html = await page.content();
        console.log(html);
        await browser.close();

    }catch(err){
        console.log("Error ", err);
    }
}

startScraping()