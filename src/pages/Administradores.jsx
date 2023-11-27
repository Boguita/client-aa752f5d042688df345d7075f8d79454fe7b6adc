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
import TableUsers from '../components/TableUsers';
import SimplePieCharts from '../components/SimplePieCharts';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const Administradores = () => {
  const [dni, setDni] = useState('');
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationParent] = useAutoAnimate();
  const [err, setErr] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const navigate = useNavigate();
  
  // Función para manejar las peticiones a la API para los datos de afiliados
const handleAffiliateDataRequest = async () => {  
  
  try {
    setIsLoading(true);
    const res = await api.get(`/users`);
    // Almacenar los datos recibidos de la API
    const users = res.data;
    console.log(users)
    setUsers(users.sort((a, b) => a.username.localeCompare(b.username)));
    setErr(null);
    setIsLoading(false);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setUsers(null);
    console.log(error.response.data.message)
    setErr(error.response.data.message);
    setIsLoading(false);
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

const handleUpdateUserData = async () => {
  try {
    // Llamar a la función que obtiene los datos actualizados
    await handleAffiliateDataRequest();
    // Aquí puedes realizar otras acciones después de actualizar los datos, si es necesario.
  } catch (error) {
    // Manejar errores si es necesario
  }
};




useEffect(() => {
  handleAffiliateDataRequest();
}, []); // Ejec

// useEffect(() => {

//     handleSearch(); 
// }, [searchKeyword, users]);


  const approvedUsers = users?.filter(user => user.status === 'Aprobado').sort((a, b) => a.fecha_aprobacion?.localeCompare(b.fecha_aprobacion));
  const rejectedUsers = users?.filter(user => user.status === 'Rechazado');
  const pendingUsers = users?.filter(user => user.status === 'Pendiente');


        return (
            <div className="h-screen pl-80 w-screen ml-5 bg-gray-200">
              <div className='py-36'>
                <div className=' h-[90%] w-[90%]'>
                  <div className='flex flex-col justify-around'>
                    <div className='flex flex-col mb-4'>            
                      <h1 className="text-black font-extrabold text-3xl">Administradores</h1>
               
                     
                 
                    </div> 
                    {isLoading ? <Loader/> :
                    <>
                           <div ref={animationParent}>
                        <h2 className='text-black font-extrabold text-xl'>Pendientes</h2>
                        <TableUsers data={pendingUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                      <div className='flex flex-col gap-x-8'>
                        <h2 className='text-black font-extrabold text-xl'>Aprobados</h2>
                        <TableUsers data={approvedUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                         <div>
                        <h2 className='text-black font-extrabold text-xl'>Rechazados</h2>
                        <TableUsers data={rejectedUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                      </>
                    }   
                    </div>
                  
              

             
                    
                  

                  

              
                </div>
              </div>

              
            </div>
          );


      
    };


export default Administradores;