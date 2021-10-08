const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const _ = require("lodash");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const cookiesExtention = "C:\\Users\\nntve\\Desktop\\code\\puppeteer\\godaddy-farm-bot\\extentions\\cookies.txt";
async function getBrowser(opts) {
    try {
        const browser = await puppeteer.launch({
            headless: opts.headless,
            userDataDir: opts.userDataDirPath,
            ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
            args: [
                // `--proxy-server=${proxy}`,
                "--no-sandbox",
                "--disable-setuid-sandbox",
                `--start-maximized`,
                // `--load-extension=${cookiesExtention}`,
                "--disable-infobars",
                `--window-size=${opts.width},${opts.height}`,
            ],
        });
        return browser;
    } catch (error) {
        console.log(error);
    }
    return null;
}

module.exports = getBrowser;
