import React, { useState } from 'react';
import {AiOutlineDelete} from 'react-icons/ai';
import {IoIosArrowForward, IoIosArrowBack} from 'react-icons/io';
import Modal from 'react-modal';
import Avatar from '../assets/img/avatar.png';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {AiOutlineWarning} from 'react-icons/ai';
import {AiOutlineCheckCircle} from 'react-icons/ai';
import api from '../common/Axiosconfig';
import Loader from '../components/Loader';
const TableAfiliados = ({ data, rowsPerPage = 8,  showPagination = true, onUpdateUserData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAfiliado, setSelectedAfiliado] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [animationParent] = useAutoAnimate();
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  // Estilo en línea en el componente
const whiteRowClass = 'bg-white';
const grayRowClass = 'bg-gray-200';


  const totalPages = Math.ceil(data?.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

const handleOpenModal = (afiliado) => {
  setSelectedAfiliado(afiliado);
  setOpenModal(true);
};

const deleteAfiliado = (afiliado) => {
  console.log("llega a la funcion",afiliado)
  setError(null);
  setCurrentStep(1);
  setSelectedAfiliado(afiliado);
  setOpenDeleteModal(true);
}

const handleDeleteAfiliado = async () => {
  try {
  setLoading(true);
  const res = await api.delete(`/users/afiliados/${selectedAfiliado}`);
  if(res.status === 200) { 
  setCurrentStep(2)
  onUpdateUserData()
  setLoading(false);
  } 
  } catch (error) {
    setError("Hubo un error al eliminar el afiliado");
    setLoading(false)
  }
  
}



  


  return (
    <div ref={animationParent} className="h-full w-full bg-gray-200">
      <div  className="flex flex-col">
        <div ref={animationParent} className="mt-4 bg-white min-h-[35rem] p-8 rounded-xl">
          <table   className="min-w-full  divide-y-4 divide-[#006084]">
            <thead >
              <tr>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Tel
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Domicilio
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            
            <tbody ref={animationParent}>
              {data?.slice(startIndex, endIndex).map((row, index) => (
                <tr  key={index} className={`text-gray-600 text-sm font-semibold ${index % 2 === 0 ? grayRowClass : whiteRowClass }`}>
                  <td className="px-6 capitalize py-3 whitespace-no-wrap">{row.name}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.correo}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.tel}</td>
                  <td className="px-6 py-3 text-[#006084] whitespace-no-wrap">{row.ciudad}</td>
                  <td className="px-6 py-3 capitalize whitespace-no-wrap">{row.domicilio}</td>                
                  <td className="px-6 py-3 whitespace-no-wrap">{row.dni}</td>
            
                  <td className="flex items-center px-6 py-3 whitespace-no-wrap">
                  <button className='hover:text-[#006084] cursor-pointer '><a href={`/admin/${row.dni ? row.dni : ""}`}  target="_blank"
        rel="noopener noreferrer">Ver ficha completa</a></button>
                    <AiOutlineDelete onClick={() => deleteAfiliado(row.idafiliados)} className="text-[#006084] cursor-pointer hover:text-red-900 ml-2"/>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
       
        </div>
         {showPagination && (
  <div className="mt-4 flex justify-center items-center">
    <IoIosArrowBack
      className={`cursor-pointer ${currentPage === 0 ? 'text-gray-400' : ''}`}
      onClick={prevPage}
      disabled={currentPage === 0}
    >
      Anterior
    </IoIosArrowBack>
    <span className="mx-2 flex flex-wrap justify-center items-center">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <span
          key={page}
          className={`cursor-pointer mx-1 inline-flex justify-center items-center ${
            currentPage === page - 1 ? 'bg-[#006084] text-white rounded-full' : ''
          }`}
          onClick={() => setCurrentPage(page - 1)}
          style={{
            width: '30px', // Ancho y alto del círculo
            height: '30px',
          }}
        >
          {page}
        </span>
      ))}
    </span>
    <IoIosArrowForward
      className={`cursor-pointer ${currentPage === totalPages - 1 ? 'text-gray-400' : ''}`}
      onClick={nextPage}
      disabled={currentPage === totalPages - 1}
    >
      Siguiente
    </IoIosArrowForward>
  </div>
)}
      </div>
       <Modal
            isOpen={openModal}
            onRequestClose={() => setOpenModal(false)}
            contentLabel="Datos del Afiliado"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "none",
                color: "black",
                top: "50%",
                left: "55%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                padding: "2rem",
                width: "80%",
                maxWidth: "40rem",
              },
            }}
          >
            
            {/* {err && <p className="text-red-500">{err}</p>} */}
            <div  className="mb-2">
            {selectedAfiliado && (
              <div  className='flex justify-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col rounded-2xl w-[85%]">
                          
                          
                          <img className='mb-[-5px]' src={Avatar}>
                                </img>


                              <div className=' p-5 bg-white rounded-b-2xl grid gap-4'>
                                <p className='mt-2 capitalize text-gray-800 font-semibold'><strong>{selectedAfiliado.name}</strong></p>
                                <div className='grid grid-cols-2'>
                    <div >   

                      <p><strong>DNI</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.dni}</p>

                      <p ><strong>CUIT</strong></p>
                      <p className='text-gray-500 font-semibold'> {selectedAfiliado.cuit}</p>

                      <p><strong>Nacionalidad</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.nacionalidad}</p>

                      <p><strong>Sexo</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.sexo}</p>

                      <p><strong>Provincia</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.provincia}, {selectedAfiliado.ciudad}</p>
                    </div>

                    <div>
                      
                      <p><strong>Estado Civil</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.estado_civil}</p>

                      <p><strong>Fecha de Nacimiento</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.fecha_de_nacimiento}</p>

                      <p><strong>Teléfono</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.tel}</p>

                      <p><strong>Email</strong></p>
                      <p className='text-gray-500 break-all font-semibold'>{selectedAfiliado.correo}</p>

                      <p><strong>Domicilio</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedAfiliado.domicilio}</p>

                    
                    </div>
                    </div>

                        <div className="flex flex-col mt-4 items-center">
                          <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenModal(false)}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
            </div>                          

       
          </Modal>
           <Modal
            isOpen={openDeleteModal}
            onRequestClose={() => setOpenDeleteModal(false)}
            contentLabel="Eliminar Afiliado"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "55%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                padding: "2rem",
                width: "80%",
                maxWidth: "40rem",
              },
            }}
          >
            
            {/* {err && <p className="text-red-500">{err}</p>} */}
            <div  className="mb-2">
            {selectedAfiliado && (
              <div  className='flex justify-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col rounded-2xl w-[70%]">
                      {currentStep === 1 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <AiOutlineWarning className='text-red-600 text-7xl'/>
                      <p className='text-center'>¿Estas seguro que deseas eliminar este afiliado?<br></br> Todos los datos, incluso familiares seran eliminados.</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={handleDeleteAfiliado}
                          >
                            Confirmar
                          </button>
}
                          <button
                            className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenDeleteModal(false)}
                          >
                            Cerrar
                          </button>
                        </div>
                        </>
                        }
                        {currentStep === 2 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <AiOutlineCheckCircle className='text-green-600 text-7xl'/>
                      <p className='text-xl font-bold mt-2'>El afiliado se eliminó correctamente.</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-center items-end">                        
                          <button
                            className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenDeleteModal(false)}
                          >
                            Cerrar
                          </button>
                        </div>
                        </>
                        }
                        </div>
                        
                        
                      </div>
                    
                    
                      
                  )}
                  {error && <p className="font-semibold text-red-500">{error}</p>}
            </div>                          

       
          </Modal>
    </div>

  );
};

export default TableAfiliados;
