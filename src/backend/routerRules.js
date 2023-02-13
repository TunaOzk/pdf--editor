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
let index;
app.post("/pdfFile", async (req, res) => {
    let { currentFile } = req.body
    console.log(currentFile);
})

var a = []
for (a = [], i = 0; i < 3; ++i) a[i] = i;

function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}

a = shuffle(a);
console.log(a)

app.post("/pdfFile2", async (req, res) => {
    let { currentPdfPages } = req.body;
    console.log(currentPdfPages);

    for (let index = 0; index < 1; index++) {
        await reorderPDFpage('./tuna.pdf', 'denem.pdf', currentPdfPages);
    }
})


app.listen(port, () => { })