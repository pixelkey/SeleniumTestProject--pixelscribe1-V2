import { expect } from 'chai';
import { getSteps, getVariable } from '../webpages/locator.js';
import loginPage from '../webpages/loginPage.js';
import roomsPage from '../webpages/roomsPage.js';
import createDriver from '../browserInitiation.js';
import { describe, it, before, after, beforeEach } from 'mocha';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import addContext from 'mochawesome/addContext.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('New Room Creation Function Verification', function () {
    this.timeout(20000); // Set the timeout to 20 seconds

    let driver;
    let loginPageInstance;
    let roomsPageInstance;

    // Helper function to take a screenshot
    async function takeScreenshot(driver, testCaseName, filename, test) {
        const screenshot = await driver.takeScreenshot();
        const screenshotDir = path.join(__dirname, 'screenshots', testCaseName);
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const screenshotPath = path.join(screenshotDir, filename);
        fs.writeFileSync(screenshotPath, screenshot, 'base64');
        console.log(`Screenshot ${filename} captured \n`);
        addContext(test, `/../testcases/screenshots/${testCaseName}/${filename}`);
    }

    before(async function () {
        // Create the WebDriver instance before running the tests
        driver = await createDriver();
        loginPageInstance = new loginPage(driver);
        roomsPageInstance = new roomsPage(driver);
    });

    after(async function () {
        // Quit the WebDriver instance after all tests are done
        //await driver.quit();
    });

    beforeEach(async function () {
    });

    it('Validate delete a new room', async function () {
        console.log("Test Execution Started....");

        const steps = getSteps();

        try {
            for (const step of steps) {
                console.log(`Executing step: ${step.action}`);
                switch (step.action) {
                    case 'maximizeWindow':
                        await driver.manage().window().maximize();
                        break;
                    case 'navigateToUrl':
                        console.log(`Navigating to URL: ${step.url}`);
                        await driver.get(step.url);
                        break;
                    case 'login':
                        console.log(`Logging in with email: ${step.email}`);
                        await loginPageInstance.loginWithEmailAndPassword(step.email, step.password);
                        break;
                    case 'getTitle':
                        step.title = await driver.getTitle();
                        break;
                    case 'assertTitle':
                        expect(step.title).to.equal(step.expectedTitle);
                        console.log('Page Title:', step.title);
                        break;
                    case 'typeRoomName':
                        await roomsPageInstance.typeNewRoomName(step.value);
                        break;
                    case 'wait':
                        await driver.sleep(step.duration);
                        break;
                    case 'clickCreateRoomButton':
                        await roomsPageInstance.clickOnCreateRoomButton();
                        break;
                    case 'waitForElement':
                        await roomsPageInstance.waitForCreatedNewRoom(step.timeout);
                        break;
                    case 'assert':
                        await roomsPageInstance.assertCreatedNewRoom(step.attribute, step.expectedValue);
                        break;
                    case 'clickDeleteRoomButton':
                        await roomsPageInstance.clickOnDeleteRoomButton();
                        break;
                    
                }
            }
        } catch (error) {
            console.error('Error during the test:', error);
            throw error; 
        }
    });
});