const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function getScrapeStats(){
    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto('https://gol.gg/champion/list/season-S14/split-ALL/tournament-ALL/');

    
    await page.click('#leagues_top'); 
    await Promise.all([
        page.click('#btn_refresh'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }), 
    ]);

    
    const content = await page.content();

    const $ = cheerio.load(content);
    const tableData = [];

    $('table tr').each((i, row) => {
        const rowData = [];
        $(row).find('td').each((j, cell) => {
            let cellText = $(cell).text();
            if (j === 0) { 
                cellText = cellText.replace(/\n/g, '').trim(); 
            }
            if (j === 3 || j === 6) { 
                cellText = cellText.replace(/%/g, ''); 
            }
            if (j < 7) { 
                rowData.push(cellText);
            }
        });
        tableData.push(rowData);
    });

    
    const result = tableData.slice(6);

    await browser.close();

    return result;
}

module.exports = { getScrapeStats }