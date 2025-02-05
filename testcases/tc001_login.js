import { expect } from 'chai';
import { getSteps } from '../webpages/locator.js';
import loginPage from '../webpages/loginPage.js';
import createDriver from '../browserInitiation.js';

describe('Login Test', function () {
    let driver;
    let loginPageInstance;

    before(async function () {
        driver = await createDriver();
        loginPageInstance = new loginPage(driver);
    });

    after(async function () {
        //await driver.quit();
    });

    it('Validate login with valid credentials', async function () {
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
                }
            }
        } catch (error) {
            console.error('Error during the test:', error);
            throw error;
        }
    });
});