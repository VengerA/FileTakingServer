const url = require('url');
const http = require('http');
const puppeteer = require('puppeteer');
const express = require('express');
const scrape = require('website-scraper');
const bodyParser = require('body-parser');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
const fs = require('file-system');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
    let options = {
        url: 'https://www.jotform.com/'+req.body.url
    };

    let urlList = []

    

    puppeteer.launch({ headless: true, defaultViewport: { width: 1600, height: 800 } }).then(async browser => {
        const page = await browser.newPage();

        await page.goto(options.url);
        page.on('response', async (response) => {
            let url = new URL(response.url());
           
            for (const frame of page.mainFrame().childFrames()){
                // Here you can use few identifying methods like url(),name(),title()
                if (frame.url().includes('jotform')){
                    // we assign this frame to myFrame to use it later
                    // await browser.close(); 
                    takeRequests(frame.url(), req.body.url)
                }
            } 
            
        }) 
        
        // webScrapper(options.url, req.body.url)
    });
});

const takeRequests = (url, id) => {
    console.log('step4')
    puppeteer.launch({headless: false}).then(async browser =>{
        const page =  await browser.newPage();
    
        await page.goto(url)
        // console.log('new url:', url)
        console.log("step6")
        page.on('response', async response=> {
            console.log("step7")
            console.log('frame response', response);
            let filePath = path.resolve(`./`+ id.toString()+'/');
            console.log(filePath)
            // if (path.extname(url.pathname).trim() === '') {
            //     filePath = `${filePath}/index.html`;
            // }
            console.log("step7")
            fs.chmod(filePath, 0o777, (err) => {
                console.log("Error Geldu Uleyyn:",err)
            })
            fse.outputFile(filePath, response.buffer());
        });
        
    // for (const frame of page.mainFrame().childFrames()){
    //     // Here you can use few identifying methods like url(),name(),title()
    //     if (frame.url().includes('jotform')){
    //         console.log('we found the Twitter iframe')
    //         // we assign this frame to myFrame to use it later
    //     }
    // }
        // await browser.close(); 
    }) 
}

const webScrapper = (url, id) => {
    const scrape = require('website-scraper');
    const options = {
    urls: [url],
    directory: './' + id.toString(),
    };
    scrape(options)
        // .then((result) => {        
        //     console.log(result);
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
}
    
    



app.listen(3006);