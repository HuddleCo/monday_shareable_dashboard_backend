import puppeteer from 'puppeteer';
import fs from 'fs';
import tmp from 'tmp';

const USERNAME_SELECTOR = '#user_email';
const PASSWORD_SELECTOR = '#user_password';
const SUBMIT_SELECTOR = '#login-monday-container > div > div.router-wrapper > div > div.email-page > div > div.next-button-wrapper > div > button';
const MENU_SELECTOR = '#first-level-content > div > div > div.overview-header.board-header > div.overview-header-content-wrapper > div > div.overview-header-right > div > div > div.overview-menu > div > span > button';
const TV_MODE_SELECTOR = '#first-level-content > div.dialog-node > div > div > div > div.ds-menu-inner > div:nth-child(1)';
const LOGIN_URL = 'https://huddle3.monday.com/auth/login_monday/email_password';
const CLICK_TIMEOUT = 2000;

const startBrowser = () => puppeteer.launch({
  headless: process.env.HEADLESS === 'true',
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

const getDashboard = async (browser, username, password, dashboardUrl) => {
  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(username);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(password);
  await page.click(SUBMIT_SELECTOR);
  await page.waitForNavigation();
  await page.goto(dashboardUrl);
  await page.waitForSelector(MENU_SELECTOR);
  await page.click(MENU_SELECTOR);
  await page.waitForTimeout(CLICK_TIMEOUT);
  await page.click(TV_MODE_SELECTOR);
  await page.waitForTimeout(CLICK_TIMEOUT);
  return page.content();
};

const writeToFile = (data) => {
  const temporaryFile = tmp.fileSync({
    keep: true,
    prefix: 'monday-',
    postfix: '.html',
  });
  fs.writeFileSync(temporaryFile.name, data);

  return temporaryFile.name;
};

const getDashboardController = async (req, res) => {
  try {
    const browser = await startBrowser();
    const html = await getDashboard(
      browser,
      req.body.username,
      req.body.password,
      req.body.dashboardUrl,
    );
    const filename = writeToFile(html);
    await browser.close();

    res.send({
      // DEPRECATED: Remove url property in the next major release
      url: `${process.env.HOST}:${process.env.PORT}/share?filename=${filename}`,
      path: `/share?filename=${filename}`,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export default getDashboardController;
