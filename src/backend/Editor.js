const { PDFDocument } = require('pdf-lib');
fs = require('fs');

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
    return await mainPdf.saveAsBase64({ dataUri: true });
}

async function reorderPDFpage(mainFile, fileName, arr) {

    const mainPdf = await PDFDocument.load(mainFile);

    let pagesArray = await mainPdf.copyPages(mainPdf, mainPdf.getPageIndices());

    for (let i = 0; i < arr.length; i++) {
        let [orderPage] = await mainPdf.copyPages(mainPdf, [arr[i]]);
        mainPdf.addPage(orderPage);
    }
    for (let i = 0; i < pagesArray.length; i++) {
        mainPdf.removePage(0);

    }
    return await mainPdf.saveAsBase64({ dataUri: true });

}

async function fillForm(x, y, width, height, content, ID) {
    const mainPdf = await PDFDocument.load(fs.readFileSync("./deneme.pdf"));
    let [orderPage] = await mainPdf.copyPages(mainPdf, [1]);
    const page = mainPdf.insertPage(1, orderPage)
    mainPdf.removePage(2);
    //const page = mainPdf.addPage(orderPage);   
    console.log(page)
    const form = mainPdf.getForm()
    
    page.drawText('Enter your favorite Tuniko:', { x: 50, y: 710, size: 10 })

    const superheroField = form.createTextField('favorite.superhero')
    superheroField.addToPage(page, { x: 55, y: 640,
        width: 50,
        height: 50,})
  

    fs.writeFileSync("all-letters2.pdf", await mainPdf.save());

}
fillForm();

module.exports.reorderPDFpage = reorderPDFpage;
module.exports.mergePDF = mergePDF;
