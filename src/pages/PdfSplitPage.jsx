import React, { useMemo, useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'save-as';
import JSZip from 'jszip';
import axios from 'axios';
import Switch from 'react-switch';
import PdfSplitPreviewArea from '../component/PdfSplitPreviewArea';
import PdfPreviewArea from '../component/PdfPreviewArea';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function PdfSplitPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)].map((value, index) => location.state[index].base64);
  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(fileList[0]);
  const [splitPdfPages, setSplitPdfPages] = useState([]);
  const [toggleOparation, setToggleOparation] = useState(true);
  const [rangeNumber, setRangeNumber] = useState(0);

  // eslint-disable-next-line no-var
  var zip = new JSZip();
  // eslint-disable-next-line no-var
  var docs = zip.folder('Documents');
  const postSplitPdf = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:4000/pdfSplitFileIndex', {
        currentFile,
        splitPdfPages,
      }).then((res) => {
        const firstDownload = document.createElement('a');
        const allPdfs = res.data;
        // eslint-disable-next-line prefer-destructuring
        firstDownload.href = allPdfs[0];
        docs.file('firstSplit.pdf', allPdfs[0], { base64: true });
        firstDownload.download = 'firstSplit.pdf';

        const secondDownload = document.createElement('a');
        // eslint-disable-next-line prefer-destructuring
        secondDownload.href = allPdfs[1];
        docs.file('secondSplit.pdf', allPdfs[1], { base64: true });
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, 'example.zip');
        });
        secondDownload.download = 'secondSplit.pdf';
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  const handleChange = () => {
    setToggleOparation(!toggleOparation);
  };

  const memoizedPdfPrevArea = useMemo(() => (
    <PdfSplitPreviewArea
      setCurrentPdfPages={setCurrentPdfPages}
      setSplitPdfPages={setSplitPdfPages}
      file={currentFile}
      toggleOparation={toggleOparation}
      setRangeNumber={setRangeNumber}
    />
  ), [currentFile, toggleOparation]);
  useEffect(() => {
    const a = currentPdfPages.filter((val) => !splitPdfPages.includes(val));
    console.log(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPdfPages, splitPdfPages]);

  return (
    <div className="flex flex-col  items-center  justify-center h-screen overflow-hidden">
      <Switch onChange={handleChange} checked={toggleOparation} onColor="#F50D0D" offColor="#0AA8EE" uncheckedIcon={false} checkedIcon={false} />

      {memoizedPdfPrevArea}
      {console.log(rangeNumber)}
      <div className="ablolute -10">
        <button
          className="transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100
  rounded-md absolute md:bottom-10  max-[770px]:bottom-4 max-[770px]:inset-x-2 md:right-14 p-4"
          type="button"
          onClick={(event) => postSplitPdf(event)}
        >
          Split Pages

        </button>
      </div>
    </div>
  );
}

export default PdfSplitPage;
