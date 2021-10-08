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
const { Console, clear } = require("console");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin());
puppeteer.use(StealthPlugin());

async function checkIBAN(keyword, atempt) {
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
        await page.goto("https://www.pasts.lv/en/Category/Postal_Code_Look-up/");
        await page.waitForTimeout(2000);
        await page.setDefaultTimeout(12000);
        await page.setDefaultNavigationTimeout(5000);
        const input = await page.waitForSelector("#select_search_search");
        await input.click({ clickCount: 3 });

        // const __iban = "LT983100034835708537";
        await input.type(keyword, { delay: 40 });

        await page.waitForTimeout(4000);
        await page.waitForSelector("li.ui-menu-item");
        await page.waitForTimeout(1000);
        const addressesList = await page.$$("li.ui-menu-item");

        console.log(addressesList.length);
        const retKeywords = {};
        const retAddresses = {};
        for (let i in addressesList) {
            const row = {};
            const address = addressesList[i];
            addressString = await address.evaluate((el) => el.innerText);
            // console.log(addressString);
            const addressElements = addressString.split(",");
            if (addressElements.length !== 5) {
                continue;
            }
            row.address = addressElements[0].trim().replace(/['"]+/g, "");
            row.city = addressElements[1].trim().replace(/['"]+/g, "");
            row.zip = addressElements[4].trim().replace(/['"]+/g, "");
            // console.log(i, row);
            let key = row.address.toLowerCase();
            // key = key.trim().replace(/['"]+/g, "");

            retAddresses[key] = row;
            const kws = key.split(" ");
            for (let j in kws) {
                let kw = kws[j].trim();

                // const kw = kws[j].trim().replace(/['"]+/g, '');
                // const kw = kws[j].trim().replace('"', "");
                // const kw = kws[j].trim().replace(/\W/g, "");
                // let kw = kws[j].trim().replace('\"', "");
                // kw = kw.trim().replace('\"', "");
                // kw = kw.trim().replace('\"', "");
                // kw = kw.trim().replace('\"', "");

                if (kw.length > 3) retKeywords[kw] = false;
            }
        }
        // console.log("all", retKeywords);
        return [100, retAddresses, retKeywords];
    } catch (error) {
        // console.log(error);
        return [atempt + 1, [], []];
    } finally {
        await browser.close();
    }

    return 0;
}

async function main() {
    let kws = require("./kw-latvia.json");

    const args = process.argv;
    console.log("\n\n =============================== \n\n");
    for (let i in kws) {
        if (kws[i]) continue;
        const kw = i;
        if(kw.includes("/")) continue;
        console.log(kw);
        // const iban = args[i];
        let attempt = 0;
        let retKeywords = [];
        let retAddresses = [];
        while (true) {
            [attempt, retAddresses, retKeywords] = await checkIBAN(kw, attempt);
            console.log(attempt);
            if (attempt > 4) break;
            // return;
        }
        if (attempt !== 100) continue;
        fs.writeFileSync(`./addressCollector/latvia/${kw}.json`, JSON.stringify(retAddresses));
        kws[i] = true;
        kws = { ...retKeywords, ...kws };
        fs.writeFileSync(`./addressCollector/kw-latvia.json`, JSON.stringify(kws));
    }
}

main();
