import createDriver from '../browserInitiation.js';
import LoginPage from '../webpages/loginPage.js';
import RoomsPage from '../webpages/roomsPage.js';
import { describe, it, before, after, beforeEach } from 'mocha';
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import addContext from 'mochawesome/addContext.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Room Undo/Redo Function Verification', function () {
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
        loginPageInstance = new LoginPage(driver);
        roomsPageInstance = new RoomsPage(driver);
        // Maximize the browser window before each test
        await driver.manage().window().maximize();
        // Navigate to the URL before each test
        await driver.get('https://localhost/');
        // Perform login with valid credentials
        await loginPageInstance.loginWithEmailAndPassword('support@p.com', '123');
    });

    after(async function () {
        // Quit the WebDriver instance after all tests are done
        await driver.quit();
    });

    beforeEach(async function () {

    });

    it('Validate undo created room change', async function () {
        console.log("Test Execution Started....");

        try {
            const roomTitleText = await roomsPageInstance.getRoomTitle(); // Retrieve the room title text

            // Use an assertion to verify the title
            expect(roomTitleText).to.equal('Rooms');
            console.log('Page Title:', roomTitleText);

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after navigating to the rooms page
            await takeScreenshot(driver, 'tc004_undoRedoRoomChanges', 'rooms_creation_page_before_undo.png', this);

            await driver.sleep(2000); // Wait for 2 seconds
            // Click on redo button
            await roomsPageInstance.clickOnRoomUndoButton();

            // Wait for the undo the created room and the expected element to be visible
            const createdNewRoomElement = await driver.wait(until.elementLocated(roomsPageInstance.createdNewRoom), 10000);
            const roomName = await createdNewRoomElement.getAttribute('value');

            // Verify that the undo the created room successfully
            expect(roomName).to.equal('Test Room 1'); // Use an assertion to verify the room name
            console.log('Successfully undo the created room successfully');

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after undo the changes
            await takeScreenshot(driver, 'tc004_undoRedoRoomChanges', 'undo_change.png', this);
        }
        catch (error) {
            console.error('Error during the test:', error);
            throw error; // Rethrow the error to ensure the test fails
        }
    });

    it('Validate redo created room change', async function () {
        console.log("Test Execution Started....");

        try {
            const roomTitleText = await roomsPageInstance.getRoomTitle(); // Retrieve the room title text

            // Use an assertion to verify the title
            expect(roomTitleText).to.equal('Rooms');
            console.log('Page Title:', roomTitleText);

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after navigating to the rooms page
            await takeScreenshot(driver, 'tc004_undoRedoRoomChanges', 'rooms_creation_page_before_redo.png', this);

            await driver.sleep(2000); // Wait for 2 seconds
            // Click on redo button
            await roomsPageInstance.clickOnRoomRedoButton();

            // Verify that the redo the created room successfully
            const deletedRoomElements = await driver.findElements(roomsPageInstance.createdNewRoom);
            expect(deletedRoomElements.length).to.equal(0);
            console.log('Successfully redo the created room successfully');

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after undo the changes
            await takeScreenshot(driver, 'tc004_undoRedoRoomChanges', 'redo_change.png', this);
        }
        catch (error) {
            console.error('Error during the test:', error);
            throw error; // Rethrow the error to ensure the test fails
        }
    });
});