import {startBrowser} from './browser'
import {ScrappAll} from './pageController'

// Start the browser and create a browser instance
let browserInstance = startBrowser()

// Pass the browser instance to the scraper controller
ScrappAll(browserInstance, "website")
