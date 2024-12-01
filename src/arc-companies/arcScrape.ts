import puppeteer from "puppeteer-extra";
import StealthPlugins from "puppeteer-extra-plugin-stealth"
import * as cheerio from 'cheerio'
import fs from 'fs';
import json2md from "json2md";
import RandomUserAgent from 'puppeteer-extra-plugin-anonymize-ua'
import UserAgent from "user-agents";
import { Browser, Page } from "puppeteer";
import { generateUserAgents } from "../twitter/generateUserAgent";
var json2xls = require('json2xls');

puppeteer.use(StealthPlugins());
puppeteer.use(RandomUserAgent({
    customFn: () => new UserAgent().random().toString(),
}));
interface Jobs {
    companyName: string;
    companyLink: string;
    companyPhoto: string;
}
async function coreLogic(page: Page, url: string, allCurrentJobs:Array<Jobs>) {
    await page.goto(url,{ waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('[data-testid="all-company-list"]');
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 3000) + 1000));
    const content = await page.content();
    const $ = cheerio.load(content);
    const companies : Array<Jobs>= await page.evaluate(() => {
        const companyCards = Array.from(document.querySelectorAll('a[data-testid="company-card"]'));
        return companyCards.map(card => ({
            companyName: (card.querySelector('.name') as HTMLElement)?.innerText || 'N/A',
            companyLink: (card as HTMLAnchorElement).href,
            companyPhoto: (card.querySelector('.company-primary img') as HTMLImageElement)?.src || 'N/A'
        }));
      });
      allCurrentJobs.push(...companies);
    return companies;
}
function saveLocally(allCurrentJobs: Array<Jobs>) {
    console.log(allCurrentJobs);
    const xls = json2xls(allCurrentJobs);
    const mdData = json2md(
        allCurrentJobs.map((job, i) => ({
            h2: `${i}). ${job.companyName}`,
            img: job.companyPhoto,
            p: [
                `[Apply Here](${job.companyLink})`
                
            ]
        }))
    );
    const json_data = JSON.stringify(allCurrentJobs);
    console.log({json_data});
    const date = new Date().toLocaleDateString().replaceAll('/', '-');
    fs.writeFileSync(`company_${date}_post.json`, json_data);
    fs.writeFileSync(`company_${date}_post.md`, mdData);
    fs.writeFileSync(`company_${date}_post.xlsx`, xls, 'binary');
}
async function scrapeYC(url: string, headless: boolean) {
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
    });
    await page.setViewport({
        width: Math.floor(Math.random() * (1920 - 1024)) + 1024,
        height: Math.floor(Math.random() * (1080 - 768)) + 768,
    });
    const generatedUserAgents = generateUserAgents(1000);
    const randomUserAgent =
        generatedUserAgents[Math.floor(Math.random() * generatedUserAgents.length)];
    console.log("Random User-Agent:", randomUserAgent);
    await page.setUserAgent(randomUserAgent);
    await page.goto("https://httpbin.io/user-agent");
    const bodyText1 = await page.evaluate(() => {
        return document.body.innerText;
    });
    console.log(bodyText1);
    // const returnScrapData = await coreLogic(page, url);
    const allCurrentJobs: Array<Jobs> = [];
    for(let i=2;i<736;i++){
        await coreLogic(page, `${url}${i}`, allCurrentJobs);
    }
    // await coreLogic(page,url,allCurrentJobs);
    saveLocally(allCurrentJobs);
    await browser.close();
    // return returnScrapData;
}
(async () => {
    const dataScrap = await scrapeYC('https://arc.dev/companies?page=', true);
    console.log({ dataScrap });
})();
