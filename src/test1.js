const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
  const executablePath  = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

  const browser = await puppeteer.launch({
    executablePath,
  });
  

  async function generateFile(targetPage, opt, outFileName) {
    const page = await browser.newPage();
    // await page.emulateMediaType('screen');
      
    const finished = new Promise(function(resolve, reject) {
      let timer = null;
      let timeoutTimer = null;
      let requestCount = 0;

      const onload = async function() {
        clearTimeout(timeoutTimer);
        await page.pdf({
          path: path.resolve(__dirname, `../output/${outFileName}.pdf`),
          // displayHeaderFooter: true,
          // headerTemplate: `<div style="color: red; font-size: 20px;">
          //   <span class="date"></span>
          //   <span style="padding-left: 200px; background-color: yellow;">hello word</span>
          //   <img src="http://localhost:8080/src/htmls/banner.jpg" style="width: 100px; height: 40px;" />
          // </div>`,
          // footerTemplate: `<div style="color: green; font-size: 20px;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
          printBackground: true,
          ...opt,
        });
  
        // await page.setViewport({
        //   width: 1000,
        //   height: 2000,
        // })
        // await page.screenshot({
        //   path: path.resolve(__dirname, `../output/${outFileName}.png`),
        // });
      };
      
      page.on('request', (req) => {
        requestCount++;
        console.log('requestCount:', requestCount, req.url())
        clearTimeout(timer);
      });
      page.on('requestfinished', () => {
        requestCount--;
        console.log('requestfinished! current requestCount: ', requestCount);
        if (!requestCount) {
          clearTimeout(timer);
          timer = setTimeout(async () => {
            await onload();
            resolve();
          }, 5000)
        }
      });

      timeoutTimer = setTimeout(async () => {
        clearTimeout(timer);
        await page.close();
        reject();
      }, 1000 * 60 * 10)
    });

    await page.goto(targetPage); 

    await finished;
  }
  



  // 生成内容
  // const bgPage = 'http://localhost:8080/src/htmls/bg.html';
  // await generateFile(bgPage, {
  //   format: 'A4',
  //   // margin: {
  //   //   top: '2cm',
  //   //   bottom: '2cm',
  //   //   left: '2cm',
  //   //   right: '4cm',
  //   // },
  // }, 'test1_bg');

  // const contentPage = 'http://localhost:8080/src/htmls/content.html';
  const contentPage = 'http://localhost/sample/template.html'
  await generateFile(contentPage, {
    // printBackground: false,
    // format: 'A4',
    width: '210mm',
    height: '297mm',
    margin: {
      top: '2cm', bottom: '2cm',
      left: '2cm', right: '2cm', 
    },
    // margin: {
    //   top: '2cm',
    //   bottom: '2cm',
    //   left: '2cm',
    //   right: '4cm',
    // },
  }, 'test1_content');

  await browser.close();
})();