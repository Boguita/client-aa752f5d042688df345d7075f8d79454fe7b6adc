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
import Avion from '../assets/img/plane.png';
import TableBeneficios from '../components/TableBeneficios';
const LunaDeMielAdmin = () => {
  const [dni, setDni] = useState('');
  const [beneficios, setBeneficios] = useState(null);
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
    const res = await api.get(`/tasks/luna-de-miel`);
    // Almacenar los datos recibidos de la API
    const benefits = res.data;
    
    setBeneficios(benefits);
    setErr(null);
    setIsLoading(false);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setBeneficios(null);
    console.log(error.response.data.message)
    setErr(error.response.data.message);
    setIsLoading(false);
  }
   setIsLoading(false);
};

// const handleSearch = () => {
//   if (searchKeyword.trim() === '') {
//     // Si la palabra clave de búsqueda está vacía, mostrar todos los afiliados.
//     setSearchResults(users);
//   } else {
//     // Filtrar los afiliados que coincidan con la palabra clave en nombre o DNI.
//     const filteredResults = users.filter((user) =>
//       user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//       user.dni.includes(searchKeyword)
//     );
//     setSearchResults(filteredResults);
//   }
// };

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


  const approvedUsers = beneficios?.filter(beneficio => beneficio.estado === 'Entregado');
  const rejectedUsers = beneficios?.filter(beneficio => beneficio.estado === 'Rechazado');
  const pendingUsers = beneficios?.filter(beneficio => beneficio.estado === 'Pendiente');


        return (
            <div className="h-screen pl-80 w-screen ml-5 bg-gray-200">
              <div className='py-36'>
                <div className=' h-[90%] w-[90%]'>
                  <div className='flex flex-col justify-around'>
                       <div className="flex h-20">
                          <img className=" w-12 h-12" src={Avion}></img>
                          <div className="flex flex-col pl-4">
                            <h2 className=" text-black text-3xl font-extrabold">
                              Luna de Miel
                            </h2>
                           
                          </div>
                        </div>
                    {isLoading ? <Loader/> :
                    <>
                           <div ref={animationParent}>
                        <h2 className='text-black font-extrabold text-xl'>Pendientes</h2>
                        <TableBeneficios data={pendingUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                      <div className='flex flex-col gap-x-8'>
                        <h2 className='text-black font-extrabold text-xl'>Entregados</h2>
                        <TableBeneficios data={approvedUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                       <div>
                        <h2 className='text-black font-extrabold text-xl'>Rechazados</h2>
                        <TableBeneficios data={rejectedUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                      </>
                    }   
                    </div>
                  
              

             
                    
                  

                  

              
                </div>
              </div>

              
            </div>
          );


      
    };


export default LunaDeMielAdmin;