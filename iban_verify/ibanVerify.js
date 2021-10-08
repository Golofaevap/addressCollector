// node actions2/1addNewUser.js
// golofaeva.xs4n@gmail.com
// @e4YGyfB7mpY5h@@
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const extract = require("extract-zip");
const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const http = require("https"); // or 'https' for https:// URLs

const _ = require("lodash");
const colors = require("colors");
const validator = require("email-validator");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const getBrowser = require("../pptFunctions/getBrowser");
const newPage = require("../pptFunctions/newPage");
const { Console } = require("console");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin());
puppeteer.use(StealthPlugin());

async function checkIBAN(__iban, atempt) {
    const opts = { headless: true, userDataDirPath: "./session", width: 1280, height: 720 };
    const browser = await getBrowser(opts);
    try {
        const page = await newPage(browser, opts);
        // page.on("request", (request) => {
        //     // var domain = null;
        //     var url = request.url();
        //     console.log("url:", url);
        //     if (url.includes("google")) {
        //         request.abort();
        //     } else {
        //         request.continue();
        //     }
        // });
        await page.goto("https://www.ibancalculator.com/iban_validieren.html");
        await page.waitForTimeout(10000);
        await page.setDefaultTimeout(12000);
        const hosts = {
            "www.ibancalculator.com": 1,
        };

        await page.setDefaultNavigationTimeout(500);
        const form = await page.waitForSelector("form");
        const input = await form.$("input");

        // const __iban = "LT983100034835708537";
        await input.type(__iban);

        const button = await form.$("button");
        await button.click();

        await page.waitForTimeout(3000);

        const allFields = await page.waitForSelector('div[class="tx-valIBAN-pi1"]');
        // await page.evaluate(() => window.stop());
        const fieldsets = await allFields.$$("fieldset");
        // console.log(fieldsets.length);

        const fieldset = fieldsets[2];

        const fieldsetText = await fieldset.evaluate((el) => {
            return el.innerText;
        });
        // console.log(fieldsetText);

        const isValid = fieldsetText.includes("This is a valid IBAN.");
        if (!isValid) {
            console.log(__iban, __iban, "NONE", "NONE");
        }
        let iban = "NONE",
            bic = "NONE",
            bank = "NONE";
        try {
            iban = fieldsetText.split("IBAN:")[1].split("IBAN")[0].trim();
        } catch (error) {}
        try {
            bic = fieldsetText.split("BIC:")[1].split("BIC")[0].trim();
        } catch (error) {}
        try {
            bank = fieldsetText.split("Bank:")[1].split("\n")[0].trim();
        } catch (error) {}

        // console.log(__iban, iban, bic, bank);
        console.log(`${__iban};${iban};${bic};${bank}`);
        // await browser.close();
        return 100;
    } catch (error) {
        // console.log(error);
        return atempt + 1;
    } finally {
        await browser.close();
    }

    return 0;
}

async function main() {
    const args = process.argv;
    console.log("\n\n =============================== \n\n")
    for (let i = 2; i < args.length; i++) {
        const iban = args[i];
        let attempt = 0;
        {
            while (attempt < 5) {
                attempt = await checkIBAN(iban, attempt);
            }
        }
    }
}

main();
