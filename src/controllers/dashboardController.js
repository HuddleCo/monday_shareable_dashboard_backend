import puppeteer from "puppeteer";

import fs from "fs";
import tmp from "tmp";

const usernameSelector = "#user_email";
const passwordSelector = "#user_password";
const submitSelector =
  "#login-monday-container > div > div.router-wrapper > div > div.email-page > div > div.next-button-wrapper > div > button";
const dotSelector =
  "#first-level-content > div > div > div.overview-header.board-header > div.overview-header-content-wrapper > div > div.overview-header-right > div > div > div.overview-menu > div > span > button";
const tvModeSelector =
  "#first-level-content > div.dialog-node > div > div > div > div.ds-menu-inner > div:nth-child(1)";

async function startBrowser() {
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS == 'true',
  });
  const page = await browser.newPage();

  return { browser, page };
}

async function closeBrowser(browser) {
  return browser.close();
}

async function login(page, username, password) {
  await page.click(usernameSelector);
  await page.keyboard.type(username);
  await page.click(passwordSelector);
  await page.keyboard.type(password);
  await page.click(submitSelector);
  await page.waitForNavigation();
}

async function getDashboard(page) {
  await page.waitForSelector(dotSelector);
  await page.click(dotSelector);
  await page.waitForTimeout(2000);
  await page.click(tvModeSelector);
  await page.waitForTimeout(2000);
  const html = await page.content();

  const tmpobj = tmp.fileSync({
    keep: true,
    prefix: "monday-",
    postfix: ".html",
  });
  fs.writeFileSync(tmpobj.name, html);

  return tmpobj.name;
}

const getDashboardController = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const dashboardUrl = req.body.dashboardUrl;

    const { browser, page } = await startBrowser();

    await page.goto("https://huddle3.monday.com/auth/login_monday/email_password");
    await login(page, username, password);
    await page.goto(dashboardUrl);
    const filename = await getDashboard(page);

    await closeBrowser(browser);

    res.send({
      url: `${process.env.HOST}:${process.env.PORT}/share?filename=${filename}`,
      path: `/share?filename=${filename}`
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export { getDashboardController };
