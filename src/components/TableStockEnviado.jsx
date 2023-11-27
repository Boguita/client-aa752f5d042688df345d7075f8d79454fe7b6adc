import React, { useEffect, useState } from 'react';
import {AiOutlineDelete} from 'react-icons/ai';
import {IoIosArrowForward, IoIosArrowBack} from 'react-icons/io';
import Modal from 'react-modal';
import Avatar from '../assets/img/avatar.png';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {AiOutlineWarning} from 'react-icons/ai';
import {AiOutlineCheckCircle} from 'react-icons/ai';
import api from '../common/Axiosconfig';
import Loader from '../components/Loader';
import { FiMoreHorizontal } from 'react-icons/fi';
import {RxAvatar} from 'react-icons/rx';
import {TbUserQuestion} from 'react-icons/tb';


const TableStockEnviado = ({ data, rowsPerPage = 8,  showPagination = true, onUpdateUserData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openPendingModal, setOpenPendingModal] = useState(false);
  const [openAprovvedModal, setOpenAprovvedModal] = useState(false);
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

  useEffect(() => {
    console.log('USUARIO SELECCIONADO', selectedUser);
  }, [selectedUser]);
  

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
  setCurrentStep(1);
  setSelectedUser(afiliado);
  setOpenModal(true);
};

const handleSelectOption = (index) => {
  // Copiar el estado actual de los dropdowns
  const updatedOpenDropdowns = { ...isDropdownOpen };
  
  // Si el menú desplegable en el índice ya está abierto, ciérralo
  if (updatedOpenDropdowns[index]) {
    updatedOpenDropdowns[index] = false;
  } else {
    // Cerrar el menú desplegable anteriormente abierto si existe
    Object.keys(updatedOpenDropdowns).forEach((key) => {
      updatedOpenDropdowns[key] = false;
    });
    // Abrir el menú desplegable en el índice dado
    updatedOpenDropdowns[index] = true;
  }
  
  setIsDropdownOpen(updatedOpenDropdowns);
};


const deleteUser = (afiliado) => {
  console.log("llega a la funcion",afiliado)
  setSelectedUser(afiliado);
  setOpenDeleteModal(true);
}


const AprovvedBenefit = (afiliado) => {
  console.log("llega a la funcion",afiliado)
  setSelectedUser(afiliado);
  setOpenAprovvedModal(true);
}

const statusChangue = (afiliado) => {
  setSelectedUser(afiliado);
  setOpenStatusModal(true);
}

const handleRejected = async (id) => {
  try {
  setLoading(true);
  const res = await api.put(`/tasks/${id}`,  
       {
        estado: "Rechazado",        
      },
    );
  res.status === 200
  ? (
      setCurrentStep(2),
      onUpdateUserData()
    )
  : setError("Hubo un error al rechazar el beneficio");

  setLoading(false);
  } catch (error) {
    setError("Hubo un error al rechazar el beneficio");
    setLoading(false)
  }
  
}

const handleAprovved = async (id) => {
  try {
  setLoading(true);
  const res = await api.put(`/tasks/${id}`,  
       {
        estado: "Enviado",        
      },
    );
  res.status === 200
  ? (
      setCurrentStep(2),
      onUpdateUserData()
    )
  : setError("Hubo un error al aprobar el beneficio");

  setLoading(false);
  } catch (error) {
    setError("Hubo un error al aprobar el beneficio");
    setLoading(false)
  }
  
}

const pendingBenefit = (afiliado) => {
  console.log("llega a la funcion",afiliado)
  setSelectedUser(afiliado);
  setOpenPendingModal(true);
}

const handlePending = async (id) => {
  try {
  setLoading(true);
  const res = await api.put(`/tasks/${id}`,  
       {
        estado: "Pendiente",        
      },
    );
  res.status === 200
  ? (
      setCurrentStep(2),
      onUpdateUserData()
    )
  : setError("Hubo un error al mover el beneficio");

  setLoading(false);
  } catch (error) {
    setError("Hubo un error al mover el beneficio");
    setLoading(false)
  }
  
}

const aprobarUsuario = async (afiliado) => {
  try {
    setLoading(true);
    const dataToUpdate = {
      username: afiliado.username,
      email: afiliado.email
    };
    const res = await api.put(`/users/approved`, dataToUpdate);
    if (res.status === 200) {
      setCurrentStep(2);
      setLoading(false);
      // Llama a la función de callback para actualizar los datos
      onUpdateUserData();
    } else {
      setError("Hubo un error al aprobar el usuario");
      setLoading(false);
    }
  } catch (error) {
    setError("Hubo un error al aprobar el usuario");
    setLoading(false);
  }
}

