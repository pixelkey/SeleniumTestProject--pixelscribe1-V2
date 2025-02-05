// import { By, until } from 'selenium-webdriver';

// class selectedRoomPage {
//     constructor(driver) {
//         this.driver = driver;

//         // Define locators for elements on the page
//         this.video=By.xpath("//*[@id = 'video']");
//         this.videoSettingConfirmationButton=By.xpath("//*[@id = 'hide-device-settings' and @class='button']");
//     }

//     async clickOnVideoConfirmationButton() {
//         await this.driver.findElement(this.videoSettingConfirmationButton).click();
//     }
// }

// export default selectedRoomPage;

import { By, until } from 'selenium-webdriver';
import { getLocator } from './locator.js'; // Import the getLocator function

class SelectedRoomPage {
    constructor(driver) {
        this.driver = driver;

        // Define locators for elements on the page using the JSON file
        this.video = By.xpath(getLocator('SelectedRoomPage', 'video'));
        this.videoSettingConfirmationButton = By.xpath(getLocator('SelectedRoomPage', 'videoSettingConfirmationButton'));
    }

    async clickOnVideoConfirmationButton() {
        await this.driver.findElement(this.videoSettingConfirmationButton).click();
    }
}

export default SelectedRoomPage;