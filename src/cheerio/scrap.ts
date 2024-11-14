/**
 * This is the simplest way to scrap data using puppeter 
 * It does  not contain any strategy like ip rotation, proxy rotation, Avoid headless browser Detection
 * Solving Captcha
 */

import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
export async function scrap(url:string, headless: boolean){
    console.log(puppeteer)
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    const $ = cheerio.load(content);
    const tweetText = $('div[data-testid="tweetText"]').text();
    console.log('Tweet:', tweetText);
    await browser.close();
}

scrap('https://x.com/kuberdenis/status/1854970093278462447', false);