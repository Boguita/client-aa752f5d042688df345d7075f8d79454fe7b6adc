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


const TableKitMaternal = ({ data, rowsPerPage = 8,  showPagination = true, onUpdateUserData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const [openAprovvedModal, setOpenAprovvedModal] = useState(false);
    const [afiliadosSeleccionados, setAfiliadosSeleccionados] = useState([]);
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

const pendingBenefit = (afiliado) => {
  console.log("llega a la funcion",afiliado)
  setSelectedUser(afiliado);
  setOpenPendingModal(true);
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

const handleCheckbox = (afiliado) => {
  const afiliadosSeleccionadosCopy = [...afiliadosSeleccionados];

  // Verificar si el afiliado ya está seleccionado
  const isSelected = afiliadosSeleccionadosCopy.includes(afiliado.id);

  if (isSelected) {
    // Si está seleccionado, quitarlo de la lista
    const index = afiliadosSeleccionadosCopy.indexOf(afiliado.id);
    afiliadosSeleccionadosCopy.splice(index, 1);
  } else {
    // Si no está seleccionado, añadirlo a la lista
    afiliadosSeleccionadosCopy.push(afiliado.id);
  }

  // Actualizar el estado con los afiliados seleccionados
  setAfiliadosSeleccionados(afiliadosSeleccionadosCopy);
};




  return (
    <div ref={animationParent} className="h-full w-full bg-gray-200">
      {loading ? <Loader/> : (
      <div  className="flex flex-col">
        <div ref={animationParent} className="mt-4 bg-white min-h-[25rem] p-8 rounded-xl">
          <table   className=" table-fixed divide-y-4 divide-[#006084]">
            <thead >
              <tr>
           
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Afiliado
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Madre
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI Madre
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Delegación
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Seccional
                </th>
                 <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                 Dirección Seccional
                </th>
                   <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Fecha Parto
                </th>
                 <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Días para el parto
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Plazo
                </th>
                     <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Estado
                </th>
                   <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Acciones
                </th>
                
                
              </tr>
            </thead>
            
            <tbody ref={animationParent}>
              {data?.slice(startIndex, endIndex).map((row, index) => {
                const fechaParto = new Date(row.fecha_de_parto);
                fechaParto.setHours(0, 0, 0, 0);  // Establecer horas, minutos, segundos y milisegundos a 0

                const fechaActual = new Date();
                fechaActual.setHours(0, 0, 0, 0);  // Establecer horas, minutos, segundos y milisegundos a 0

                const diferenciaEnMilisegundos = fechaParto - fechaActual;
                const diasFaltantes = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
                const fechaPartoFormateada = fechaParto.toLocaleDateString("es-AR", { timeZone: "America/Buenos_Aires" });


                return ( <tr  key={index} className={`text-gray-600 text-sm font-semibold ${index % 2 === 0 ? grayRowClass : whiteRowClass }`}>
                    <div className="flex items-center pr-4  ">
                          {/* Checkbox for selecting familiar */}
                          <input
                            type="checkbox"
                            name="afiliado"
                            id={`afiliado_${row.id}`}
                            value={row.id}
                            className="cursor-pointer custom-checkbox"
                            // checked={selectedFamiliares.includes(familiar.id)}
                            onChange={() => handleCheckbox(row.id)}
                            // disabled={areTodosBeneficiosOtorgados(familiar.id)}
                          />
                          <label
                            htmlFor={`afiliado_${row.id}`}
                            className="check"
                          >
                            <svg className="w-18 h-18" viewBox="0 0 18 18">
                              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                              <polyline points="1 9 7 14 15 4"></polyline>
                            </svg>
                          </label>
                          <td className="px-6 py-3 capitalize text-[#006084] whitespace-no-wrap">{row.afiliado_name}</td>

                          {/* Estilizar el checkbox nativo */}
                          {/* <Checkbox selected={selectedFamiliares.includes(familiar.id)} /> */}
                        </div>
                 
                             
                              <td className="px-6 py-3 whitespace-no-wrap">{row.afiliado_dni}</td>
                  <td className="px-2 2xl:px-6 capitalize py-3 whitespace-no-wrap">{row.familiar_name}</td>
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.familiar_dni}</td>
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.provincia}</td> 
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.delegacion}</td> 
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.seccional}</td> 
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.direccion}</td>
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{fechaPartoFormateada}</td>
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{diasFaltantes}</td> 
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap"><span className={`bg-opacity-30 ${diasFaltantes < 60 && 'bg-red-400 text-red-500'} rounded-lg px-2 p-1`}>{diasFaltantes < 60 ? 'Urgente' : 'Normal'}</span></td>
      
                  <td className="px-2 2xl:px-6  capitalize whitespace-no-wrap"><span className={`bg-opacity-30 ${row.estado === 'Entregado' ? 'bg-green-400 text-green-500 ' : row.estado === 'Rechazado' ? 'bg-red-400 text-red-500' : row.estado === 'Enviado' ? 'bg-blue-400 text-blue-500' : 'bg-yellow-200 text-yellow-400'}  rounded-lg px-2 p-1`}>{row.estado}</span></td>                
                  <td className="flex items-center px-10 py-2 whitespace-no-wrap">
                    <div  className="relative">
                      <FiMoreHorizontal 
                        className="text-center text-gray-400 text-4xl cursor-pointer"
                        onClick={() => handleSelectOption(row.id)}
                      />
                      {isDropdownOpen[row.id] && (
                        <div className="absolute z-10 right-0 left-5 mt-2 w-48 bg-white rounded-lg shadow-lg">
                          {/* Aquí coloca las opciones del menú */}
                          <ul className='p-1'>
                            <button className='hover:text-[#006084] cursor-pointer '><a href={`/admin/${row.afiliado_dni ? row.afiliado_dni : ""}`}  target="_blank"
        rel="noopener noreferrer">Ver ficha completa</a></button>
                            {row.estado === 'Pendiente' && 
                            <>
                            <li onClick={() => AprovvedBenefit(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Enviar Beneficio</li>   
                            <li onClick={() => deleteUser(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Rechazar Beneficio</li>       
                            </>
                            }    
                            {(row.estado === 'Rechazado' || row.estado === 'Enviado') && 
                            <>
                            <li onClick={() => pendingBenefit(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Mover a pendientes</li>   
                                  
                            </>
                            }   
                                          
                          </ul>
                        </div>
                      )}
                    </div>
                  {/* <button onClick={() => handleOpenModal(row)} className="text-[#006084] hover:text-blue-900">Ver ficha</button>
                    <AiOutlineDelete onClick={() => deleteAfiliado(row.idafiliados)} className="text-[#006084] cursor-pointer hover:text-red-900 ml-2"/> */}
                  </td>
                </tr>
              )}
              )}
                  
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
      )}
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
                  Madre
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  TEL
                </th>             
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Fecha Solicitud
                </th>
                   <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Semanas
                </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Certificado IMG
                </th>  
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Fecha de Parto
                </th> 
                     <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Estado
                </th>  
                 <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Usuario Otorgante
                </th>          
                
              </tr>
            </thead>
              <tbody ref={animationParent}>
                <tr className={`text-gray-600 text-sm font-semibold `}>
                  <td className="px-6 py-3 text-[#006084] whitespace-no-wrap">{selectedUser.familiar_name}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.familiar_dni}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.familiar_tel}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{new Date(selectedUser.fecha_otorgamiento).toLocaleDateString("es-AR")}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.semanas}</td>
                  <td className="px-6 py-3 flex flex-col whitespace-no-wrap">   {selectedUser.certificado && (
    typeof selectedUser.certificado === 'string' ? (
      <a
        href={`https://backuatrebeneficios.galgoproductora.com/${selectedUser.certificado}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className='text-xs underline'>Ver imagen</span>
      </a>
    ) : (
      JSON.parse(selectedUser.certificado).map((ruta, index) => (
        <a
          key={index}
          href={`https://backuatrebeneficios.galgoproductora.com/${ruta}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className='text-xs underline'>Ver imagen {index + 1}</span>
        </a>
      ))
    )
  )}</td>
  <td className="px-6 py-3 whitespace-no-wrap">{new Date(selectedUser.fecha_de_parto).toLocaleDateString("es-AR")}</td>
                  <td className="px-6 capitalize whitespace-no-wrap">
                    <span className={`bg-opacity-30 ${selectedUser.status === 'Aprobado' ? 'bg-green-400 text-green-500 ' : selectedUser.status === 'Rechazado' ? 'bg-red-400 text-red-500' : 'bg-yellow-200 text-yellow-400'} rounded-lg px-2 p-1`}>
                      {selectedUser.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-no-wrap">{selectedUser.usuario_otorgante}</td>
                </tr>
              </tbody>

            
          </table>
                                          <div className='flex  items-center justify-around '>
                                        {/* {loading ? <Loader /> : (
                                          <>
                                        <button onClick={() => rechazarUsuario(selectedUser)} className='bg-red-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Rechazar</button>
                                    
                                        
                                        <button onClick={() => aprobarUsuario(selectedUser)} className='bg-green-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Aprobar</button>
                                      </>
                                        )
                                    } */}
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
                      <TbUserQuestion className='text-[#006084] mb-4 text-7xl'/>
                      <p>¿Estas seguro que deseas aprobar este beneficio?</p>
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
                      <p className='text-xl font-bold mt-2'>El beneficio se aprobó correctamente.</p>
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


           <Modal
            isOpen={openDeleteModal}
            onRequestClose={() => setOpenDeleteModal(false)}
            contentLabel="Rechazar Beneficio"
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
  
                      
                      
      

          
    </div>

  );
};

