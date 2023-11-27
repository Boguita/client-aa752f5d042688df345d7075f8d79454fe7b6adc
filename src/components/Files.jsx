import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import api from '../common/Axiosconfig';
import Loader from './Loader';

const Files = ({label, instructions, onUpload}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setUploadStatus(null);
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleDrop = (event) => {

    event.preventDefault();
    setUploadStatus(null);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setSelectedFiles(droppedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setUploadStatus(null);
  };

   const handleUpload = async (id) => {
    if (selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('constancia', file);
      formData.append('id', id);
    });

    try {
      const response = await api.post('/uploads/images-constancia', formData);
      console.log(response);
      if (response.status === 200) {
        setUploadStatus('Archivos subidos exitosamente.');
        setSelectedFiles([]);
      } 
    } catch (error) {
      console.error('Error:', error);
       if (error.response && error.response.data && error.response.data.error) {
      setUploadStatus(`Error: ${error.response.data.error}`);
    } else {
      setUploadStatus('Error al subir los archivos.');
    }
    }
  };

    const handleConfirmAndUpload = async () => {
    try {
       if (selectedFiles.length === 0) {
      return setUploadStatus('Error: No se seleccionó ningún archivo.');
    }
      const res = await onUpload()
      console.log(res) // Espera a que onUpload se complete
      if(res.status === 200) {
      console.log("LLegan estas ids a fotos", res.data)
      const id = res.data.ids;
      await handleUpload(id);
      } // Espera a que handleUpload se complete
    } catch (error) {
      console.error('Error:', error);
      // Manejo de errores si es necesario
    }
  };


  return (
    <>
    <div className="flex flex-col items-center bg-gray-200 rounded-xl h-40 w-max p-2"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p className="font-bold">{label}</p>
      <p className="text-sm font-semibold text-gray-600 w-[80%]">{instructions}</p>
      
      <label htmlFor="constancia" className="cursor-pointer">
        <FiDownload className='text-5xl text-[#23A1D8]' />
      </label>
      
      <input
        type="file"
        name="constancia"
        id="constancia"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        
      />
      
      <p className="text-xs font-semibold text-gray-600">
        Suelte el archivo aquí para cargar o <strong className="text-[#006084]">elegir archivos.</strong>
      </p>
      
      
      
    </div>
    <div>
  {uploadStatus ? (
    
      
    <p className={`text-${uploadStatus.includes("Error") ? 'red-500' : '[#0E6F4B]'} font-semibold`}>
      {uploadStatus}
    </p>
    
  ) : (
    <div>
      {selectedFiles.length > 0 && (
        <div className='flex flex-col pl-7'>
          <ul>
            {selectedFiles.map((file, index) => (
              <li className='truncate w-20' key={index}>{file.name}</li>
            ))}
          </ul>
         
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : null}
    </div>
  )}
   <button
          className='mt-4 bg-[#0E6F4B] w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75'
          onClick={handleConfirmAndUpload}
        >
          Confirmar
        </button>
</div>

      </>
  );
}

export default Files;