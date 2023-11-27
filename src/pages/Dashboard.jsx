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

const Dashboard = () => {
  const [dni, setDni] = useState('');
  const [affiliateData, setAffiliateData] = useState(null);
  const [err, setErr] = useState(null);
  const [beneficio, setBeneficio] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popUpseen, setPopUpseen] = useState(false);
  const [showEmpleadorPopup, setShowEmpleadorPopup] = useState(false);

  const navigate = useNavigate();
  
  // Función para manejar las peticiones a la API para los datos de afiliados
const handleAffiliateDataRequest = async () => {
  if (!dni) {
    console.error('Por favor, ingresa un número de DNI antes de hacer la solicitud.');
    return;
  }

  try {
    const res = await api.get(`users/afiliados/${dni}`);
    // Almacenar los datos recibidos de la API
    console.log(res.data)
    setAffiliateData(res.data);
    setErr(null);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setAffiliateData(null);
    console.log(error.response.data.message)
    setErr(error.response.data.message);
  }
 
};

 const formatFechaOtorgamiento = (fecha) => {
    const date = new Date(fecha);
    const formattedDate = date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formattedDate;
  };

    const handleDateChange = (date) => {
    setSelectedDate(date);
    // Aquí podrías realizar una solicitud a la base de datos para obtener los datos del gráfico correspondientes a la fecha seleccionada
  };


  const handleSeeBenefit = async () => {
    try {
    const res = await api.get(`tasks/beneficio/${dni}`);
    
    // Almacenar los datos del beneficio otorgado
    setBeneficio(res.data);
    setShowPopup(true);
    console.log(beneficio)
     // Mostrar el popup
  } catch (error) {
    console.log(error.response.data.message);
  }
    
  }

const handleGrantBenefit = async () => {
  try {
    const res = await api.get(`tasks/beneficio/${dni}`);
    // Almacenar los datos del beneficio otorgado
    setBeneficio(res.data);
     // Mostrar el popup
  } catch (error) {
    console.log(error.response.data.message);
  }
  if(showPopup === false && popUpseen === true){
  navigate(`/beneficios?dni=${dni}`);
  } else {
    setShowPopup(true);
  }
};

useEffect(() => {
  if (!showPopup && beneficio) {
    // Si showPopup es falso y hay datos de beneficio, limpiar los datos de beneficio
    setBeneficio(null);
  }
}, [showPopup, beneficio]);
 return (
  <div className="min-h-screen pl-4 md:pl-80 bg-[#d8d8d8]">
    <div className='py-8 md:py-36'>
      <div className='flex flex-col md:flex-row justify-around'>
        <div className='flex flex-col md:w-2/3'>
          <h1 className="text-black font-extrabold text-2xl md:text-3xl">Solicitar Beneficio</h1>
          <p className='text-gray-500 font-semibold mt-4 md:mt-2'>Elige el método por el cual deseas <br/> buscar un afiliado.</p>
          <div className="flex items-center mt-4">
            <IoIosAddCircle className='text-cyan-800 text-2xl md:text-3xl mr-2' />
            <Link to="/search-afiliado" className="text-[#006084] font-semibold">ESCANEAR CREDENCIAL DIGITAL</Link>
          </div>
          <div className="flex items-center mt-4">
            <IoIosAddCircle className='text-[#006084] text-2xl md:text-3xl mr-2' />
            <Link to="/search-afiliado" className="text-[#006084] font-semibold">INGRESAR DNI MANUALMENTE</Link>
          </div>
        </div>

        <div className='flex flex-col justify-center md:flex-row gap-4 md:gap-10'>
          <div className="flex flex-col rounded-lg h-80 w-full md:w-1/4 p-4 bg-white">
              <img className='mt-2 w-12 h-12' src={PlaneIcon}>
             </img>
             <h3 className='mt-4 lg:text-3xl md:text-2xl font-extrabold'>
               Luna de Miel
             </h3>
             <p className='mt-2 text-sm md:text-base text-gray-500 font-semibold'>
               Lorem ipsum dolor sit amet consectetur adipiscing elit, rhoncus per leo auctor tincidunt viverra praesent cubilia, vivamus cursus euismod justo erat tortor.
             </p>
             <button className='mt-4 bg-[#0E6F4B] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
               VER BENEFICIO
             </button>
          </div>
          <div className="flex flex-col rounded-lg h-80 w-full md:w-1/4 p-4 bg-white">
              <img className='mt-2 w-12 h-12' src={PlaneIcon}>
             </img>
             <h3 className='mt-4 text-3xl font-extrabold'>
               Luna de Miel
             </h3>
             <p className='mt-2 text-gray-500 font-semibold'>
               Lorem ipsum dolor sit amet consectetur adipiscing elit, rhoncus per leo auctor tincidunt viverra praesent cubilia, vivamus cursus euismod justo erat tortor.
             </p>
             <button className='mt-4 bg-[#0E6F4B] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
               VER BENEFICIO
             </button>
          </div>
          <div className="flex flex-col rounded-lg h-80 w-full md:w-1/4 p-4 bg-white">
              <img className='mt-2 w-12 h-12' src={PlaneIcon}>
             </img>
             <h3 className='mt-4 text-3xl font-extrabold'>
               Luna de Miel
             </h3>
             <p className='mt-2 text-gray-500 font-semibold'>
               Lorem ipsum dolor sit amet consectetur adipiscing elit, rhoncus per leo auctor tincidunt viverra praesent cubilia, vivamus cursus euismod justo erat tortor.
             </p>
             <button className='mt-4 bg-[#0E6F4B] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
               VER BENEFICIO
             </button>
          </div>
          
          {/* Repeat similar code blocks for other items */}
        </div>
      </div>
    </div>
  </div>
);


  
};


