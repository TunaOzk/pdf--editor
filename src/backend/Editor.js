const download = require('downloadjs');
const { PDFDocument } = require('pdf-lib');
fs = require('fs');
download = require("downloadjs");


async function mergePDF(pdfPagesList, currentFileName, fileList) {
    const mainPdf = await PDFDocument.load(fileList[0]);

    let pagesArray = await mainPdf.copyPages(mainPdf, mainPdf.getPageIndices())

    for (let j = 0; j < pdfPagesList[0].length; j++) {
        let [orderPage] = await mainPdf.copyPages(mainPdf, [pdfPagesList[0][j]]);
        mainPdf.addPage(orderPage);
    }
    for (let j = 0; j < pagesArray.length; j++) {
        mainPdf.removePage(0);

    }

    for (let i = 1; i < fileList.length; i++) {
        const mergePdf = await PDFDocument.load(fileList[i]);

        let pagesArray = await mainPdf.copyPages(mergePdf, mergePdf.getPageIndices())

        for (let j = 0; j < pdfPagesList[i].length; j++) {
            let [orderPage] = await mergePdf.copyPages(mergePdf, [pdfPagesList[i][j]]);
            mergePdf.addPage(orderPage);
        }
        for (let j = 0; j < pagesArray.length; j++) {
            mergePdf.removePage(0);
    
        }

        pagesArray = await mainPdf.copyPages(mergePdf, mergePdf.getPageIndices())
        for (const page of pagesArray) {
            mainPdf.addPage(page);
        }
        
    }
    //const mergePdf = await PDFDocument.load(fs.readFileSync(mergeFile));

    //let pagesArray = await mainPdf.copyPages(mergePdf, mergePdf.getPageIndices())

    // for (const page of pagesArray) {
    //     mainPdf.addPage(page);
    // }

    download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");


}


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
