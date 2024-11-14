/**
 * Here i am using pupeteer extra package and its stealth plugin to ride it from browser detection 
 */
import puppeteer from "puppeteer-extra";
import StealthPlugins from "puppeteer-extra-plugin-stealth"
import * as cheerio from 'cheerio'
import randomUserAgent from 'random-useragent'
import RandomUserAgent from 'puppeteer-extra-plugin-anonymize-ua'
import UserAgent from "user-agents";
puppeteer.use(StealthPlugins());


/**
 * 
 * @param url 
 * @param headless 
 * It uses pupeteer extra and plugins which help you to get rid of browser detection and additionally add rate limit 
 * also to it
 */
async function scrap(url:string, headless: boolean){
    console.log(puppeteer);
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    // twitter
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    console.log(content);
    const $ = cheerio.load(content);
    const tweetText = $('div[data-testid="tweetText"]').text();
    console.log('Tweet:', tweetText);
    await browser.close();
}
/**
 * 
 * @param url 
 * @param headless 
 * You can use - User Agent package like "user-agent"(complex and more functionality than random-agent)
 * random-agent - lightwight
 */

async function scrapWithDifferentUserAgent(url: string, headless: boolean){
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    const userAgent = randomUserAgent.getRandom();
    await page.setUserAgent(userAgent);
    await page.goto(url);
    // await page1.goto("https://httpbin.io/user-agent");
    const bodyText1 = await page.evaluate(() => {
        return document.body.innerText;
    });
    console.log(bodyText1);
    await browser.close();
}
/**
 * 
 * @param url 
 * @param headless 
 * Here i am using puppeteer-extra-plugin-anonymize-ua plugins with the "user-agents" npm package
 * for getting random user agent 
 */
puppeteer.use(RandomUserAgent({
    customFn: () => new UserAgent().random().toString(),
}))
async function scrapUsingUserAgentPlugins(url: string, headless: boolean){
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    const userAgent = randomUserAgent.getRandom();
    await page.setUserAgent(userAgent);
    await page.goto(url);
    // await page1.goto("https://httpbin.io/user-agent");
    const bodyText1 = await page.evaluate(() => {
        return document.body.innerText;
    });
    console.log(bodyText1);
    await browser.close();
}
// scrap('https://x.com/kuberdenis/status/1854970093278462447', false);
// scrapWithDifferentUserAgent('https://httpbin.io/user-agent', true);
scrapUsingUserAgentPlugins('https://httpbin.io/user-agent', true);

/*
Puppeteer Stealth
-------------------------
Each Puppeteer Stealth evasion module is designed to plug a particular leak. Take a look below:

iframe.contentWindow fixes the HEADCHR_iframe detection by modifying window.top and window.frameElement.
Media.codecs modifies codecs to support what actual Chrome supports.
Navigator.hardwareConcurrency sets the number of logical processors to four.
Navigator.languages modifies the languages property to allow custom languages.
Navigator.plugin emulates navigator.mimeTypes and navigator.plugins with functional mocks to match standard Chrome used by humans.
Navigator.permissions masks the permissions property to pass the permissions test.
Navigator.vendors makes it possible to customize the navigator.vendor property.
Navigator.webdriver masks navigator.webdriver.
Sourceurl hides the sourceurl attribute of the Puppeteer script.
User-agent-override modifies the user-agent components.
Webgl.vendor changes the Vendor/Renderer property from Google, which is the default for Puppeteer headless.
Window.outerdimensions adds the missing window.outerWidth or window.outerHeight properties.
*/






