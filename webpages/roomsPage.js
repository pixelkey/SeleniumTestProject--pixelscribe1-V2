import { By, until } from 'selenium-webdriver';
import { getLocator } from './locator.js';

class roomsPage {
    constructor(driver) {
        this.driver = driver;
    }

    async getRoomTitle() {
        const locator = getLocator('roomsPage', 'roomTitle');
        await this.driver.wait(until.elementLocated(By.xpath(locator.value)), 5000);
        return await this.driver.findElement(By.xpath(locator.value)).getText();
    }

    async typeNewRoomName(roomName) {
        const locator = getLocator('roomsPage', 'newRoomNameTextbox');
        await this.driver.findElement(By.xpath(locator.value)).sendKeys(roomName);
    }

    async clickOnCreateRoomButton() {
        const locator = getLocator('roomsPage', 'createRoomButton');
        await this.driver.findElement(By.xpath(locator.value)).click();
    }

    async waitForCreatedNewRoom(timeout) {
        const locator = getLocator('roomsPage', 'createdNewRoom');
        await this.driver.wait(until.elementLocated(By.xpath(locator.value)), timeout);
    }

    async assertCreatedNewRoom(attribute, expectedValue) {
        const locator = getLocator('roomsPage', 'createdNewRoom');
        const element = await this.driver.findElement(By.xpath(locator.value));
        const attributeValue = await element.getAttribute(attribute);
        expect(attributeValue).to.equal(expectedValue);
    }

    async clickOnDeleteRoomButton() {
        const locator = getLocator('roomsPage', 'deleteRoomButton');
        await this.driver.findElement(By.xpath(locator.value)).click();
    }

    // async clickOnDeleteRoomButton() {
    //     const locator = getLocator('roomsPage', 'deleteRoomButton');
    //     await this.driver.findElement(By.xpath(locator.value)).click();
    // }
}

export default roomsPage;