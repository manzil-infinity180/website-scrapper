import puppeteer from "puppeteer-extra";
import StealthPlugins from "puppeteer-extra-plugin-stealth"
import * as cheerio from 'cheerio'
import fs from 'fs';
import json2md from "json2md";
import RandomUserAgent from 'puppeteer-extra-plugin-anonymize-ua'
import UserAgent from "user-agents";
import { Browser, Page } from "puppeteer";
var json2xls = require('json2xls');
import { generateUserAgents } from "../twitter/generateUserAgent";
puppeteer.use(StealthPlugins());
puppeteer.use(RandomUserAgent({
    customFn: () => new UserAgent().random().toString(),
}));
interface ycJobs {
    [x: string]: string
}
async function coreLogic(page: Page, url: string) {
    await page.goto(url);
    await page.waitForSelector('[class="space-y-2 overflow-hidden"]');
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 3000) + 1000));
    const content = await page.content();
    const $ = cheerio.load(content);
    console.log($);
    const companyName = $('div[data-testid="User-Name"]').text();
    const allCurrentJobs: Array<ycJobs> = [];
    $('[class="my-2 flex h-auto w-full flex-col flex-nowrap rounded border border-[#ccc] bg-beige-lighter px-5 py-3"]').each((_, element) => {
        const companyPhoto = $(element).find('[class="h-16 w-16 rounded-full"]').attr('src');
        const companyName = $(element).find('[class="block font-bold md:inline"]').text().trim();
        const companyTitle = $(element).find('[class="text-gray-700 md:mr-2"]').text().trim();
        const role = $(element).find('[class="font-semibold text-linkColor"]').text().trim();
        const typeOfRole = $(element).find('[class="flex flex-row flex-wrap justify-center md:justify-start"]').text().trim();
        const applyLink = $(element).find('[class="font-semibold text-linkColor"]').attr('href');
        const ycJobsList = {
            companyName, companyPhoto, companyTitle, role, typeOfRole, applyLink: 'https://www.ycombinator.com' + applyLink
        }
        allCurrentJobs.push(ycJobsList);
    });
    const xls = json2xls(allCurrentJobs);
    const mdData = json2md(
        allCurrentJobs.map(job => ({
            h2: job.companyName,
            img: job.companyPhoto,
            p: [
                `**Title:** ${job.companyTitle}`,
                `**Role:** ${job.role}`,
                `**Type of Role:** ${job.typeOfRole}`,
                `[Apply Here](${job.applyLink})`
            ]
        }))
    );
    const date = new Date().toLocaleDateString().replaceAll('/', '-');
    fs.writeFileSync(`yc-daily-post/${date}_post.md`, mdData);
    fs.writeFileSync(`yc-daily-post/${date}_post.xlsx`, xls, 'binary');
    return allCurrentJobs;
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
    const generatedUserAgents = generateUserAgents(100);
    const randomUserAgent =
        generatedUserAgents[Math.floor(Math.random() * generatedUserAgents.length)];
    console.log("Random User-Agent:", randomUserAgent);
    await page.setUserAgent(randomUserAgent);
    await page.goto("https://httpbin.io/user-agent");
    const bodyText1 = await page.evaluate(() => {
        return document.body.innerText;
    });
    console.log(bodyText1);
    const returnScrapData = await coreLogic(page, url);
    await browser.close();
    return returnScrapData;
}
(async () => {
    const dataScrap = await scrapeYC('https://www.ycombinator.com/jobs/role/software-engineer', true);
    console.log({ dataScrap });
})();
