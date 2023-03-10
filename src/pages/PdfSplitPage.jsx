import React, { useMemo, useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'save-as';
import JSZip from 'jszip';
import axios from 'axios';
import Switch from 'react-switch';
import PdfSplitPreviewArea from '../component/PdfSplitPreviewArea';
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
      // console.log(splitPdfPages);
      await axios.post('http://localhost:4000/pdfSplitFileIndex', {
        currentFile,
        rangeNumber,
        splitPdfPages,
      }).then((res) => {
        const allPdfs = res.data;
        console.log(allPdfs.length);

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < allPdfs.length; i++) {
          console.log(i);

          docs.file(`splited${i}.pdf`, allPdfs[i], { base64: true });
        }
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, 'example.zip');
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPdfPages, splitPdfPages]);

  return (
    <div className="flex flex-col  items-center  justify-center h-screen">
      <div className="flex flex-col items-center mt-10 space-y-10">
        <div className="flex flex-row mb-1 absolute top-0 ">
          <p className="border-2 rounded-lg bg-gray-100 bg-slate-100 p-1">range</p>

          <Switch className="ml-2 mr-2 mt-1" onChange={handleChange} checked={toggleOparation} onColor="#F50D0D" offColor="#0AA8EE" uncheckedIcon={false} checkedIcon={false} />
          <p className="border-2 rounded-lg bg-gray-100 bg-slate-100 p-1">
            Interval
          </p>

        </div>

        {memoizedPdfPrevArea}
      </div>
      {console.log(rangeNumber)}
      <div className="">
        <button
          className="fixed  bottom-0 transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100
  rounded-md md:bottom-10  max-[770px]:bottom-4 max-[770px]:inset-x-2 md:right-14 p-4"
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
