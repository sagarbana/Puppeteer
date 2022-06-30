// const puppeteer = require('puppeteer-core');

const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

async function download(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        const request = https.get(url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
                resolve(file.close());
                console.log("done");
            });
        })
    })

}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/wallpapers/');
    let pageContent = await page.content();
    let images = await page.evaluate(() => {
        return Array.from(document.images, e => e.src)
    })
    let result;
    console.log(images);
    for (let i = 0; i < images.length; i++) {
        if (images[i].indexOf('preview') != -1) {
            result = await download(images[i], `image-${i}.png`);
        }

    }

    //   await browser.close();
})();