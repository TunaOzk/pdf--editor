import React, { useMemo, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';
import DropDown from '../component/DropDown';
import {
  AddIcon, ExportIcon, MergeIcon, PdfIcon,
} from '../assets';
import LoadingScreen from '../component/LoadingScreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const [files, setFiles] = useState(
    {
      data: [...Array(numOfFiles)].map((value, index) => location.state[index].base64),
      names: [...Array(numOfFiles)].map((value, index) => location.state[index].name),
    },
  );
  const [pdfPagesList, setPdfPagesList] = useState([...Array(numOfFiles)].map(() => []));
  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(files.data[0]);
  const [pageIndex, setPageIndex] = useState(0);
  const [fileListIndex, setFileListIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const addButtonRef = useRef(null);

  const handleOptionClick = (val) => {
    const index = Number(val);
    setFileListIndex(index);
    setCurrentFile(files.data[index]);
  };
  const postIndex = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const currentFileName = files.names[fileListIndex];
    try {
      await axios.post('http://localhost:4000/pdfFileIndex', {
        currentPdfPages,
        currentFile,
        currentFileName,
      }).then((res) => {
        const downloadFile = document.createElement('a');
        downloadFile.href = res.data;
        downloadFile.download = currentFileName;
        downloadFile.click();
        downloadFile.remove();
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };
  const postMerge = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const currentFileName = files.names[fileListIndex];
    const temp = pdfPagesList.map((value, index) => (!value.length
      ? pdfjs.getDocument(files.data[index]).promise
        .then((pdf) => Array.from(Array(pdf.numPages).keys())) : pdfPagesList[index]));
    const finalPagesList = await Promise.all(temp);
    const fileList = files.data;
    try {
      await axios.post('http://localhost:4000/pdfMerge', {
        finalPagesList,
        fileList,
        currentFileName,
      }).then((res) => {
        const a = document.createElement('a');
        a.href = res.data;
        a.download = 'MergedPdf.pdf';
        a.click();
        a.remove();
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfScrollArea
      currentPdfPages={currentPdfPages}
      setCurrentPdfPages={setCurrentPdfPages}
      file={currentFile}
      currFileIndex={fileListIndex}
      setPageIndex={setPageIndex}
      pdfPagesList={pdfPagesList}
      setPdfPagesList={setPdfPagesList}
    />
  ), [currentPdfPages, currentFile, fileListIndex, pdfPagesList, setPdfPagesList]);

  const handleInputFileChange = (event) => {
    const newFile = event.target.files[0];
    const fReader = new FileReader();
    fReader.readAsDataURL(newFile);
    fReader.onloadend = ((e) => {
      const uri = e.target.result;
      setFiles((prev) => ({
        data: [...prev.data, uri],
        names: [...prev.names, newFile.name],
      }));
      setPdfPagesList((prev) => [...prev, []]);
    });
  };

  const menuContent = {
    header: {
      img: PdfIcon,
      label:
    files.names[fileListIndex].length > 22 ? `${files.names[fileListIndex].slice(0, 22)}...` : files.names[fileListIndex],
    },
    content: files.names.map((val, index) => ({
      id: index, img: PdfIcon, label: val, action: index,
    })),
  };

  return (
    <div className="flex flex-col h-screen bg-[#fbf8fd]">

      <div className="flex justify-between items-center drop-shadow-xl bg-[#fffbff] z-10">
        <div className="ml-2 bg-[#e4dff9] rounded-md">
          <DropDown
            onAction={handleOptionClick}
            menuItemHeader={menuContent.header}
            menuItemContent={menuContent.content}
          />
        </div>
        <div className="flex">
          <button
            className="flex rounded-xl drop-shadow-xl items-center mr-2 my-1 p-3 w-fit bg-[#ffd8e9]"
            type="button"
            onClick={() => { addButtonRef.current?.click(); }}
          >
            <AddIcon className="fill-[#2f1122]" />
            <p className="ml-2 text-[#2f1122]">Add PDF</p>
          </button>
          <input onChange={handleInputFileChange} accept=".pdf" ref={addButtonRef} className="hidden" type="file" />
          <button
            className="relative group flex rounded-xl drop-shadow-xl items-center mr-2 my-1 p-3 w-fit bg-[#4f33ff]"
            type="button"
            onClick={(event) => postIndex(event)}
          >
            <div className="transition-all ease-in-out delay-100 absolute h-full w-full opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl" />
            <ExportIcon className="fill-white" />
            <p className="ml-2 text-white">Export PDF</p>
          </button>

          <button
            className="relative group flex rounded-xl drop-shadow-xl items-center mr-2 my-1 p-3 w-fit bg-[#4f33ff]"
            type="button"
            onClick={(event) => postMerge(event)}
          >
            <div className="transition-all ease-in-out delay-100 absolute h-full w-full opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl" />
            <MergeIcon className="fill-white" />
            <p className="ml-2 text-white">Merge PDFs</p>
          </button>
        </div>

      </div>
      <div className="flex w-full h-full items-center justify-center">
        <div className="h-full w-1/5 overflow-hidden">{memoizedPdfScrollArea}</div>
        <div className="mt-8 flex flex-col items-center justify-center h-5/6 w-full">
          {isLoading && <LoadingScreen />}
          <div className="overflow-auto">
            <PdfPreviewArea
              file={currentFile}
              setPageIndex={setPageIndex}
              pageIndex={pageIndex}
              currentPdfPages={currentPdfPages}
              width={500}
            />
          </div>
        </div>
      </div>

    </div>

  );
}

export default PdfEditPage;
