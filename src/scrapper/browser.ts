import puppeteer, { Browser } from "puppeteer";

export async function startBrowser() {
    let browser: Browser;
    try{
        console.log("Starting browser")
        browser = await puppeteer.launch({
            headless: false,
        })
    }catch(err){
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}
