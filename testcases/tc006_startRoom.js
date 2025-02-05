import createDriver from '../browserInitiation.js';
import LoginPage from '../webpages/loginPage.js';
import RoomsPage from '../webpages/roomsPage.js';
import SelectedRoomPage from '../webpages/selectedRoomPage.js'; // Ensure this import is correct
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

describe('Start New Room Function Verification', function () {
    this.timeout(20000); // Set the timeout to 20 seconds

    let driver;
    let loginPageInstance;
    let roomsPageInstance;
    let selectedRoomPageInstance;

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
        selectedRoomPageInstance = new SelectedRoomPage(driver); // Ensure this instantiation is correct
        // Maximize the browser window before each test
        await driver.manage().window().maximize();
        // Navigate to the URL before each test
        await driver.get('https://localhost/');
        // Perform login with valid credentials
        await loginPageInstance.loginWithEmailAndPassword('support@p.com', '123');
    });

    after(async function () {
        // Quit the WebDriver instance after all tests are done
        //await driver.quit();
    });

    beforeEach(async function () {

    });

    it('Validate create a new room', async function () {
        console.log("Test Execution Started....");

        try {
            const roomTitleText = await roomsPageInstance.getRoomTitle(); // Retrieve the room title text

            // Use an assertion to verify the title
            expect(roomTitleText).to.equal('Rooms');
            console.log('Page Title:', roomTitleText);

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after navigating to the rooms page
            await takeScreenshot(driver, 'tc002_createRoom', 'rooms_creation_page.png', this);

            await driver.sleep(2000); // Wait for 2 seconds
            // Type the new room name
            await roomsPageInstance.typeNewRoomName('Test Room 1');
            // Click on the create room button
            await roomsPageInstance.clickOnCreateRoomButton();

            // Wait for the new room to be created and the expected element to be visible
            const createdNewRoomElement = await driver.wait(until.elementLocated(roomsPageInstance.createdNewRoom), 10000);
            const roomName = await createdNewRoomElement.getAttribute('value');

            // Verify that the new room was created successfully
            expect(roomName).to.equal('Test Room 1'); // Use an assertion to verify the room name
            console.log('Successfully created a new room - ', roomName);

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after creating the room
            await takeScreenshot(driver, 'tc002_createRoom', 'created_room.png', this);
        }
        catch (error) {
            console.error('Error during the test:', error);
            throw error; // Rethrow the error to ensure the test fails
        }
    });

    it('Validate start a room', async function () {
        console.log("Test Execution Started....");

        try {
            await roomsPageInstance.clickOnStartRoomButton();

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after creating the room
            await takeScreenshot(driver, 'tc006_startRoom', 'room_start_confirmation_page.png', this);

            // Confirm that the camera is on by checking for the presence of a video element
            const videoElement = await driver.wait(until.elementLocated(selectedRoomPageInstance.video), 10000);
            const isVideoDisplayed = await videoElement.isDisplayed();
            expect(isVideoDisplayed).to.be.true; // Use an assertion to verify that the video element is displayed
            console.log('Camera is on and video element is displayed');

            // Click on the video confirmation button
            await driver.sleep(2000); // Wait for 2 seconds
            await selectedRoomPageInstance.clickOnVideoConfirmationButton();

            await driver.sleep(2000); // Wait for 2 seconds
            // Take a screenshot after creating the room
            await takeScreenshot(driver, 'tc006_startRoom', 'started_room.png', this);
        }
        catch (error) {
            console.error('Error during the test:', error);
            throw error; // Rethrow the error to ensure the test fails
        }
    });
});