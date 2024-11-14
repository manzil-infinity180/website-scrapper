import puppeteer from "puppeteer-extra";
import StealthPlugins from "puppeteer-extra-plugin-stealth"
import randomUserAgent from 'random-useragent'
puppeteer.use(StealthPlugins());
async function solveCaptcha(url: string, headless: boolean){
    const browser = await puppeteer.launch({
        headless: headless,
    });
    const page = await browser.newPage();
    const userAgent = randomUserAgent.getRandom();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1280, height: 720 }); 
    await page.goto(url)
    await page.waitForSelector('body'); 
    await page.screenshot({ path: 'nowsecure.png', fullPage: true }); 
    // await page.screenshot({ path: nowsecure.png', fullPage: true }); 
    // extract the message of the test result
    // const resultElement = await page.$("#res")
    // const message = await resultElement.evaluate(e => e.textContent)
    // console.log(message);
    await page.waitForSelector('#parent'); 
    await page.screenshot({ path: 'nowsecure1.png', fullPage: true }); 
    await browser.close();
}
// solveCaptcha('https://nopecha.com/captcha/turnstile', true);
solveCaptcha('https://patrickhlauke.github.io/recaptcha/', false);