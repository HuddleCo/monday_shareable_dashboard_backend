import puppeteer from 'puppeteer';
import fs from 'fs';
import tmp from 'tmp';

const USERNAME_SELECTOR = '#user_email';
const PASSWORD_SELECTOR = '#user_password';
const SUBMIT_SELECTOR = '#login-monday-container > div > div.router-wrapper > div > div.email-page > div > div.next-button-wrapper > div > button';
const MENU_SELECTOR = '#first-level-content > div > div > div.overview-header.board-header > div.overview-header-content-wrapper > div > div.overview-header-right > div > div > div.overview-menu > div > span > button';
const TV_MODE_SELECTOR = '#first-level-content > div.dialog-node > div > div > div > div.ds-menu-inner > div:nth-child(1)';
const CLICK_TIMEOUT = 2000;

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS === 'true',
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();

  return { browser, page };
};

const closeBrowser = (browser) => browser.close();

const login = async (page, username, password) => {
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(username);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(password);
  await page.click(SUBMIT_SELECTOR);
  await page.waitForNavigation();
};

const getDashboard = async (page) => {
  await page.waitForSelector(MENU_SELECTOR);
  await page.click(MENU_SELECTOR);
  await page.waitForTimeout(CLICK_TIMEOUT);
  await page.click(TV_MODE_SELECTOR);
  await page.waitForTimeout(CLICK_TIMEOUT);
  const html = await page.content();

  const tmpobj = tmp.fileSync({
    keep: true,
    prefix: 'monday-',
    postfix: '.html',
  });
  fs.writeFileSync(tmpobj.name, html);

  return tmpobj.name;
};

const getDashboardController = async (req, res) => {
  try {
    const { username, password, dashboardUrl } = req.body;

    const { browser, page } = await startBrowser();

    await page.goto('https://huddle3.monday.com/auth/login_monday/email_password');
    await login(page, username, password);
    await page.goto(dashboardUrl);
    const filename = await getDashboard(page);

    await closeBrowser(browser);

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