export default Dashboard;



// return (
//     <div className="h-screen pl-64 w-screen ml-5 bg-[#d8d8d8]">
//       <div className='py-36'>
//         <div className='flex justify-around'>
//           <div className='flex flex-col'>
//             <h1 className="text-black font-extrabold text-3xl">Solicitar Beneficio</h1>
//             <p className='text-gray-500 font-semibold mt-2'>Elige el método por el cual deseas <br/> buscar un afiliado.</p>
//             <div className="flex items-center mt-4">
//               <IoIosAddCircle className='text-cyan-800 text-3xl mr-2' />
//               <Link to="/search-afiliado" className="text-[#006084] font-semibold">ESCANEAR CREDENCIAL DIGITAL</Link>
//             </div>
//             <div className="flex items-center mt-4">
//               <IoIosAddCircle className='text-[#006084] text-3xl mr-2' />
//               <Link to="/search-afiliado" className="text-[#006084] font-semibold">INGRESAR DNI MANUALMENTE</Link>
//             </div>
//           </div>

//           <div className='flex gap-10'>
//             <div className="flex flex-col rounded-lg h-80 w-80 p-5 mt-4 bg-white">
//               <img className='mt-2 w-12 h-12' src={PlaneIcon}>
//              </img>
//              <h3 className='mt-4 text-3xl font-extrabold'>
//                Luna de Miel
//              </h3>
//              <p className='mt-2 text-gray-500 font-semibold'>
//                Lorem ipsum dolor sit amet consectetur adipiscing elit, rhoncus per leo auctor tincidunt viverra praesent cubilia, vivamus cursus euismod justo erat tortor.
//              </p>
//              <button className='mt-4 bg-[#0E6F4B] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
//                VER BENEFICIO
//              </button>
//             </div>
//             <div className="flex flex-col rounded-lg h-80 w-80 p-5 mt-4 bg-white">
//              <img className='mt-2 w-12 h-12' src={MonoIcon}>
//              </img>
//              <h3 className='mt-4 text-3xl font-extrabold'>
//                Kit Nacimiento
//              </h3>
//              <p className='mt-2 text-gray-500 font-semibold'>
//                Lorem ipsum dolor sit amet consectetur adipiscing elit, rhoncus per leo auctor tincidunt viverra praesent cubilia, vivamus cursus euismod justo erat tortor.
//              </p>
//              <button className='mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
//                VER BENEFICIO
//              </button>
//             </div>
//             <div className="flex flex-col rounded-lg h-80 w-80 p-5 mt-4 bg-white">
//               <img className='mt-2 w-12 h-12' src={Libro}>
//              </img>
//              <h3 className='mt-4 text-3xl font-extrabold'>
//                Kit Escolar
//              </h3>
//              <p className='mt-2 text-gray-500 font-semibold'>
//                Lorem ipsum dolor sit amet consectetur adipiscing elit, rhoncus per leo auctor tincidunt viverra praesent cubilia, vivamus cursus euismod justo erat tortor.
//              </p>
//              <button className='mt-4 bg-[#23A1D8] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
//                VER BENEFICIO
//              </button>
//             </div>
//           </div>
//         </div>

      
//       </div>
//     </div>
//   );




