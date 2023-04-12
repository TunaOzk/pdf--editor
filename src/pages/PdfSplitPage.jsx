import React, { useMemo, useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { saveAs } from 'save-as';
import JSZip from 'jszip';
import axios from 'axios';
import Switch from 'react-switch';
import PdfSplitPreviewArea from '../component/PdfSplitPreviewArea';
import DropDown from '../component/DropDown';
import {
  SplitIcon, SplitModeIcon, RangeIcon, IntervalIcon,
} from '../assets';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function PdfSplitPage() {
  const location = useLocation();
  const file = location.state.base64;

  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(file);
  const [splitPdfPages, setSplitPdfPages] = useState([]);
  const [toggleOparation, setToggleOparation] = useState(true);
  const [rangeNumber, setRangeNumber] = useState(0);
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line no-var
  var zip = new JSZip();
  // eslint-disable-next-line no-var
  var docs = zip.folder('Documents');
  const postSplitPdf = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:4000/pdfSplitFileIndex', {
        currentFile,
        rangeNumber,
        splitPdfPages,
      }).then((res) => {
        const allPdfs = res.data;

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < allPdfs.length; i++) {
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

  const modeContent = {
    header: { img: SplitModeIcon, label: 'Split Mode' },
    content: [
      {
        id: 1,
        img: IntervalIcon,
        label: 'Interval',
        action: true,
      },
      {
        id: 2,
        img: RangeIcon,
        label: 'Range',
        action: false,
      },
    ],
  };
  return (
    <div className="flex flex-col bg-[#fbf8fd] items-center justify-center h-screen overflow-y-auto relative ">
      <div className=" w-full  absolute top-0">
        <header className="drop-shadow-xl bg-[#fffbff] w-full h-min flex justify-end items-center">

          <div className="mr-2">
            <DropDown
              onAction={setToggleOparation}
              menuItemHeader={modeContent.header}
              menuItemContent={modeContent.content}
            />
            {/* <button
              className="flex group bg-[#4f33ff]
              // rounded-xl drop-shadow-xl text-white my-1 p-3 w-fit"
              type="submit"
              onClick={() => setOpen(!open)}
            >
              <div className="transition-all ease-in-out delay-100 absolute h-full w-full
              opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl bottom-0"
              />
              <SplitModeIcon className="fill-white" />
              <p className="ml-2 text-white">Split Mode</p>
            </button> */}
          </div>
          <div className="">
            <button
              className="group flex my-1 p-3 mr-2 transition ease-in-out delay-75
              bg-[#4f33ff] rounded-xl drop-shadow-xl text-white
              rounded-xl drop-shadow-xl md:bottom-10 p-2 w-fit"
              type="submit"
              onClick={(event) => postSplitPdf(event)}
            >
              <div className="transition-all ease-in-out delay-100 absolute h-full w-full
              opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl bottom-0"
              />
              <SplitIcon className="fill-white" />
              <p className="ml-2 text-white">Split Pages</p>
            </button>
          </div>

        </header>
        {open ? (
          <div className="flex flex-col w-full items-center  h-10 bg-purple-300">
            <div className="flex flex-row mb-1 top-0 ">
              <p className="border-2 rounded-lg bg-white p-1">range</p>
              <Switch className="ml-2 mr-2 mt-1" onChange={handleChange} checked={toggleOparation} onColor="#F50D0D" offColor="#0AA8EE" uncheckedIcon={false} checkedIcon={false} />

              <p className="border-2 rounded-lg bg-white p-1">
                Interval
              </p>

            </div>
          </div>
        ) : null}

      </div>

      <div className="flex flex-col items-center mt-10 space-y-10">

        {memoizedPdfPrevArea}

      </div>

    </div>
  );
}

export default PdfSplitPage;
