import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../common/Axiosconfig';
import {IoIosAddCircle} from 'react-icons/io';
import PlaneIcon from '../assets/img/plane.png';
import MonoIcon from '../assets/img/mono.png';
import Libro from '../assets/img/libro-abierto.png';
import Graphics from './Graphics';
import Calendar from "react-calendar";
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import Sample from './Calendar';
import TableAfiliados from '../components/TableAfiliados';
import SimplePieCharts from '../components/SimplePieCharts';
import Input from '../components/Input';

const Afiliados = () => {
  const [dni, setDni] = useState('');
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const navigate = useNavigate();
  
  // Función para manejar las peticiones a la API para los datos de afiliados
const handleAffiliateDataRequest = async () => {  
  
  try {
    const res = await api.get(`/users/afiliados`);
    // Almacenar los datos recibidos de la API
    const afiliados = res.data;
    setUsers(afiliados.sort((a, b) => a.name.localeCompare(b.name)));
    setErr(null);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setUsers(null);
    console.log(error.response.data.message)
    setErr(error.response.data.message);
  }
 
};

const handleSearch = () => {
  if (searchKeyword.trim() === '') {
    // Si la palabra clave de búsqueda está vacía, mostrar todos los afiliados.
    setSearchResults(users);
  } else {
    // Filtrar los afiliados que coincidan con la palabra clave en nombre o DNI.
    const filteredResults = users.filter((user) =>
      user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.dni.includes(searchKeyword)
    );
    setSearchResults(filteredResults);
  }
};

useEffect(() => {
  handleAffiliateDataRequest();
}, []); // Ejec

const handleUpdateUserData = async () => {
  try {
    // Llamar a la función que obtiene los datos actualizados
    await handleAffiliateDataRequest();
    // Aquí puedes realizar otras acciones después de actualizar los datos, si es necesario.
  } catch (error) {
    // Manejar errores si es necesario
  }
};
 // Ejec

useEffect(() => {

    handleSearch(); 
}, [searchKeyword, users]);


        return (
            <div className="h-screen pl-80 w-screen ml-5 bg-gray-200">
              <div className='py-36'>
                <div className=' h-[90%] w-[90%]'>
                  <div className='flex flex-col justify-around'>
                    <div className='flex flex-col'>            
                      <h1 className="text-black font-extrabold text-3xl">Afiliados</h1>
                      <p className='text-gray-500 font-semibold mt-2'>Ingresa una palabra clave para buscar<br/>a un afiliado.</p>
                      <div className='flex gap-4'>

                       <div className="flex items-center mt-1">
                         <input
                          type={'search'}
                          className={'bg-white focus:outline-none pl-5 py-1 rounded-lg '}
                          placeholder='Buscar'
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />

                        </div>
                         {/* <div className="flex bg-white px-2 rounded-lg items-center">
                           <select
                            id="filter"
                            name="filter"
                          
                            value={""}
                            onChange={""}
                            className="text-sm pr-10 pl-2 font-semibold focus:text-[#808080] focus:outline-none w-[full]"
                          >
                            <option value="" disabled selected>Filtrar por:</option> 
                            <option value="city">Nombre</option>                           
                            <option value="city">Provincia</option>
                                               

                          </select>
                        </div> */}
                        {/* <div className="flex bg-white px-2 rounded-lg items-center">
                           <select
                            id="filter"
                            name="filter"
                          
                            value={""}
                            onChange={""}
                            className="text-sm pr-10 pl-2 font-semibold focus:text-[#808080] focus:outline-none w-[full]"
                          >
                            <option value="" disabled selected>Ordenar por:</option>                            
                            <option value="city">Nombre</option>                          
                            <option value="city">Provincia</option>                                                       
                          </select>
                        </div> */}
                     
                     </div>
                 
                    </div> 

                   <div className='flex gap-10'>
                  <TableAfiliados
                    data={searchResults} // Usa searchResults en lugar de users
                    rowsPerPage={10}
                    onUpdateUserData={handleUpdateUserData}
                  />
                  </div> 
                  
                  </div>

             
                    
                  

                  

              
                </div>
              </div>

              
            </div>
          );


      
    };


export default Afiliados;