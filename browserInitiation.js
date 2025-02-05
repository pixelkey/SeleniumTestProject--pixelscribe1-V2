import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function createDriver() {
    // Set Chrome options to ignore certificate errors
    let options = new chrome.Options();
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--use-fake-ui-for-media-stream'); // Automatically allow camera access

    // Create a new instance of the Chrome driver
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    return driver;
}

export default createDriver;