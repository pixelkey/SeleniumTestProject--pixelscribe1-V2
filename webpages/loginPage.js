import { By, until } from 'selenium-webdriver';
import { getLocator } from './locator.js';

class loginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async loginWithEmailAndPassword(username, password) {
        const emailLocator = getLocator('loginPage', 'emailTextbox');
        const passwordLocator = getLocator('loginPage', 'passwordTextbox');
        const loginButtonLocator = getLocator('loginPage', 'loginButton');
        const loginWithEmailPasswordLocator = getLocator('loginPage', 'loginWithEmailPassword');

        // Click on the "Login with Email and Password" option
        await this.driver.findElement(By.xpath(loginWithEmailPasswordLocator.value)).click();
        // Enter the email address into the email textbox
        await this.driver.findElement(By.xpath(emailLocator.value)).sendKeys(username);
        // Wait until the password textbox is located (up to 5 seconds)
        const passwordElement = await this.driver.wait(until.elementLocated(By.xpath(passwordLocator.value)), 5000);
        // Wait until the password textbox is visible (up to 5 seconds)
        await this.driver.wait(until.elementIsVisible(passwordElement), 5000);
        // Enter the password into the password textbox
        await passwordElement.sendKeys(password);
        // Click on the login button to submit the form
        await this.driver.findElement(By.xpath(loginButtonLocator.value)).click();
    }
}

export default loginPage;