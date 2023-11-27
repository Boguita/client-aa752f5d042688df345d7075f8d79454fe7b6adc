import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../common/Axiosconfig';
import {IoIosAddCircle} from 'react-icons/io';
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
import TableKitEscolar from '../components/TableKitEscolar';
import GraphicsStock from '../components/GraphicsStock';
import { RxExternalLink } from 'react-icons/rx';
import TableStockEnviado from '../components/TableStockEnviado';
import ListBenefits from '../components/ListBenefits';

const KitEscolarAdmin = () => {
  const [dni, setDni] = useState('');
  const [beneficios, setBeneficios] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationParent] = useAutoAnimate();
  const [err, setErr] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stockenviado, setStockEnviado] = useState(null);

  const navigate = useNavigate();
  
  // Función para manejar las peticiones a la API para los datos de afiliados
// Función para agrupar beneficios por afiliado y familiar
const agruparBeneficios = (beneficios) => {
  return beneficios.reduce((acumulador, beneficio) => {
    const clave = generarClaveAgrupacion(beneficio);
    acumulador[clave] = beneficio;
    return acumulador;
  }, {});
};

// Función para generar una clave de agrupación única para cada afiliado y familiar
const generarClaveAgrupacion = (beneficio) => {
  return `${beneficio.afiliado_id}_${beneficio.familiar_id}`;
};


  const handleAffiliateDataRequest = async () => {
  try {
    setIsLoading(true);

    const res = await api.get(`/tasks/kit-escolar`);
    const res2 = await api.get(`/tasks/stock-enviado`);

    const stockEnviado = res2.data;
    const benefits = res.data;

    // Obtener beneficios agrupados por afiliado y familiar
    const beneficiosAgrupados = agruparBeneficios(benefits);

    benefits.forEach((beneficio) => {
      const key = generarClaveAgrupacion(beneficio);
      const beneficioExistente = beneficiosAgrupados[key];

      if (beneficioExistente) {
        // Comparar las fechas de otorgamiento y actualizar solo si es más reciente
        const fechaExistente = new Date(beneficioExistente.fecha_otorgamiento);
        const fechaNueva = new Date(beneficio.fecha_otorgamiento);

        if (fechaNueva <= fechaExistente) {
          // Actualizar solo si la fecha nueva es igual o más reciente
          beneficiosAgrupados[key] = {
            ...beneficioExistente,
            utiles: beneficioExistente.utiles || beneficio.utiles,
            mochila: beneficioExistente.mochila || beneficio.mochila,
            guardapolvo_confirm: beneficioExistente.guardapolvo_confirm || beneficio.guardapolvo_confirm,
            // Agrega aquí otros campos booleanos que necesites manejar
          };
        }
        // Si no deseas actualizar en caso de fechas iguales, usa: if (fechaNueva > fechaExistente) { ... }
      } else {
        // Agregar nuevo beneficio si no existe
        beneficiosAgrupados[key] = beneficio;
      }
    });

    // Convertir de nuevo a un array de beneficios
    const beneficiosActualizados = Object.values(beneficiosAgrupados);

    setStockEnviado(stockEnviado);
    setBeneficios(beneficiosActualizados);
    setErr(null);
  } catch (error) {
    setBeneficios(null);
    console.log(error.response.data.message);
    setErr(error.response.data.message);
  } finally {
    setIsLoading(false);
  }
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
  const handleListPendings = () => {
    // Abre una nueva pestaña o ventana del navegador con la URL especificada
    window.open('/admin/kit-escolar/listado-pendientes', '_blank');
  };

  const stock = stockenviado?.sort((a, b) => b.idenviados - a.idenviados);
  const approvedUsers = beneficios?.filter(beneficio => beneficio.estado === 'Enviado');
  const rejectedUsers = beneficios?.filter(beneficio => beneficio.estado === 'Rechazado');
  const pendingUsers = beneficios?.filter(beneficio => beneficio.estado === 'Pendiente');
  const successUsers = beneficios?.filter(beneficio => beneficio.estado === 'Entregado');


        return (
            <div className="h-screen pl-80 w-screen ml-5 bg-gray-200">
              <div className='py-36'>
                <div className=' h-[90%] w-[90%]'>
                  <div className='flex flex-col justify-around'>
                       <div className="flex h-20">
                          <img className=" w-12 h-12" src={Libro}></img>
                          <div className="flex flex-col pl-4">
                            <h2 className=" text-black text-3xl font-extrabold">
                              Kit Escolar
                            </h2>
                            
                           
                          </div>
                        </div>
                    {isLoading ? <Loader/> :
                    <>
                     {/* <GraphicsStock /> */}
                     <div>
                        <h2 className='text-black font-extrabold text-2xl mb-2'>Gestión de Stock</h2>
                        <button onClick={handleListPendings} className='p-1 px-3 w-40 font-bold text-white rounded-lg bg-[#006084] hover:bg-opacity-60'
                    
                        >
                          <span className='flex items-center'>
                          Acceder a lista de totales
                          <RxExternalLink className='text-2xl' />
                          </span>
                        </button>
                       
                     </div>
                     
                       <ListBenefits />
                     
                           {/* <div ref={animationParent}>
                        <h2 className='text-black font-extrabold text-xl mt-2'>Pendientes</h2>
                        <TableKitEscolar data={pendingUsers} onUpdateUserData={handleUpdateUserData} />
                      </div> */}
                      {/* <div>
                        <h2 className='text-black font-extrabold text-xl'>Rechazados</h2>
                        <TableKitMaternal data={rejectedUsers} onUpdateUserData={handleUpdateUserData} />
                      </div> */}
               
                      <div className='flex flex-col mt-2 gap-x-8'>
                        <h2 className='text-black font-extrabold text-xl'>Enviados</h2>
                        <TableStockEnviado data={stock} onUpdateUserData={handleUpdateUserData} />
                      </div>

                        <div className='flex flex-col gap-x-8'>
                        <h2 className='text-black font-extrabold text-xl'>Entregados</h2>
                        <TableKitEscolar data={successUsers} onUpdateUserData={handleUpdateUserData} />
                      </div>
                      </>
                    }   
                    </div>
                  
              

             
                    
                  

                  

              
                </div>
              </div>

              
            </div>
          );


      
    };


export default KitEscolarAdmin;