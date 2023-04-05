const {PDFDocument, rgb, degrees, pushGraphicsState, popGraphicsState, concatTransformationMatrix, degreesToRadians } = require('pdf-lib');
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

async function fillForm(textAreaList, file, shapes) {
    const mainPdf = await PDFDocument.load(file);
    mainPdf.registerFontkit(fontkit);
    // const fonts = ['Arial', 'Arial_Bold', 'Arial_Italic', 'Arial_Italic_Bold', 
    // 'Brush_Script_MT', 'Brush_Script_MT_Bold', 'Brush_Script_MT_Italic', 'Brush_Script_MT_Italic_Bold',
    //  'Courier_New', 'Courier_New_Bold', 'Courier_New_Italic', 'Courier_New_Italic_Bold',
    //   'Comic_Sans_MS', 'Comic_Sans_MS_Bold', 'Comic_Sans_MS_Italic', 'Comic_Sans_MS_Italic_Bold', 
    //   'Garamond', 'Garamond_Bold', 'Garamond_Italic', 'Garamond_Italic_Bold', 
    //   'Georgia', 'Georgia_Bold', 'Georgia_Italic', 'Georgia_Italic_Bold',
    //     'Tahoma', 'Tahoma_Bold', 'Tahoma_Italic', 'Tahoma_Italic_Bold',
    //     'Trebuchet_MS', 'Trebuchet_MS_Bold', 'Trebuchet_MS_Italic', 'Trebuchet_MS_Italic_Bold',
    //      'Times_New_Roman', 'Times_New_Roman_Bold', 'Times_New_Roman_Italic', 'Times_New_Roman_Italic_Bold',
    //       'Verdana', 'Verdana_Bold', 'Verdana_Italic', 'Verdana_Italic_Bold'];
    // const fontMap = new Map();
    // await Promise.all(fonts.map(async (val) => {
    //     const fontBytes = fs.readFileSync(`./fonts/${val}.ttf`, null);
    //     const font = await mainPdf.embedFont(fontBytes);
    //     const fontName = val.replace(/_/g, ' ');
    //     fontMap.set(fontName, font)
    // }))


    for (let i = 0; i < textAreaList.length; i++) {
        let secondaryIndex = 0
        for(const textArea of textAreaList[i]) {
            const fontBytes = fs.readFileSync(`./fonts/${textArea.font}.ttf`);
            const font = await mainPdf.embedFont(fontBytes);
            const page = mainPdf.getPage(i);
            const regex = /\d+/g;
            const rgbValues = textArea.color.match(regex)
            if (textArea.type === 'S') {
                page.drawText(textArea.content, {
                    x: textArea.x,
                    y: page.getHeight() - textArea.y - textArea.fontSize + textArea.height,
                    font: font,
                    size: textArea.fontSize,
                    lineHeight: 1.16 + textArea.fontSize,
                    color: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
                },
                );
            }
            else if (textArea.type === 'F') {
                const form = mainPdf.getForm();
                const fillableField = form.createTextField(`textArea.Field${i}${secondaryIndex++}`);
                fillableField.setText(textArea.content);
                fillableField.enableMultiline();
                fillableField.addToPage(page, {
                    x: textArea.x,
                    y: page.getHeight() - textArea.y - textArea.height,
                    font: font,
                    size: textArea.fontSize,
                    lineHeight: 1.16 + textArea.fontSize,
                    width: textArea.width,
                    height: textArea.height,
                    textColor: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
                    
                })
                fillableField.updateAppearances(font);
            }
        };
    }
    const temp = await mainPdf.saveAsBase64({ dataUri: true });
    return await addCanvasToPDF(temp, shapes);

}

async function addCanvasToPDF(file, shapes) {
    const {cos,sin} = Math
    const mainPdf = await PDFDocument.load(file);
    const numPages = mainPdf.getPageCount();
    const [rects, circs, canvasesForPaths] = shapes
    for (let i = 0; i < numPages; i++) {
        const page = mainPdf.getPage(i);
        canvasesForPaths[i]?.forEach(async (canvas)  => {
            const canvasForPath = await mainPdf.embedPng(canvas);
            page.drawImage(canvasForPath, {
                x: 0,
                y: 0,
                width: canvasForPath.width,
                height: canvasForPath.height,
            })
        })
        rects[i]?.forEach((rect) => {
            page.pushOperators(
                pushGraphicsState(),
                concatTransformationMatrix(
                    1,
                    0,
                    0,
                    1,
                    rect.rotationPoint.x,
                    page.getHeight() - rect.rotationPoint.y,
                ),
                concatTransformationMatrix(
                    cos(degreesToRadians(360 - rect.rotate)),
                    sin(degreesToRadians(360 - rect.rotate)),
                    -sin(degreesToRadians(360 - rect.rotate)),
                    cos(degreesToRadians(360 - rect.rotate)),
                    0,
                    0,
                ),
                concatTransformationMatrix(
                    1,
                    0,
                    0,
                    1,
                    -1 * rect.rotationPoint.x,
                    -1 * (page.getHeight() - rect.rotationPoint.y),
                ),
            )
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
            page.pushOperators(
                popGraphicsState(),
              );
        })
        circs[i]?.forEach((circ) => {
            page.pushOperators(
                pushGraphicsState(),
                concatTransformationMatrix(
                    1,
                    0,
                    0,
                    1,
                    circ.rotationPoint.x,
                    page.getHeight() - circ.rotationPoint.y,
                ),
                concatTransformationMatrix(
                    cos(degreesToRadians(360 - circ.rotate)),
                    sin(degreesToRadians(360 - circ.rotate)),
                    -sin(degreesToRadians(360 - circ.rotate)),
                    cos(degreesToRadians(360 - circ.rotate)),
                    0,
                    0,
                ),
                concatTransformationMatrix(
                    1,
                    0,
                    0,
                    1,
                    -1 * circ.rotationPoint.x,
                    -1 * (page.getHeight() - circ.rotationPoint.y),
                ),
            )
            const regex = /\d+/g;
            const rgbValues = circ.color.match(regex)
            page.drawEllipse({
              x: circ.x,
              y: page.getHeight() - circ.y,
              xScale: circ.scaleX * circ.radius,
              yScale: circ.scaleY * circ.radius,
              borderWidth: circ.borderWidth,
              borderColor: rgb(rgbValues[0]/255, rgbValues[1]/255, rgbValues[2]/255),
              opacity: 0,
              borderOpacity: 1,
            })
            page.pushOperators(
                popGraphicsState(),
              );
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

