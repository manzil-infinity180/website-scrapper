import puppeteer from "puppeteer-extra";
import StealthPlugins from "puppeteer-extra-plugin-stealth"
import randomUserAgent from 'random-useragent'
import axios from 'axios'
import * as cheerio from 'cheerio'
puppeteer.use(StealthPlugins());
/**
 * 
 * @param url 
 * @param headless 
 * Here testing ip and user agent without using tor
 */

// proxy 
const proxy = {
    host: 'localhost',
    port: 3128
}
async function fetchIP() {
    try {
      // Send the request through the proxy to ifconfig.io
      const response = await axios.get('http://ifconfig.io', { proxy });
    //   console.log(response.data.trim()); // Print IP response
      const $ = cheerio.load(response.data.trim())
      const proxyIP = $('li:contains("IP Address") .col-sm-9').text();
      const proxyPort = $('li:contains("Port") .col-sm-9').text();
      
      return {proxyIP, proxyPort};
    } catch (error) {
      console.error('Error fetching IP:', (error as Error).message);
    }
  }
//   fetchIP();

async function solveCaptcha(url: string, headless: boolean){
    const {proxyIP, proxyPort} = await fetchIP();
    console.log({proxyIP, proxyPort});
    const args = [`--proxy-server=${proxyIP}:${proxyPort}`]
    const browser = await puppeteer.launch({
        headless: headless,
        args,
        timeout: 30000
    });
    const page = await browser.newPage();
    const userAgent = randomUserAgent.getRandom();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1280, height: 720 }); 
    await page.goto(url)
    // const browser = await puppeteer.launch({ timeout: 30000 });
    await page.waitForSelector('.address', {timeout: 30000});
    await page.screenshot({ path: 'nowsecure.png', fullPage: true }); 
   
    await page.goto('https://httpbin.io/user-agent')
    const bodyText1 = await page.evaluate(() => {
        return document.body.innerText;
    });
    console.log(bodyText1);
    await browser.close();
}
// solveCaptcha('https://nopecha.com/captcha/turnstile', true);
solveCaptcha('https://www.my-ip.io/', false);