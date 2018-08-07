const puppeteer = require('puppeteer');
var fs = require('fs');



(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const baseUrl = 'https://portal.biobase-international.com/hgmd/pro/gene.php?gene='
  
  const genes = ['hmbs','cpox','ppox','alad','urod','uros','fech','alas2']
  let data = {}
  for (let i = 0; i < genes.length; i++) {
    await page.goto(baseUrl + genes[i]) 
    data[genes[i]] = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll("body > div.content > form > table:nth-child(5) tr.odd, body > div.content > form > table:nth-child(5) tr.even"))
      return trs.map(tr => {
        let tds = tr.childNodes
        return {
          mut: tds[0].innerText,
          num: tds[1].innerText,
        }
      });
    })
  }
  fs.writeFile("./results.json", JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
  await browser.close()
})();
