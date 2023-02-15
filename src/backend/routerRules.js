const express = require("express");
const { reorderPDFpage } = require('./Editor');
const { mergePDF } = require('./Editor');
const app = express();
const port = 4000;
const cors = require("cors");
//const { reorderPDFpage } = require('./Editor.js');


app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cors());

app.post("/pdfMerge", async (req, res) => {
    let { pdfPagesList, currentFileName, fileList} = req.body
    console.log(pdfPagesList);
    console.log(fileList);

    console.log(currentFileName);
    await mergePDF(pdfPagesList, currentFileName, fileList);
})

app.post("/pdfFileIndex", async (req, res) => {
    let { currentPdfPages, currentFile, currentFileName } = req.body;

    for (let index = 0; index < 1; index++) {
        await reorderPDFpage(currentFile, currentFileName, currentPdfPages);
    }
})


app.listen(port, () => { })