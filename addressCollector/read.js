const fs = require("fs");
const path = require("path");
// const file = require("./latvia/172a.json");

const args = process.argv;

const count = args[3] ? args[3] : 10;
if (args[2] === "latvia") {
    const folder = fs.readdirSync("./addressCollector/latvia");
    console.log(folder);
    let i = 0;
    for (i = 0; i < count; ) {
        const fileName = folder[Math.floor(Math.random() * folder.length)];
        const file = fs.readFileSync(path.join("./addressCollector/latvia", fileName), "utf-8");
        const json = JSON.parse(file);
        const keys = Object.keys(json);
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        const address = json[randKey];
        if (address) {
            // console.log(address.address.match(/\d/g))
            if (address.address.match(/\d/g)) {
                i++;
                console.log(`${address.address};${address.city};${address.zip}`);
            }
        }
    }
}
