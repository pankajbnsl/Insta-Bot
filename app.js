const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

// Selenium WebDriver setup
const driver = new Builder().forBrowser('chrome').build();

// Instagram credentials
const username = '9560681357';
const password = 'passworddd';

// Path to the JSON file with href links
const jsonFilePath = './pending.json';

async function loginToInstagram() {
    await driver.get('https://www.instagram.com/accounts/login/');
    await driver.sleep(2000); // Wait for page to load

    // Enter username and password
    await driver.findElement(By.name('username')).sendKeys(username);
    await driver.findElement(By.name('password')).sendKeys(password);

    // Click the login button
    await driver.findElement(By.xpath('//*[@id="loginForm"]/div/div[3]/button')).click();
    await driver.sleep(8000); // Wait for login
    await driver.findElement(By.xpath('//div[contains(text(), "Not Now")]')).click();
    
    await driver.sleep(2000);
    // Check for 'Not Now' for notifications (if present)
    try {
        await driver.findElement(By.xpath('//button[contains(text(), "Not Now")]')).click();
    } catch (error) {
        // Button may not be present
    }
}

async function handleInstagramLinks() {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    const linksArray = jsonData.relationships_follow_requests_sent.map(item => item.string_list_data[0].href);
    console.log(linksArray);
    for (const href of linksArray) {
        await driver.get(href);
        await driver.sleep(2000); // Wait for page to load

        try {
            const followButton = await driver.findElements(By.xpath('//div[contains(text(), "Requested")]'));

            if (followButton.length > 0) {
                await driver.findElement(By.xpath('//div[contains(text(), "Requested")]')).click();
                await driver.sleep(1000);
                await driver.findElement(By.xpath('//button[contains(text(), "Unfollow")]')).click();
                console.log(`Requested: ${href}`);
                await driver.sleep(1000); // Wait after clicking Requested
            } else {
                console.log(`Button not found or text not recognized: ${href}`);
            }
            
            
        } catch (error) {
            console.log(error);
            console.log(`Error following: ${href}`);
        }
    }
}

async function main() {
    try {
        await loginToInstagram();
        await handleInstagramLinks();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        // await driver.quit();
    }
}

main();

