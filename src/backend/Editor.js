const { PDFDocument, layoutMultilineText, StandardFonts } = require('pdf-lib');
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

async function fillForm(textAreaList, file, base64Canvas) {
    const mainPdf = await PDFDocument.load(file);
    for(let i = 0; i < textAreaList.length; i++) {
        textAreaList[i].forEach(async textArea => {
            const font = await mainPdf.embedFont(`${textArea.font}`);
            const page = mainPdf.getPage(i);
            page.setFont(font);
            const widthValue = Number(textArea.width.substring(0, textArea.width.indexOf("p")))
            const heightValue = Number(textArea.height.substring(0, textArea.height.indexOf("p")))
            
            if(textArea.type === 'S') {
                const multiText = layoutMultilineText(textArea.content, {
                    font: font,
                    fontSize: textArea.fontSize,
                    bounds: { x:textArea.x, y:(page.getHeight() - textArea.y- heightValue), width: widthValue, height: heightValue  },
                })
                multiText.lines.forEach(line => {
                    page.drawText(line.text, {
                        x: line.x,
                        y: line.y,
                        size: textArea.fontSize,
                    },
                    )
                });
            }
            else if(textArea.type === 'F') {
                const form = mainPdf.getForm();
                const fillableField = form.createTextField(`textArea.Field${i}${textArea.ID}`);
                fillableField.setText(textArea.content);
                fillableField.addToPage(page, { 
                    x: textArea.x, 
                    y: (page.getHeight() - textArea.y - heightValue),
                    width: widthValue,
                    height: heightValue,
                })
            }
        });
    }
    const temp = await mainPdf.saveAsBase64({ dataUri: true });
    return await addCanvasToPDF(temp, base64Canvas);
    // fs.writeFileSync("all-letters2.pdf", await mainPdf.save());

}

async function addCanvasToPDF(file, base64Canvas) {
    const mainPdf = await PDFDocument.load(file);
    const numPages = mainPdf.getPageCount();
    for (let i = 0; i < numPages; i++) {
        const canvas = await mainPdf.embedPng(base64Canvas[i]);
        const firstPage = mainPdf.getPage(i);
        firstPage.drawImage(canvas, {
            x:0,
            y:0,
            width:canvas.width,
            height:canvas.height,
        })
    }
    return await mainPdf.saveAsBase64({ dataUri: true });
    // fs.writeFileSync("all-letters2.pdf", await mainPdf.save());
}

module.exports.reorderPDFpage = reorderPDFpage;
module.exports.mergePDF = mergePDF;
module.exports.fillForm = fillForm;
module.exports.addCanvasToPDF = addCanvasToPDF;
