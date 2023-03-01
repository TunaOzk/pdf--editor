const express = require("express");
const { reorderPDFpage, mergePDF, fillForm, pdfSplit } = require('./Editor');
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

    let [pdf] = await reorderPDFpage(currentFile, currentFileName, currentPdfPages);
    res.send(pdf);

})
app.post("/pdfSplitFileIndex", async (req, res) => {
    let { splitPdfPages, currentFile } = req.body;

    let pdf = await pdfSplit(currentFile, splitPdfPages);

    res.send(pdf);


})
app.post("/pdfFileFillable", async (req, res) => {
    let { textAreaList, fileList } = req.body;
    const file = fileList[0];

    pdf = await fillForm(textAreaList, file);

    res.send(pdf);

})


app.listen(port, () => { })