const express = require("express");
const { reorderPDFpage } = require('./Editor');
const { mergePDF } = require('./Editor');
const { addCanvasToPDF } = require('./Editor');
const { fillForm } = require('./Editor');
const app = express();
const port = 4000;
const cors = require("cors");
//const { reorderPDFpage } = require('./Editor.js');


app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cors());


app.post("/pdfMerge", async (req, res) => {
    let { finalPagesList, currentFileName, fileList } = req.body;
    let a = await mergePDF(finalPagesList, currentFileName, fileList);
    res.send(a)

})

app.post("/pdfFileIndex", async (req, res) => {
    let { currentPdfPages, currentFile, currentFileName } = req.body;

    let a = await reorderPDFpage(currentFile, currentFileName, currentPdfPages);
    res.send(a);

})

app.post("/pdfEdit", async (req, res) => {
    let { textAreaList, file, base64Canvas, screenSize } = req.body;
    let a = await fillForm(textAreaList, file, base64Canvas, screenSize);
    res.send(a);

})


app.listen(port, () => { })