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
import Table from '../components/Table';
import SimplePieCharts from '../components/SimplePieCharts';

const DashboardAdmin = () => {
  const [dni, setDni] = useState('');
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState(null);
  const [beneficio, setBeneficio] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popUpseen, setPopUpseen] = useState(false);
  const [showEmpleadorPopup, setShowEmpleadorPopup] = useState(false);

  const navigate = useNavigate();
  
  // Función para manejar las peticiones a la API para los datos de afiliados
const handleAffiliateDataRequest = async () => {  
  
  try {
    const res = await api.get(`/users`);
    // Almacenar los datos recibidos de la API
    console.log(res.data)
    setUsers(res.data);
    setErr(null);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setUsers(null);
    console.log(error.response.data.message)
    setErr(error.response.data.message);
  }
 
};

useEffect(() => {
  handleAffiliateDataRequest();
}, []);








        return (
            <div className="h-screen pl-64 w-screen ml-5 bg-gray-200">
              <div className='py-36'>
                <div className=' h-full w-full'>
                  <div className='flex justify-around'>
                    <div className='flex flex-col'>            
                      <h1 className="text-black font-extrabold text-3xl">Solicitudes de Beneficios</h1>
                      <p className='text-gray-500 font-semibold mt-2'>Elige el metodo por el cual deseas <br/> buscar un afiliado.</p>
                       <div className="flex items-center mt-1">
                    <button 
                     className='mt-2 bg-[#23A1D8] font-bold text-white rounded-lg p-2 hover:bg-opacity-75'
                     >
                      KIT ESCOLAR
                     </button>
                  </div>
                      <div className="flex items-center mt-1">
                    <button 
                     className='mt-2 bg-[#0E6F4B] font-bold text-white rounded-lg p-2 hover:bg-opacity-75'
                     >
                      LUNA DE MIEL
                     </button>
                    
                  </div>
                    <div className="flex items-center mt-1">
                    <button 
                     className='mt-2 bg-[#006084] font-bold text-white rounded-lg p-2 hover:bg-opacity-75'
                     >
                      KIT MATERNAL
                     </button>
                  </div>
                 
                    </div> 

                   <div className='flex gap-10'>
                   <Table
                   data={users}
                   rowsPerPage={6}
                   showPagination={false} 
                   />
                  </div> 
                  
                  </div>

                  <div className='flex-col mt-10 pl-20'>
                    <h1 className="text-black font-extrabold text-3xl">Tus Reportes</h1>
                    <div className='flex gap-x-8 mt-8 w-[95%] h-[100%]'>        

                     
                      <SimplePieCharts></SimplePieCharts> 
                  
                    
                    
                      <Graphics></Graphics> 

                      
                      
                      
                    
                    </div>
                    </div>
                  

                  

              
                </div>
              </div>

              
            </div>
          );


      
    };


export default DashboardAdmin;