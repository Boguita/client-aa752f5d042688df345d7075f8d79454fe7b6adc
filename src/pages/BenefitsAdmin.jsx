import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../common/Axiosconfig';
import {IoIosAddCircle} from 'react-icons/io';
import PlaneIcon from '../assets/img/plane.png';
import MonoIcon from '../assets/img/mono.png';
import Libro from '../assets/img/libro-abierto.png';
import Graphics from './Graphics';
import Calendar from "react-calendar";
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import Sample from './Calendar';
import Loader from '../components/Loader';

const BenefitsAdmin = () => {

  const [affiliateData, setAffiliateData] = useState(null);
  const [err, setErr] = useState(null);
  const [beneficio, setBeneficio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
  const dni = new URLSearchParams(location.search).get("dni");

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



  const handleValidateBenefit = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`tasks/beneficio/${dni}`,);
      // Almacenar los datos recibidos de la API
      setBeneficio(res.data)
      setIsLoading(false);
      console.log(res.data)

        // Restablecer el estado del error si la solicitud tiene éxito
    }
    catch (error) {
      console.log(error.response.data.message)
      setErr(error.response.data.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    handleValidateBenefit();
  }
  , [dni]);



 return (
  <div className="min-h-screen pl-4 md:pl-80 bg-gray-200">
    <div className='py-8 md:py-36'>
        <div className='flex flex-col md:w-2/3'>
          <h1 className="text-black font-extrabold text-2xl md:text-3xl">Selecciona el beneficio a consultar</h1>
          
        </div>
       <div className='flex flex-col md:flex-row pt-20'>


        <div className='flex flex-col justify-center md:flex-row gap-4 md:gap-10'>          
            
            <>
          <div className="flex flex-col rounded-lg h-90 w-full md:w-1/4 p-4 bg-white">
              <img className='mt-2 w-12 h-12' src={PlaneIcon}>
             </img>
             <h3 className='mt-4 lg:text-3xl md:text-2xl font-extrabold'>
               Luna de Miel
             </h3>
             <p className='mt-2 text-sm md:text-base text-gray-500 font-semibold'>
               Los afiliados a UATRE podrán gozar de 1 semana en forma gratuita (7 días- 6 noches)
                ingresando el día Lunes y retirándose el día Domingo, en cualquiera de las instalaciones
                hoteleras, de Necochea y de la Provincia de Cordoba, pertenecientes a nuestra organización.
                La estadía incluye sólo desayuno.
             </p>
             <div className='flex items-end h-full'>
              {isLoading ? <Loader/> : beneficio?.some((beneficio) => beneficio.tipo === 'Luna de miel' && (beneficio.estado === "Pendiente" || beneficio.estado === "Entregado"))
 ?
              <p className='text-red-500 font-semibold'>El beneficio ya ha sido otorgado con anterioridad.</p>             
              : <button 
              onClick={() => {                
                  navigate('/admin/luna-de-miel');                      
              }}
             className='mt-4 bg-[#0E6F4B] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
               VER
             </button> }
             </div>
          </div>
          </>
     


          <div className="flex flex-col rounded-lg h-90 w-full md:w-1/4 p-4 bg-white">
              <img className='mt-2 w-12 h-12' src={MonoIcon}>
             </img>
             <h3 className='mt-4 text-3xl font-extrabold'>
               Kit Nacimiento
             </h3>
             <p className='mt-2 text-gray-500 font-semibold'>
               Para acceder a este beneficio solo se necesita fotocopia del recibo de sueldo del trabajador o trabajadora afiliada, constancia de embarazo con fecha probable de parto y fotocopia del DNI de la beneficiaria. Se puede gestionar en cualquier sede del gremio.
             </p>
             <div className='flex items-end h-full'>
             <button 
              onClick={() => {
                // Redirigir a la ruta correspondiente si el usuario está autenticado
                
                  navigate('/admin/kit-nacimiento'
                  ); 
                
                  // Si no está autenticado, redirigir al inicio de sesión
                 
              }}
             className='mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
               VER
             </button>     
             </div>
          </div>
          <div className="flex flex-col rounded-lg h-90 w-full md:w-1/4 p-4 bg-white">
              <img className='mt-2 w-12 h-12' src={Libro}>
             </img>
             <h3 className='mt-4 text-3xl font-extrabold'>
               Kit Escolar
             </h3>
             <p className='mt-2 text-gray-500 font-semibold'>
Cada año, al comienzo del ciclo escolar, desde el gremio se distribuyen guardapolvos y un kit de mochila y útiles escolares para los hijos de cada trabajador. Se debe gestionar en la sede del gremio que se encuentre más cercana al domicilio del trabajador o trabajadora.             </p>
             <div className='flex items-end h-full'>
             <button
             onClick={() => {
         
                
                  navigate('/admin/kit-escolar'
             
                  ); 
                
             
                 
              }}
             
             className='mt-4 bg-[#23A1D8] w-36 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
               VER
             </button>
             </div>
             
          </div>
          
          {/* Repeat similar code blocks for other items */}
        </div>
      </div>
    </div>
  </div>
);


  
};




export default BenefitsAdmin;

// const navigate = useNavigate();
//   const { currentUser } = useContext(AuthContext);
//   const location = useLocation();
//   const dni = new URLSearchParams(location.search).get("dni");

//   const availableBenefits = [
//     { name: "Kit escolar", path: "/kit-escolar" },
//     { name: "Kit maternal", path: "/kit-maternal" },
//     { name: "Luna de Miel", path: "/luna-de-miel" },
//   ];

//   return (
//     <div className="ml-5 sm:pl-64 h-screen w-screen bg-black">
//       <div className="sm:w-[85vw] p-4">
//         {/* Título "Beneficios Disponibles" centrado */}
//         <h3 className="text-white text-center mb-4">Beneficios Disponibles</h3>

//         {/* Botones con nombres de beneficios disponibles */}
//         <div className="grid grid-cols-3 gap-4">
//           {availableBenefits.map((beneficio) => (
//             <button
//               key={beneficio.name}
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               onClick={() => {
//                 // Redirigir a la ruta correspondiente si el usuario está autenticado
//                 if (currentUser?.username) {
//                   navigate(`${beneficio.path}`, {
//                     state: { dni }, // Pasamos el DNI como parámetro en el state
//                   }); // Agregamos /beneficios/ al inicio de la ruta
//                 } else {
//                   // Si no está autenticado, redirigir al inicio de sesión
//                   navigate("/login");
//                 }
//               }}
//             >
//               {beneficio.name}
//             </button>
//           ))}
//         </div>

      
//       </div>
//     </div>
// );