// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
var numItems = 10;
var i = 0;
const { chromium } = require("playwright");
const fs = require('fs');

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // ensure page load
  await page.waitForTimeout(1000);

  // get data
  const extractedTitles = await page.$$eval('.titleline', titles => {
    const arrayData = [];
    titles.forEach(titles => {
      const title = titles.querySelector('a').textContent.trim();
      const url = titles.querySelector('a').getAttribute('href');
      arrayData.push({title, url});
    });
    return arrayData;
  });

  // aggregate csv data
  var csvData = "Title,Url\n";
  while (i < numItems) {
    let title = extractedTitles[i].title;
    title = title.replace(/,/g, '');
    csvData = csvData + title + ',' + extractedTitles[i].url + '\n';
    i++;
  };

  // add csv data to csv file  
  fs.writeFile("list.csv",csvData, err => {if (err) throw err;});
  console.log("Done.");

  // Close browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
