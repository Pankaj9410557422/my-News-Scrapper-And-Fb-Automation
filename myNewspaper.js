let cheerio = require("cheerio");
let request = require("request");
let PDFDocument = require('pdfkit');
let  puppeteer = require("puppeteer");
let {phone, pass, filesel} = require("./idpass");
let fs = require("fs");
let input = process.argv[2];
let writeStream = fs.createWriteStream("TopNews.txt");
let url ="https://inshorts.com/en/read";
let catArr=['national','business','sports','world'];

getRequest(url+"/"+catArr[0]).then(function (html) {
   let selTool = cheerio.load(html);
   let top10NewsElement = selTool("span[itemprop='headline']");
   writeStream.write(".......................NATIONAL.......................\n");
   
   for(let i=0; i<5;i++){
      // console.log(selTool(top10NewsElement[i]).text());
      
      let str = selTool(top10NewsElement[i]).text();
      writeStream.write(str+"\n");
   }
    return getRequest(url+"/"+catArr[1]);
}).then(function (html) {
   let selTool = cheerio.load(html);
   let top10NewsElement = selTool("span[itemprop='headline']");
   writeStream.write(".......................BUSINESS.......................\n");
   for(let i=0; i<5;i++){
      //console.log(selTool(top10NewsElement[i]).text());
      let str = selTool(top10NewsElement[i]).text();
      writeStream.write(str+"\n");
   }
    return getRequest(url+"/"+catArr[2]);
}).then(function (html) {
   let selTool = cheerio.load(html);
   let top10NewsElement = selTool("span[itemprop='headline']");
   writeStream.write(".......................SPORTS.......................\n");
   for(let i=0; i<5;i++){
      //console.log(selTool(top10NewsElement[i]).text());
      let str = selTool(top10NewsElement[i]).text();
      writeStream.write(str+"\n");
   }
   return getRequest(url+"/"+catArr[3]);
}).then(function (html) {
   let selTool = cheerio.load(html);
   let top10NewsElement = selTool("span[itemprop='headline']");
   writeStream.write(".......................WORLD.......................\n");
   for(let i=0; i<5;i++){
      //console.log(selTool(top10NewsElement[i]).text());
      let str = selTool(top10NewsElement[i]).text();
      writeStream.write(str+"\n");
   }
}).then(whatsApp);

function getRequest(url) {
    return new Promise(function (success, failure) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                success(body);
            } else {
                failure(error);
            }
        });
    });
}
async function whatsApp(){
   let browserInstance = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized",]
   });
   let newTab =await browserInstance.newPage();
   await newTab.goto("https://www.facebook.com/");
   await newTab.type("[aria-label='Email address or phone number']",phone);
   await newTab.type("[aria-label='Password']",pass);
   await newTab.click("button[type='submit']");
   await newTab.waitForSelector("input[type='search']",{visible:true});
   await newTab.click("input[type='search']");
   await newTab.type("input[type='search']",input);
   await newTab.keyboard.press("Enter");
   await newTab.waitForSelector("[aria-label='News Headlines']",{visible:true});
   await newTab.click("[aria-label='News Headlines']");
   await newTab.waitForSelector("[aria-label='Create Post']",{visible:true});
   await newTab.click("[aria-label='Create Post']");
   await newTab.waitForSelector("[aria-label='More']",{visible:true});
   await newTab.click("[aria-label='More']");
   
   // await newTab.waitForSelector(filesel,{visible:true});
   // let [filechooser] = await Promise.all([
   //    newTab.waitForFileChooser(),
   //    newTab.click(filesel)
   // ]);
   // await filechooser.accept(["C:\\Users\\asus.LAPTOP-F97U0B83\\Desktop\\pep tests and assignment\\hackathon\\TopNews.txt"]);
   //await browserInstance.close();
   //[aria-label='More']
   
   
}

// node myNewspaper.js "News Headlines"
