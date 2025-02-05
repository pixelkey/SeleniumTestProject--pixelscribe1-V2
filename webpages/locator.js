import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locatorsPath = path.join(__dirname, 'locator.json');
const locators = JSON.parse(fs.readFileSync(locatorsPath, 'utf-8'));

export function getLocator(pageName, name) {
    const locator = locators.steps.find(locator => locator.pageName === pageName && locator.name === name);
    if (!locator) {
        throw new Error(`Locator not found for page: ${pageName}, name: ${name}`);
    }
    return locator.locator;
}

export function getVariable(name) {
    const variable = locators.variables.find(variable => variable.name === name);
    if (!variable) {
        throw new Error(`Variable not found: ${name}`);
    }
    return variable.value;
}

export function getSteps() {
    return locators.steps.map(step => {
        if (step.url && locators.variables.some(variable => variable.name === step.url)) {
            step.url = getVariable(step.url);
        }
        if (step.email && locators.variables.some(variable => variable.name === step.email)) {
            step.email = getVariable(step.email);
        }
        if (step.password && locators.variables.some(variable => variable.name === step.password)) {
            step.password = getVariable(step.password);
        }
        if (step.value && locators.variables.some(variable => variable.name === step.value)) {
            step.value = getVariable(step.value);
        }
        return step;
    });
}

