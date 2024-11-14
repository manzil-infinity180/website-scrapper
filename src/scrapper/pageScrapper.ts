import { Browser } from "puppeteer";
interface IBooksDetail {
    bookTitle: string;
    bookPrice: string;
    noAvailable: string;
    imageUrl: string
    bookDescription: string
}
interface IDetails {
    [x: string]: string
}
// website
export const scrapObject = {
    url: 'http://books.toscrape.com',
    //@ts-ignore
    async scraper(browser: Browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        let scrapedData: IDetails[] = [];
        async function scrapeCurrentPage() {
            await page.waitForSelector('.page_inner')

            let urls = await page.$$eval('section ol > li', (links) => {
                console.log(typeof links)
                console.log("hello bro")
                console.log(links)

                links = links.filter(link => link.querySelector('.instock.availability > i')?.textContent !== 'In stock');
                const urls = links.map(el => (el.querySelector('h3 > a') as HTMLAnchorElement)?.href);
                return urls;
            })
            console.log(urls);

            let pagePromises = (link: string) => new Promise<IDetails>(async (resolve, reject) => {
                let dataObj: IDetails = {}
                let newPage = await browser.newPage()
                await newPage.goto(link);
                dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
                dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
                dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
                dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
                dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
                resolve(dataObj);
                await newPage.close();
            });

            /*
            Warning: note well that you waited for the Promise using a for-in loop. 
            Any other loop will be sufficient but avoid iterating over your URL arrays using an 
            array-iteration method like forEach, or any other method that uses a callback function. 
            This is because the callback function will have to go through the callback queue and event 
            loop first, hence, multiple page instances will open all at once. This will place a much 
            larger strain on your memory.
             */
            for (let link in urls) {
                console.log(link)
                let currentPageData = await pagePromises(urls[link]);
                scrapedData.push(currentPageData);
                console.log(currentPageData);
            }

            /* UNCOMMENT FOR MULTIPAGE */
            // let nextButtonExist = false;
            // try {
            //     const nextButton = await page.$eval('.next > a', a => a.textContent);
            //     nextButtonExist = true;
            // } catch (err) {
            //     nextButtonExist = false;
            // }
            // if (nextButtonExist) {
            //     await page.click('.next > a');
            //     return scrapeCurrentPage();
            // }
            await page.close();
			return scrapedData;
        }
        let data = await scrapeCurrentPage();
		console.log(data);
		return data;
    }
}
/**
 * data-testid="tweetPhoto"
 * data-testid="tweetText"
 */
export const twitterObject = {
    url: 'https://x.com/kuberdenis/status/1854970093278462447',
    async scraper(browser : Browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        await page.waitForSelector('div[data-testid="tweetText"]');

        const tweetContent = await page.evaluate(() => {
            const tweetElement = document.querySelector('div[data-testid="tweetText"] > span');
            console.log(tweetElement)
            return tweetElement
          });
          console.log('Tweet content:', tweetContent);
        //   await browser.close();
        // let urls = await page.$$eval('[data-testid="tweetText"]', (links) => {
        //     console.log(typeof links)
        //     console.log("hello bro")
        //     console.log(links)

        //     // links = links.filter(link => link.querySelector('.instock.availability > i')?.textContent !== 'In stock');
        //     // const urls = links.map(el => (el.querySelector('h3 > a') as HTMLAnchorElement)?.href);
        //     // return urls;
        //     return links
        // })
        // console.log(urls);
    }
}