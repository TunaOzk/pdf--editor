const { PDFDocument } = require('pdf-lib');
const { string, number } = require('prop-types');
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

async function fillForm(textAreaList, file) {
    let currPage = 0;
    const mainPdf = await PDFDocument.load(file);

    for (let i = 0; i < textAreaList.length; i++) {
        const [x] = textAreaList[i];

        if (typeof x !== 'undefined') {
            currPage = i;
            for (let j = 0; j < textAreaList[currPage].length; j++) {
                const values = textAreaList[currPage][j];
                const widthValue = Number(values.width.substring(0, values.width.indexOf("p")))
                const heightValue = Number(values.height.substring(0, values.height.indexOf("p")))

                let [orderPage] = await mainPdf.copyPages(mainPdf, [currPage]);
                const page = mainPdf.insertPage(currPage, orderPage)
                mainPdf.removePage(currPage + 1);
                const form = mainPdf.getForm();
                const fillableField = form.createTextField(values.content + [currPage] + '.Field');
                fillableField.setText(values.content);

                fillableField.addToPage(page, {
                    x: (values.x), y: (page.getHeight() - values.y - heightValue),
                    width: widthValue,
                    height: heightValue,
                })

            }
        }


    }
    return await mainPdf.saveAsBase64({ dataUri: true });

}
// async function pdfSplit(mainFile, currentPages, splitPages){
async function pdfSplit(mainFile, splitPages) {
    const mainPdf = await PDFDocument.load(mainFile);
    const pdfDoc = await PDFDocument.create();

    let pagesArray = await mainPdf.copyPages(mainPdf, mainPdf.getPageIndices());

    for (let i = 0; i < splitPages.length; i++) {
        let [orderPage] = await pdfDoc.copyPages(mainPdf, [splitPages[i]]);
        const page = pdfDoc.addPage(orderPage);
    }
    console.log(pagesArray.length)
    for (let i = 0; i < splitPages.length; i++) {
        mainPdf.removePage(splitPages[0]);
    }
    var array = [];
    array[0] = await mainPdf.saveAsBase64({ dataUri: true });
    array[1] = await pdfDoc.saveAsBase64({ dataUri: true })
    array.push(10);

    return array;

}
module.exports.reorderPDFpage = reorderPDFpage;
module.exports.mergePDF = mergePDF;
module.exports.fillForm = fillForm;
module.exports.pdfSplit = pdfSplit;