const rechazarUsuario = async (afiliado) => {
  try {
    setLoading(true);
    const dataToUpdate = {
      username: afiliado.username,
      email: afiliado.email
    };
    const res = await api.put(`/users/decline`, dataToUpdate);
    if (res.status === 200) {
      setCurrentStep(2);
      setLoading(false);
      // Llama a la función de callback para actualizar los datos
      onUpdateUserData();
    } else {
      setError("Hubo un error al rechazar el usuario");
      setLoading(false);
    }
  } catch (error) {
    setError("Hubo un error al rechazar el usuario");
    setLoading(false);
  }
}




  return (
    <div ref={animationParent} className="h-full w-full bg-gray-200">
      <div  className="flex flex-col">
        <div ref={animationParent} className="mt-4 bg-white min-h-[25rem] p-8 rounded-xl">
          <table   className="table-auto w-full divide-y-4 divide-[#006084]">
            <thead >
              <tr>
                <th className="px-1 2xl:px-3 py-3   text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Delegación
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Seccional
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Guardapolvo talle
                </th>               
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  6
                </th>
                 <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  8
                </th>     
                  <th className="px-1 2xl:px-4 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  10
                </th>         
                <th className="px-1 2xl:px-4 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  12
                </th>
                
                <th className="px-1 2xl:px-4 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  14
                </th>
                 <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  16
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  18
                </th>
                  <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Mochilas
                </th>
                  <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Útiles
                </th>
                  
                
                
              </tr>
            </thead>
            
            <tbody >
              {data?.slice(startIndex, endIndex).map((row, index) => (
                <tr  key={index} className={`text-gray-600 text-sm font-semibold ${index % 2 === 0 ? grayRowClass : whiteRowClass }`}>
                 
                              <td className="px-6 py-3 capitalize text-[#006084] whitespace-no-wrap">{row.provincia}</td>
                              <td className="px-6 py-3 whitespace-no-wrap">{row.delegacion}</td>
                  <td className="px-2 2xl:px-6 capitalize py-3 whitespace-no-wrap">{row.nombre}</td>
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.direccion + " N°" + row.numero}</td>                  
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{""}</td>   
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.talle6}</td> 
                  <td className="px-1 2xl:px-4 py-3 whitespace-no-wrap">{row.talle8}</td>   
                  <td className="px-1 2xl:px-4 py-3 whitespace-no-wrap">{row.talle10}</td> 
                   <td className="px-1 2xl:px-4 py-3 whitespace-no-wrap">{row.talle12}</td> 
                   <td className="px-1 2xl:px-4 py-3 whitespace-no-wrap">{row.talle14}</td> 
                   <td className="px-1 2xl:px-4 py-3 whitespace-no-wrap">{row.talle16}</td> 
                   <td className="px-1 2xl:px-4 py-3 whitespace-no-wrap">{row.talle18}</td>
                   <td className="px-1 2xl:px-4 text-center py-3 whitespace-no-wrap">{row.mochila}</td> 
                   <td className="px-1 2xl:px-4 text-center py-3 whitespace-no-wrap">{row.utiles}</td>  
                                 
                  <td className="flex items-center px-10 py-2 whitespace-no-wrap">
                  
                  {/* <button onClick={() => handleOpenModal(row)} className="text-[#006084] hover:text-blue-900">Ver ficha</button>
                    <AiOutlineDelete onClick={() => deleteAfiliado(row.idafiliados)} className="text-[#006084] cursor-pointer hover:text-red-900 ml-2"/> */}
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
            contentLabel="Datos del Beneficio"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000
              },
              content: {
                border: "none",
                background: "none",
                color: "black",
                top: "50%",
                left: "59%",
                right: "auto",
                bottom: "auto",
               
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                padding: "2rem",
                width: "100%",
                maxWidth: "70rem",
              },
              
            }}
          >
            
            {/* {err && <p className="text-red-500">{err}</p>} */}
            <div  className="mb-2 ">
            {currentStep === 1 && selectedUser && (
              
              <div  className='flex  justify-center items-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col  rounded-2xl w-[100%]">
                              <div className=' p-5 bg-white rounded-2xl gap-4 '>
                                <div  className='flex text-5xl text-[#006084] justify-center'>
                                <RxAvatar />
                                </div>
                                <p className='m-2 capitalize text-gray-800 text-center font-semibold'><strong>{selectedUser.afiliado_name}</strong></p>
                                <div className='flex justify-around border-b-2 pb-4'>
                                 <p className='mt-2 capitalize text-gray-400 text-sm '><strong className='text-black'>N° Seguimiento:</strong> #{selectedUser.id}</p>
                                 <p className='mt-2 capitalize text-gray-400 text-sm '><strong className='text-black'>DNI:</strong> {selectedUser.afiliado_dni}</p>
                                  <p className='mt-2 capitalize text-gray-400 text-sm '><strong className='text-black'>TEL:</strong> {selectedUser.afiliado_tel}</p>
                                  <p className='mt-2 capitalize text-gray-400 text-sm '><strong className='text-black'>MAIL:</strong> {selectedUser.afiliado_correo}</p>
                                </div>
  
   <table   className="min-w-full mt-3 divide-y-4 divide-[#006084]">
            <thead >
              <tr>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Hijo/a
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI
                </th>   
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI FRENTE Y DORSO
                </th>                         
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Fecha Solicitud
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Año Escolar
                </th>                   
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  útil
                </th> 
                     <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Moch
                </th>  
                    <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Guar
                </th> 
                  <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  TALLE
                </th> 
                 <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Usuario Otorgante
                </th>          
                
              </tr>
            </thead>
              <tbody ref={animationParent}>
                <tr className={`text-gray-600 text-sm font-semibold `}>
                  <td className="px-6 py-3 capitalize text-[#006084] whitespace-no-wrap">{selectedUser.familiar_name}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.familiar_dni}</td>
                   <td className="px-6 py-3 flex flex-col whitespace-no-wrap"> {selectedUser.dni_img_frente && (
    typeof selectedUser.dni_img_frente === 'string' && (
      <a
        href={`https://backuatrebeneficios.galgoproductora.com/${selectedUser.dni_img_frente}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className='text-xs underline'>Frente</span>
      </a>
    ) 
  )} {selectedUser.dni_img_dorso && (
    typeof selectedUser.dni_img_dorso === 'string' && (
      <a
        href={`https://backuatrebeneficios.galgoproductora.com/${selectedUser.dni_img_dorso}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className='text-xs underline'>Dorso</span>
      </a>
    ) 
  )}</td>
                  
                  <td className="px-6 py-3 whitespace-no-wrap">{new Date(selectedUser.fecha_otorgamiento).toLocaleDateString("es-AR")}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.año_escolar}</td>                 
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.utiles === 0 ? "NO" : "SI"}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.mochila === 0 ? "NO" : "SI"}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.guardapolvo_confirm === 0 ? "NO" : "SI"}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.guardapolvo}</td>                
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.usuario_otorgante}</td>
                </tr>
              </tbody>

            
          </table>
                                          <div className='flex  items-center justify-around '>
                                            <a href={`https://backuatrebeneficios.galgoproductora.com/${selectedUser.constancia_img}`}  target="_blank"
        rel="noopener noreferrer"className='bg-[#006084] p-2 text-sm text-white rounded-lg' >Ver Remito Firmado</a>
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
                  {currentStep === 2 && (
                    <div className='flex flex-col bg-white  rounded-2xl p-4 items-center justify-center '>
                      <AiOutlineCheckCircle className='text-green-600 text-7xl'/>
                      <p className='text-xl font-bold mt-2'>El estado del usuario se cambió correctamente.</p>
                      <div className="flex flex-col mt-4 items-center">
                        <button
                          className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                          onClick={() => setOpenModal(false)}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
            </div>                          

       
          </Modal>

               <Modal
            isOpen={openAprovvedModal}
            onRequestClose={() => setOpenAprovvedModal(false)}
            contentLabel="Aprobar Beneficio"
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
            {selectedUser && (
              <div  className='flex justify-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col rounded-2xl w-[70%]">
                      {currentStep === 1 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <TbUserQuestion className='text-[#006084] mb-4 text-7xl'/>
                      <p>¿Estas seguro que deseas enviar este beneficio?</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => handleAprovved(selectedUser.id)}
                          >
                            Confirmar
                          </button>
}
                          <button
                            className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenAprovvedModal(false)}
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
                      <p className='text-xl font-bold mt-2'>El beneficio se envió correctamente.</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-center items-end">                        
                          <button
                            className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenAprovvedModal(false)}
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


           <Modal
            isOpen={openDeleteModal}
            onRequestClose={() => setOpenDeleteModal(false)}
            contentLabel="Rechazar Beneficio"
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
            {selectedUser && (
              <div  className='flex justify-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col rounded-2xl w-[70%]">
                      {currentStep === 1 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <AiOutlineWarning className='text-red-600 mb-4 text-7xl'/>
                      <p>¿Estas seguro que deseas rechazar este beneficio?</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => handleRejected(selectedUser.id)}
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
                      <p className='text-xl font-bold mt-2'>El beneficio se rechazó correctamente.</p>
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

            <Modal
            isOpen={openPendingModal}
            onRequestClose={() => setOpenPendingModal(false)}
            contentLabel="Mover Beneficio"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000
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
            {selectedUser && (
              <div  className='flex justify-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col rounded-2xl w-[70%]">
                      {currentStep === 1 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <TbUserQuestion className='text-yellow-300 mb-4 text-7xl'/>
                      <p>¿Estas seguro que deseas mover este beneficio a pendientes?</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-yellow-400 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => handlePending(selectedUser.id)}
                          >
                            Confirmar
                          </button>
}
                          <button
                            className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenPendingModal(false)}
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
                      <p className='text-xl font-bold mt-2'>El beneficio se movio correctamente.</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-center items-end">                        
                          <button
                            className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setOpenPendingModal(false)}
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

export default TableStockEnviado;