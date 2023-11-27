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
import Input from './Input';


const TableSeccionales = ({ data, rowsPerPage = 15,  showPagination = true, onUpdateUserData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [afiliadosSeleccionados, setAfiliadosSeleccionados] = useState([]);
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


const deleteUser = async (afiliado) => {
  console.log("llega a la funcion",afiliado)
  await setSelectedUser(afiliado);
  setOpenDeleteModal(true);
}

const statusChangue =  (afiliado) => {
   setSelectedUser(afiliado);
  setOpenStatusModal(true);
}

const handleDeleteSeccional = async (user) => {
  try {
    setError(null);
  setLoading(true);
  const res = await api.delete(`/tasks/seccionales/${user}`);
  if(res.status === 200) {
  setCurrentStep(2)
  onUpdateUserData()
  } else {
  setError("Hubo un error al eliminar la seccional");
  setLoading(false); 
  } 
  } catch (error) {
    setError("Hubo un error al eliminar la seccional");
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

useEffect(() => {
  console.log(afiliadosSeleccionados);
}
, [afiliadosSeleccionados]);




  return (
    <div ref={animationParent} className="h-full w-full">
      <div  className="flex flex-col">
        <div ref={animationParent} className="mt-4 bg-white min-h-[25rem] p-8 rounded-xl">
          <table   className="w-full table-auto divide-y-4 divide-[#006084]">
            <thead >
              <tr>
                <th className="px-2 2xl:px-6 py-3   text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Nº ID
                </th>
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Provincia
                </th>                             
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Delegacion
                </th>  
                  <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Seccional
                </th> 
                <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Dirección
                </th> 
               <th className="px-2 2xl:px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Acciones
                </th>
                
                
              </tr>
            </thead>
            
            <tbody ref={animationParent}>
              {data?.slice(startIndex, endIndex).map((row, index) => (
                <tr  key={index} className={`text-gray-600 text-sm font-semibold ${index % 2 === 0 ? grayRowClass : whiteRowClass }`}>
                  <td className="px-2 2xl:px-6 py-3 whitespace-no-wrap">{row.idseccionales}</td>           
                  <td className="px-6 py-3 whitespace-no-wrap">{row.provincia}</td>
                  <td className="px-2 2xl:px-6 capitalize py-3 whitespace-no-wrap">{row.delegacion}</td>
                         <td className="px-6 py-3 capitalize text-[#006084] whitespace-no-wrap">{row.nombre}</td>
                         <td className="px-6 py-3 capitalize text-[#006084] whitespace-no-wrap">{row.direccion}{" "}{row.numero}</td>
                
      
                  <td className="flex items-center px-10 py-2 whitespace-no-wrap">
                    <div  className="relative">
                      <FiMoreHorizontal 
                        className="text-center text-gray-400 text-4xl cursor-pointer"
                        onClick={() => handleSelectOption(row.idseccionales)}
                      />
                      {isDropdownOpen[row.idseccionales] && (
                        <div className="absolute z-10 right-0 left-5 mt-2 w-48 bg-white rounded-lg shadow-lg">
                          {/* Aquí coloca las opciones del menú */}
                          <ul className='p-1'>
                            <li onClick={() => deleteUser(row)} className='hover:border-[#006084] hover:border-b-2  cursor-pointer'>Eliminar</li>                         
                          </ul>
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
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        // Mostrar al menos 15 números
        if (totalPages <= 15 || (page >= currentPage - 7 && page <= currentPage + 7) || page === 1 || page === totalPages) {
          return (
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
          );
        } else if (page === currentPage - 8 || page === currentPage + 8) {
          // Mostrar puntos suspensivos
          return <span key={page}>...</span>;
        }
        return null; // Ocultar otras páginas
      })}
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
            isOpen={openDeleteModal}
            onRequestClose={() => setOpenDeleteModal(false)}
            contentLabel="Eliminar Afiliado"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
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
                      <p>¿Estas seguro que deseas eliminar esta seccional?</p>
                      </div>
                          
                         
                    
                  
                    

                        <div className="flex mt-4 justify-around items-center">
                          {loading ? <Loader /> :
                           <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => handleDeleteSeccional(selectedUser.idseccionales)}
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
                      <p className='text-xl font-bold mt-2'>La seccional se eliminó correctamente.</p>
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

export default TableSeccionales;
