const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a constant named MAX_CAPACITY and set it to 500', async function() {
    const MAX_CAPACITY = await page.evaluate(() => MAX_CAPACITY);
    expect(MAX_CAPACITY).toBeDefined();
    expect(MAX_CAPACITY).toBe(500);
  });

  it('should assign the innerHTML of the HTML element with the id result to MAX_CAPACITY', async function() {
    const MAX_CAPACITY = await page.evaluate(() => MAX_CAPACITY);
    const innerHtml = await page.$eval("#result", (result) => {
      return result.innerHTML;
    });

    expect(innerHtml).toBe(MAX_CAPACITY.toString());
  });
});

