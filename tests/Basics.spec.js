const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://playwright.dev/docs/intro');
    console.log(await page.title());
    await expect(page).toHaveTitle('Installation | Playwright');
});

test('Page context playwright test', async ({ page }) => {

    await page.goto('https://www.google.co.in/');
    await expect(page).toHaveTitle('Google');
});

test("Verify Invalid login error text", async ({ page }) => {

    const username = page.locator("#username");
    const password = page.locator("#password");
    const signInButton = page.locator("#signInBtn");
    const errorText = page.locator("[style*='block']");
    const usernameAndPassword = page.locator("p[class*='text-center'] i");
    const productTitles = page.locator(".card-body a");
    const checkoutButton = page.locator("[id='navbarResponsive'] a");

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    const validUser = await usernameAndPassword.nth(0).textContent();
    const validPassword = await usernameAndPassword.nth(1).textContent();

    await username.type(validUser);
    await password.type(validPassword + '1');
    await signInButton.click();

    console.log(await errorText.textContent());
    await expect(errorText).toHaveText('Incorrect username/password.');

    await password.fill("");
    await password.fill(validPassword);
    await signInButton.click();

    await checkoutButton.waitFor();
    const titles = await productTitles.allTextContents();
    console.log(titles);
});

test('Web Client App login', async ({ page }) => {

    const email = "anshika@gmail.com";
    const password = "Iamking@000";

    const userEmail = page.locator("#userEmail");
    const userPassword = page.locator("#userPassword");
    const loginButton = page.locator("[value='Login']");
    const productTitles = page.locator(".card-body b");

    await page.goto("https://rahulshettyacademy.com/client");
    await userEmail.fill(email);
    await userPassword.fill(password);
    await loginButton.click();

    await page.waitForLoadState('networkidle');
    //await productTitles.first().waitFor();
    const titles = await productTitles.allTextContents();
    console.log(titles);
});

test('UI Controls', async ({ page }) => {

    const userEmail = page.locator("#userEmail");
    const checkbox = page.locator("#terms");
    const dropdown = page.locator("select[class='form-control']");
    const radioButton = (value) => page.locator("[value='" + value.toLowerCase() + "']");
    const popupOkayButton = page.locator("#okayBtn");
    const externalLink = page.locator("[class='blinkingText']");

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    expect(await checkbox.isChecked()).toBeFalsy();
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await dropdown.selectOption('Consultant');
    await radioButton("User").click();
    await popupOkayButton.click();
    await expect(radioButton("User")).toBeChecked();
    await expect(externalLink).toHaveAttribute("href", "https://rahulshettyacademy.com/documents-request");
});

test('New Tab 1', async ({ page, context }) => {

    const username = page.locator("#username");
    const externalLink = page.locator("[class='blinkingText']");
    const lockIcon = page.locator("[class*='lock']");

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    const pagePromise = page.waitForEvent('popup');
    await externalLink.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    const text = newPage.locator("[class='im-para red']");

    let email = await text.textContent();
    await expect(text).toHaveText("Please email us at mentor@rahulshettyacademy.com with below template to receive response");

    email = email.split('@')[1].split('.')[0];

    await newPage.close();
    await expect(lockIcon).toBeVisible();
    await username.fill(email);

    const [newPage1] = await Promise.all([
        context.waitForEvent('page'),
        externalLink.click()
    ]);

    await newPage1.waitForLoadState();
    newPage1.close();
});

test('Playwright Special locators', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", { name: 'Submit' }).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link", { name: "Shop" }).click();
    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button").click();
});

test.only('Playwright Dialogs, Frames and Event Listener', async ({ page }) => {

    const hideButton = page.locator("#hide-textbox");
    const showButton = page.locator("#show-textbox");
    const hideShowTextbox = page.locator("#displayed-text");
    const alertButton = page.locator("#alertbtn");
    const confirmButton = page.locator("#confirmbtn");
    const framesPage = page.frameLocator("#courses-iframe");
    const allAccessPlanLink = framesPage.locator(".header-upper li a[href='lifetime-access']");
    const subscribersText = framesPage.locator(".text h2");

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(hideShowTextbox).toBeVisible();
    await hideButton.click();
    await expect(hideShowTextbox).toBeHidden();
    await showButton.click();
    await expect(hideShowTextbox).toBeVisible();

    page.on('dialog', dialog => dialog.accept());
    await alertButton.click();
    await confirmButton.click();

    await page.mouse.wheel(0, 800);
    await allAccessPlanLink.click();
    const text = await subscribersText.textContent();
    console.log(text.split(" ")[1]);
});