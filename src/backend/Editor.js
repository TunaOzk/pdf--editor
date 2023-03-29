const { PDFDocument, layoutMultilineText, StandardFonts, rgb, drawTextField } = require('pdf-lib');
fs = require('fs');
fontkit = require('@pdf-lib/fontkit')

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

async function fillForm(textAreaList, file, base64Canvas, screenSize) {
    const mainPdf = await PDFDocument.load(file);
    mainPdf.registerFontkit(fontkit);
    const fonts = ['Arial', 'Brush_Script_MT', 'Courier_New', 'Comic_Sans_MS', 'Garamond', 'Georgia',
        'Tahoma', 'Trebuchet_MS', 'Times_New_Roman', 'Verdana'];
    const fontMap = new Map();
    await Promise.all(fonts.map(async (val) => {
        const fontBytes = fs.readFileSync(`./fonts/${val}.ttf`, null);
        const font = await mainPdf.embedFont(fontBytes);
        const fontName = val.replace(/_/g, ' ');
        fontMap.set(fontName, font)
    }))
    for (let i = 0; i < textAreaList.length; i++) {
        textAreaList[i]?.forEach(async textArea => {
            const page = mainPdf.getPage(i);
            const rate = page.getHeight() / screenSize
            const regex = /\d+/g;
            const rgbValues = textArea.color.match(regex)
            // page.drawCircle(
            //     {
            //     x: 155,
            //     y: page.getHeight() - 155,
            //     size:50,
            //     borderColor:rgb(0,0,0),
            //     opacity:0,
            //     borderOpacity:1,
            //     borderWidth:10,
            //     }
            // );
            page.drawRectangle({
                x:100+5,
                y:page.getHeight() - 100-200-5,
                width: 300,
                height: 200,
                borderWidth: 10,
                borderColor: rgb(0, 0, 0),
                opacity: 0,
                borderOpacity:1,
            })
            if (textArea.type === 'S') {
                page.drawText(textArea.content, {
                    x: textArea.x,
                    y: page.getHeight() - textArea.y - textArea.fontSize + textArea.height,
                    font: fontMap.get(textArea.font),
                    size: textArea.fontSize,
                    lineHeight: 1.16 + textArea.fontSize,
                    color: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
                },
                );
            }
            else if (textArea.type === 'F') {
                const form = mainPdf.getForm();
                const fillableField = form.createTextField(`textArea.Field${i}${textArea.ID}`);
                fillableField.setText(textArea.content);
                fillableField.enableMultiline();
                fillableField.addToPage(page, {
                    x: textArea.x,
                    y: page.getHeight() - textArea.y - textArea.height,
                    font:fontMap.get(textArea.font),
                    size: textArea.fontSize,
                    lineHeight: 1.16 + textArea.fontSize,
                    width: textArea.width,
                    height: textArea.height,
                    textColor: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
                    
                })
                fillableField.updateAppearances(fontMap.get(textArea.font));
            }
        });
    }
    const temp = await mainPdf.saveAsBase64({ dataUri: true });
    // return temp
    return await addCanvasToPDF(temp, base64Canvas);

}

async function addCanvasToPDF(file, shapes) {
    const mainPdf = await PDFDocument.load(file);
    const numPages = mainPdf.getPageCount();
    const [rects, circs] = shapes
    for (let i = 0; i < numPages; i++) {
        const page = mainPdf.getPage(i);
        rects[i]?.forEach((rect) => {
            const regex = /\d+/g;
            const rgbValues = rect.color.match(regex)
            page.drawRectangle({
              x:rect.x + rect.borderWidth/2,
              y:page.getHeight() - rect.y - rect.height - rect.borderWidth/2,
              width:rect.width,
              height:rect.height,
              borderWidth:rect.borderWidth,
              borderColor: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
              opacity: 0,
              borderOpacity:1,
            })
        })
        circs[i]?.forEach((circ) => {
            const regex = /\d+/g;
            const rgbValues = circ.color.match(regex)
            page.drawCircle({
              x:circ.x,
              y:page.getHeight() - circ.y,
              size:circ.radius,
              borderWidth:circ.borderWidth,
              borderColor: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
              opacity: 0,
              borderOpacity:1,
            })
        })
    }
    return await mainPdf.saveAsBase64({ dataUri: true });
}
async function pdfSplit(mainFile, splitPages, rangeNumber) {
    const mainPdf = await PDFDocument.load(mainFile);

    let pagesArray = await mainPdf.copyPages(mainPdf, mainPdf.getPageIndices());
    var len;
    var index = 0;
    if (rangeNumber > 0) {
        len = pagesArray.length / rangeNumber;
        index = pagesArray.length
    }
    else {
        len = splitPages.length;
    }

    var array = [];
    var count = 0;
    var flag = 0;
    if (rangeNumber > 0)
        for (let i = 0; i < len; i++) {
            const pdfDoc = await PDFDocument.create();

            if (index > 0) {
                for (let j = 0; j < rangeNumber && j < index - count; j++) {
                    let [orderPage] = await pdfDoc.copyPages(mainPdf, [count + j]);
                    const page = pdfDoc.addPage(orderPage);
                }
                count = count + rangeNumber;
                array[i] = await pdfDoc.saveAsBase64();
            }
            flag++;
        }
    if (flag == 0) {
        const pdfDoc = await PDFDocument.create();
        for (let j = 0; j < len; j++) {
            let [orderPage] = await pdfDoc.copyPages(mainPdf, [splitPages[j]]);
            const page = pdfDoc.addPage(orderPage);
        }
        for (let j = 0; j < len; j++) {
            mainPdf.removePage(splitPages[0]);
        }
        array[0] = await mainPdf.saveAsBase64();
        array[1] = await pdfDoc.saveAsBase64();

    }
    return array;

}
module.exports.reorderPDFpage = reorderPDFpage;
module.exports.mergePDF = mergePDF;
module.exports.fillForm = fillForm;
module.exports.addCanvasToPDF = addCanvasToPDF;
module.exports.fillForm = fillForm;
module.exports.pdfSplit = pdfSplit;