export default TableKitMaternal;

//  <Modal
//             isOpen={openStatusModal}
//             onRequestClose={() => setOpenStatusModal(false)}
//             contentLabel="Estado Usuario"
//             style={{
//               overlay: {
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//               },
//               content: {
//                 border: "none",
//                 background: "white",
//                 color: "black",
//                 top: "50%",
//                 left: "55%",
//                 right: "auto",
//                 bottom: "auto",
//                 marginRight: "-50%",
//                 transform: "translate(-50%, -50%)",
//                 padding: "2rem",
//                 width: "80%",
//                 maxWidth: "40rem",
//               },
//             }}
//           >
            
//             {/* {err && <p className="text-red-500">{err}</p>} */}
//             <div  className="mb-2">
//             {selectedUser && (
//               <div  className='flex justify-center h-full w-full'>
//                     <div ref={animationParent}  className="flex flex-col rounded-2xl w-[70%]">
//                       {currentStep === 1 &&
//                       <>
//                       <div className='flex  items-center justify-around '>
//                         <button onClick={() => aprobarUsuario(selectedUser)} className='bg-green-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Aprobar</button>
//                         <button onClick={() => rechazarUsuario(selectedUser)} className='bg-red-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Rechazar</button>
//                       </div>
//                       </>
//                       }
//                       {currentStep === 2 &&
//                       <>
//                       <div className='flex flex-col items-center justify-center '>
//                       <AiOutlineWarning className='text-red-600 text-7xl'/>
//                       <p>¿Estas seguro que deseas eliminar este usuario?</p>
//                       </div>
                          
                         
                    
                  
                    

//                         <div className="flex mt-4 justify-around items-center">
//                           {loading ? <Loader /> :
//                            <button
//                             className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
//                             onClick={() => handleRejected(selectedUser.id)}
//                           >
//                             Confirmar
//                           </button>
// }
//                           <button
//                             className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
//                             onClick={() => setOpenDeleteModal(false)}
//                           >
//                             Cerrar
//                           </button>
//                         </div>
//                         </>
//                         }
//                         {currentStep === 3 &&
//                       <>
//                       <div className='flex flex-col items-center justify-center '>
//                       <AiOutlineCheckCircle className='text-green-600 text-7xl'/>
//                       <p className='text-xl font-bold mt-2'>El afiliado se eliminó correctamente.</p>
//                       </div>
                          
                         
                    
                  
                    

//                         <div className="flex mt-4 justify-center items-end">                        
//                           <button
//                             className="mt-4 bg-gray-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
//                             onClick={() => setOpenDeleteModal(false)}
//                           >
//                             Cerrar
//                           </button>
//                         </div>
//                         </>
//                         }
//                         </div>
                        
                        
//                       </div>
                    
                    
                      
//                   )}
//                   {error && <p className="font-semibold text-red-500">{error}</p>}
//             </div>                          

       
//           </Modal>