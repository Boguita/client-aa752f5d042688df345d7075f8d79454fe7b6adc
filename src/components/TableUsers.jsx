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
import { FiMoreHorizontal } from 'react-icons/fi';


const TableUsers = ({ data, rowsPerPage = 8,  showPagination = true, onUpdateUserData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
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
  setCurrentStep(1);
  setError(null);
  console.log("llega a la funcion",afiliado)
  setSelectedUser(afiliado);
  setOpenDeleteModal(true);
}

const statusChangue = (afiliado) => {
  setSelectedUser(afiliado);
  setOpenStatusModal(true);
}

const handleDeleteUser = async (user,email) => {
  try {
  setLoading(true);
  const res = await api.delete('/users/delete',  {
      data: {
        username: user,
        email: email,
      },
    });
  if(res.status === 200) { 
  setCurrentStep(2)
  onUpdateUserData()
  setLoading(false);
  } 
  setLoading(false);
  } catch (error) {
    setError("Hubo un error al eliminar el administrador");
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
          <table   className="min-w-full  divide-y-4 divide-[#006084]">
            <thead >
              <tr>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Delegacion
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Seccional
                </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Estado
                </th>              
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            
            <tbody ref={animationParent}>
              {data?.slice(startIndex, endIndex).map((row, index) => (
                <tr  key={index} className={`text-gray-600 text-sm font-semibold ${index % 2 === 0 ? grayRowClass : whiteRowClass }`}>
                  <td className="px-6 capitalize py-3 whitespace-no-wrap">{row.username}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.provincia}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.delegacion}</td>
                  <td className="px-6 py-3 text-[#006084] whitespace-no-wrap">{row.seccional}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.dni}</td>
                  <td className="px-6  capitalize whitespace-no-wrap"><span className={`bg-opacity-30 ${row.status === 'Aprobado' ? 'bg-green-400 text-green-500 ' : row.status === 'Rechazado' ? 'bg-red-400 text-red-500' : 'bg-yellow-200 text-yellow-400'}  rounded-lg px-2 p-1`}>{row.status}</span></td>                
                  
                  <td className="flex items-center px-10 py-2 whitespace-no-wrap">
                    <div  className="relative">
                      <FiMoreHorizontal 
                        className="text-center text-gray-400 text-4xl cursor-pointer"
                        onClick={() => handleSelectOption(row.id)}
                      />
                      {isDropdownOpen[row.id] && (
                        <div className="absolute z-10 right-0 left-5 mt-2 w-48 bg-white rounded-lg shadow-lg">
                          {/* Aquí coloca las opciones del menú */}
                          
                            {row.status === 'Aprobado' &&
                            <ul className='p-1'>
                            <li className='hover:border-[#006084] hover:border-b-2  cursor-pointer ' onClick={() => handleOpenModal(row)}>Ver ficha completa</li>
                            <li className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Ver beneficios entregados</li>   
                            <li onClick={() => deleteUser(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Eliminar Usuario</li>                         
                             </ul>
                            }
                              {row.status === 'Pendiente' &&
                            <ul className='p-1'>
                            <li className='hover:border-[#006084] hover:border-b-2  cursor-pointer ' onClick={() => handleOpenModal(row)}>Ver ficha completa</li>
                            <li onClick={() => deleteUser(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Eliminar Usuario</li>                         
                             </ul>
                            }
                              {row.status === 'Rechazado' &&
                            <ul className='p-1'>
                            <li className='hover:border-[#006084] hover:border-b-2  cursor-pointer ' onClick={() => handleOpenModal(row)}>Ver ficha completa</li>
                            <li onClick={() => deleteUser(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Eliminar Usuario</li>                         
                             </ul>
                            }
                           
                        </div>
                      )}
                    </div>
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
            {currentStep === 1 && selectedUser && (
              
              <div  className='flex  justify-center items-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col  rounded-2xl w-[85%]">
                          
                          
                          <img className='mb-[-5px]' src={Avatar}>
                                </img>


                              <div className=' p-5 bg-white rounded-b-2xl grid gap-4'>
                                <p className='mt-2 capitalize text-gray-800 font-semibold'><strong>{selectedUser.username}</strong></p>
                                <p className='text-gray-500 italic font-semibold'>Miembro desde:{selectedUser.fecha_aprobacion && new Date(selectedUser.fecha_aprobacion).toLocaleDateString()}</p>

                                <div className='grid grid-cols-2'>
                    <div className='flex flex-col justify-around' >   

                      <p><strong>DNI</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.dni}</p>


                      <p><strong>Nacionalidad</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.nacionalidad}</p>

                      <p><strong>Sexo</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.sexo}</p>

                      <p><strong>Provincia</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.provincia}</p>

                       <p><strong>Delegación</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.delegacion}</p>

                      
                    </div>

                    <div className='flex flex-col justify-around'>
                      
                       <p ><strong>CUIT</strong></p>
                      <p className='text-gray-500 font-semibold'> {selectedUser.cuit}</p>


                      <p><strong>Teléfono</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.tel}</p>

                      <p><strong>Email</strong></p>
                      <p className='text-gray-500 break-all font-semibold'>{selectedUser.email}</p>

                      <p><strong>Domicilio</strong></p>
                      <p className='text-gray-500  font-semibold'>{selectedUser.domicilio}</p>

                      <p><strong>Seccional</strong></p>
                      <p className='text-gray-500 font-semibold'>{selectedUser.seccional}</p>

                    
                    </div>
               
                    </div>
                          <div className='flex  items-center justify-around '>
                        {loading ? <Loader /> : (
                          <>
                        <button onClick={() => rechazarUsuario(selectedUser)} className='bg-red-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Rechazar</button>
                     
                         
                        <button onClick={() => aprobarUsuario(selectedUser)} className='bg-green-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Aprobar</button>
                       </>
                        )
                    }
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
            {selectedUser && (
              <div  className='flex justify-center h-full w-full'>
                    <div ref={animationParent}  className="flex flex-col rounded-2xl w-[70%]">
                      {currentStep === 1 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <AiOutlineWarning className='text-red-600 text-7xl'/>
                      <p>¿Estas seguro que deseas eliminar este usuario?</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => handleDeleteUser(selectedUser.username, selectedUser.email)}
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
                      <p className='text-xl font-bold mt-2'>El usuario se eliminó correctamente.</p>
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
            isOpen={openStatusModal}
            onRequestClose={() => setOpenStatusModal(false)}
            contentLabel="Estado Usuario"
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
                      <div className='flex  items-center justify-around '>
                        <button onClick={() => aprobarUsuario(selectedUser)} className='bg-green-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Aprobar</button>
                        <button onClick={() => rechazarUsuario(selectedUser)} className='bg-red-500 text-white font-bold rounded-lg p-2 hover:bg-opacity-75'>Rechazar</button>
                      </div>
                      </>
                      }
                      {currentStep === 2 &&
                      <>
                      <div className='flex flex-col items-center justify-center '>
                      <AiOutlineWarning className='text-red-600 text-7xl'/>
                      <p>¿Estas seguro que deseas eliminar este usuario?</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={handleDeleteUser}
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
                        {currentStep === 3 &&
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

export default TableUsers;
