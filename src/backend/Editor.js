const { PDFDocument } = require('pdf-lib');
fs = require('fs');


async function mergePDF(mainFile, mergeFile) {
    const mainPdf = await PDFDocument.load(fs.readFileSync(mainFile));
    const mergePdf = await PDFDocument.load(fs.readFileSync(mergeFile));

    let pagesArray = await mainPdf.copyPages(mergePdf, mergePdf.getPageIndices())

    for (const page of pagesArray) {
        mainPdf.addPage(page);
    }

    fs.writeFileSync("all-letters2.pdf", await mainPdf.save());

}
mergePDF("./output.pdf", "./demo.pdf")


async function reorderPDFpage(mainFile, fileName, arr) {

    const mainPdf = await PDFDocument.load(mainFile);
    // const mainPdf = await PDFDocument.load(fs.readFileSync(mainFile));

    let pagesArray = await mainPdf.copyPages(mainPdf, mainPdf.getPageIndices());

    for (let i = 0; i < arr.length; i++) {
        let [orderPage] = await mainPdf.copyPages(mainPdf, [arr[i]]);
        mainPdf.addPage(orderPage);
    }
    for (let i = 0; i < pagesArray.length; i++) {
        mainPdf.removePage(0);

    }

    fs.writeFileSync(fileName, await mainPdf.save());


}

//a = shuffle(a);
//console.log(a)
//reorderPDFpage("./kira-sozlesmesi.pdf", a)

module.exports.reorderPDFpage = reorderPDFpage;
module.exports.mergePDF = mergePDF;


/** 
async function removePage(file, removePage) {
    const mainPdf = await PDFDocument.load(fs.readFileSync(file));
    mainPdf.removePage(removePage - 1)
    fs.writeFileSync("reorder3.pdf", await mainPdf.save());

}
removePage("./reorder.pdf", 1)
*/
