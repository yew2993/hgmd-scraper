const puppeteer = require('puppeteer')
const parseArgs = require('minimist')

(async () => {
  const genePage = {
    getMutationTypeTable: {
      evaluate: ({gene}) => {
        let trs = Array.from(document.querySelectorAll("body > div.content > form > table:nth-child(5) tr"))
        return trs.reduce((info, {childNodes: tds}) => {
          return {
            ...info, 
            [tds[0].innerText]: tds[1].innerText,
          }
        }, {gene})
      }
    }
  }
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const baseUrl = 'https://portal.biobase-international.com/hgmd/pro/gene.php?gene='

  const genes = ['hmbs','cpox','ppox','alad','urod','uros','fech','alas2']
  let data = []

  for (let i = 0; i < genes.length; i++) {
    await page.goto(baseUrl + genes[i]) 
    data.push(await page.evaluate(genePage.getMutationTypeTable.evaluate, {gene: genes[i]}))
  }

  console.log(data)
  
  await browser.close()
})();