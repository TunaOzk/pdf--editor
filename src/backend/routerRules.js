const express = require("express");
const { reorderPDFpage, mergePDF, fillForm} = require('./Editor');
const app = express();
const port = 4000;
const cors = require("cors");
//const { reorderPDFpage } = require('./Editor.js');


app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cors());


app.post("/pdfMerge", async (req, res) => {
    let { finalPagesList, currentFileName, fileList } = req.body;
    let pdf = await mergePDF(finalPagesList, currentFileName, fileList);
    res.send(pdf)

})

app.post("/pdfFileIndex", async (req, res) => {
    let { currentPdfPages, currentFile, currentFileName } = req.body;

    let pdf = await reorderPDFpage(currentFile, currentFileName, currentPdfPages);
    res.send(pdf);

})

app.post("/pdfFileFillable", async (req, res) => {
    let {textAreaList, fileList, canvasSize} = req.body;
    const file = fileList[0]
    console.log(canvasSize.height)
    console.log(canvasSize.width)

    let page = 0; 
    const pageHeight = canvasSize.height;
    for (let i = 0; i < textAreaList.length; i++) {
        const [x] = textAreaList[i];

        if(typeof x !== 'undefined'){
            console.log(i);
            page = i;
        }
        
    }
    console.log("heheee");


    pdf = await fillForm(textAreaList[page], page, file, pageHeight);
    
    res.send(pdf);

})


app.listen(port, () => { })