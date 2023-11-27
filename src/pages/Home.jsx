import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../common/Axiosconfig';
import Input from '../components/Input';
import Avatar from '../assets/img/avatar.png';
import {FiDownload} from 'react-icons/fi'
import Modal from "react-modal";
import {FaIdCard} from 'react-icons/fa'
import {BsPostcardFill} from 'react-icons/bs'
import {RiBillLine} from 'react-icons/ri'
import { useRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useLocation, useParams } from 'react-router-dom';
import Files from '../components/Files';
import Loader from '../components/Loader';
import { TbJacket, TbTools } from 'react-icons/tb';
import { PiBackpackDuotone } from 'react-icons/pi';
import Mono from '../assets/img/mono.png';
import Avion from '../assets/img/plane.png';
import Manito from '../assets/img/manito.png';


const Home = () => {
  const [dni, setDni] = useState('');
  const [affiliateData, setAffiliateData] = useState(null);
  const [err, setErr] = useState(null);
  const [beneficio, setBeneficio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
   const [familiares, setFamiliares] = useState([]);
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [modalReciboIsOpen, setModalReciboIsOpen] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState([]);
  const [beneficiosOtorgados, setBeneficiosOtorgados] = useState([]);
  const [expandedFamiliars, setExpandedFamiliars] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [modalConyugueIsOpen, setModalConyugueIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");




  const location = useLocation();
  const { dniparams } = useParams();

 
    const [animationParent] = useAutoAnimate();
  
    const [formData, setFormData] = useState({
    id_afiliado: "",
    name: "",
    categoria: "",
    dni: "",
    tel: "1234",
    fecha_de_nacimiento: "",
    dni_img_familiar: null,
    libreta_img:null,
  });

  const navigate = useNavigate();

  useEffect(() => {
  if (dniparams) {
      // Llama a la función para manejar la búsqueda con el DNI de la URL
      console.log(dniparams)
      setDni(dniparams)
      
      handleAffiliateDataRequest(dniparams);
    }
  }, [dniparams]);

  
  // Función para manejar las peticiones a la API para los datos de afiliados
const handleAffiliateDataRequest = async (dniparams) => {
  

  if (!dni && !dniparams) {
    setErr('Por favor, ingresa un número de DNI antes de hacer la solicitud.');
    return;
  }


  try {
    const res = await api.get(`users/afiliados/${dni ? dni : dniparams}`);
    
    // Almacenar los datos recibidos de la API
    console.log("data que recibo",res.data)
    const datosAfiliado = res.data
     if (datosAfiliado) {
      // Validar campos antes de la navegación
      const camposVacios = Object.entries(datosAfiliado).some(
        ([clave, valor]) =>
          clave !== "familiares" && valor === null
      );

      if (camposVacios) {
        // Al menos un campo está vacío, realiza la navegación
       navigate("/registro-afiliado", { state: { datosAfiliado } });
        return; // Asegúrate de salir de la función para evitar acceder a datosAfiliado en el siguiente bloque de código
      }
    }
    const familiaresDisponibles = res.data.familiares;
     const familiaresConyugue = familiaresDisponibles.filter(
      (familiar) => familiar.categoria === 'Conyugue' 
    );

    if (familiaresConyugue.length !== 0) {
      await setFamiliares((prevBeneficiosOtorgados) => [
      ...prevBeneficiosOtorgados,
      ...familiaresConyugue,
    ]);

    // await beneficioPendiente(familiaresConyugue[0].id);
    
     } 

  const familiaresMadre = familiaresDisponibles.filter(
      (familiar) => familiar.categoria === 'Madre' 
    );
    console.log("MADRES",familiaresMadre)

    if (familiaresMadre.length !== 0) {
       await setFamiliares((prevBeneficiosOtorgados) => [
      ...prevBeneficiosOtorgados,
      ...familiaresMadre,
    ]);

    // await beneficioPendiente(familiaresMadre[0].id);
     } 


    

    setAffiliateData(res.data);
     await handleValidateBenefit();
    
      const familiaresHijos = familiaresDisponibles.filter(
        (familiar) => familiar.categoria === "Hijo/a"
      );

      if (familiaresHijos.length === 0) {
        console.log("No hay hijos")
      } else {
        comprobarBeneficios(familiaresHijos.map((familiar) => familiar.id));
      }
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      id_afiliado: res.data.idafiliados,
    }));
    setIsLoading(false);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setAffiliateData(null);
    console.log(error)
    
    navigate('/registro-afiliado')
  }
 setIsLoading(false);
};

  const handleDniImgChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const maxFiles = 1;
     if (filesArray.length > maxFiles) {
      alert(`Por favor, selecciona un máximo de ${maxFiles} archivos.`);
      e.target.value = null;
      return
    } 
    setFormData((prevFormData) => ({
      ...prevFormData,
      dni_img_familiar: filesArray,
    }));
    
  };

  useEffect(() => {
    if (formData.dni_img_familiar) {
      console.log(formData.dni_img_familiar);
    }
  }, [formData.dni_img_familiar]);

  const handleLibretaImgChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      libreta_img: filesArray,
    }));
    console.log(formData.libreta_img);
  };

  const handleChangeHijo = (e) => {
    const { name, value } = e.target;
    if (name === "dni" && !/^[0-9]*$/.test(value)) {
      setErr("Ingresa solo números en el campo DNI");
    } else {
    setErr(null)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      categoria: "Hijo/a",
    }));
  }
  };

  const handleChangeConyugue = (e) => {
    const { name, value } = e.target;
    if (name === "dni" && !/^[0-9]*$/.test(value)) {
      setErr("Ingresa solo números en el campo DNI");
    } else {
    setErr(null)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      categoria: "Conyugue",
    }));
  }
  };

  const validateFields = () => {
    setValidationErrors({}); // Limpiar cualquier error de validación previo
    const requiredFields = {
      formData: ["name", "dni", "tel", "fecha_de_nacimiento", "dni_img_familiar, libreta_img"],
    };

    const errors = {};

    Object.entries(requiredFields).forEach(([fieldGroup, fieldNames]) => {
      fieldNames.forEach((fieldName) => {
        if (formData[fieldName] === "" && fieldGroup === "formData") {
          errors[fieldName] = "*";
        }
      });
    });
    if(modalIsOpen){
    if (!formData.dni_img_familiar || formData.dni_img_familiar.length === 0) {
      errors.dni_img_familiar = "*";
    }
  } else
     if (!formData.libreta_img || formData.libreta_img.length === 0) {
      errors.libreta_img = "*";
    }
 
    return errors;

  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    const res = await api.post("users/registro-familiar", formData);
    if (res.status === 200) {
      handleImageUpload();
      setModalIsOpen(false);
      setModalConyugueIsOpen(false)
      setAffiliateData(
        (prevAffiliateData) => ({
          ...prevAffiliateData,
          familiares: [...prevAffiliateData.familiares, res.data],
        }),
      );
      setFormData({
      id_afiliado: "",
      name: "",
      categoria: "",
      dni: "",
      tel: "1234",
      fecha_de_nacimiento: "",
      dni_img_familiar: null,
      libreta_img:null,
    });
      setIsLoading(false);
      handleAffiliateDataRequest();
      
    }
  };


  const handleImageUpload = async () => {

    if(formData.categoria === "Hijo/a"){
    const imgFormaData = new FormData();
    imgFormaData.append("dni", formData.dni);
    formData.dni_img_familiar.forEach((dniImg) => {
      imgFormaData.append("dni_img_familiar", dniImg);
    });
    // await Promise.all(formData.dni_img.map(loadImage));
    const responseDni = await api.post(
      "/uploads/images-dni-familiar",
      imgFormaData
    );
    if(responseDni.status !== 200){
      setErr("Error al subir la imagen del DNI.")
    } else {
      handleAffiliateDataRequest();
    }
    } else {
      const imgFormaData = new FormData();
    imgFormaData.append("dni", formData.dni);
    formData.libreta_img.forEach((libretaImg) => {
      imgFormaData.append("libreta", libretaImg);
    });

    const responseLibreta = await api.post("/uploads/images-libreta",
      imgFormaData
    );
    if(responseLibreta.status !== 200){
      setErr("Error al subir la imagen de la libreta.")
    } else {
      handleAffiliateDataRequest();
    }
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

  const handleSeeBenefit = async () => {
    try {
    const res = await api.get(`tasks/beneficio/${dni}`);
    
    // Almacenar los datos del beneficio otorgado
    setBeneficio(res.data);
   
    console.log(beneficio)
     // Mostrar el popup
  } catch (error) {
    console.log(error.response.data.message);
  }
    
  }

  const handleDniChange = (e) => {
    const { name, value } = e.target;

    if (name === "dni" && !/^[0-9]*$/.test(value)) {
      setErr("Ingresa solo números en el campo DNI");
    } else {
      setErr("");
      setDni(value);
    }
  };

  const getDniImg = async () => {
   
    window.open(`https://backuatrebeneficios.galgoproductora.com/${affiliateData.dni_img_frente}`, '_blank');
 
    
  }
   const getDniImgDorso = async () => {
   
    window.open(`https://backuatrebeneficios.galgoproductora.com/${affiliateData.dni_img_dorso}`, '_blank');
 
    
  }

 const getLibretaImg = async () => {
  const conyugueIndex = affiliateData.familiares.findIndex(familiar => familiar.categoria === "Conyugue");

  if (conyugueIndex !== -1) {
    const libretaImgArray = affiliateData.familiares[conyugueIndex].libreta_img;
    console.log(libretaImgArray);

    if (libretaImgArray && Array.isArray(libretaImgArray)) {
      libretaImgArray.forEach((libreta) => {
        window.open(`https://backuatrebeneficios.galgoproductora.com/${libreta}`, '_blank');
      });
    } else {
      console.log("La propiedad libreta_img no es un arreglo o es null.");
    }
  } else {
    console.log("No se encontró un conyugue en la lista de familiares.");
  }
}

 const getDniImgHijo = async (familiarId, lado) => {
  // Busca el familiar por su ID
  const familiar = affiliateData.familiares.find((fam) => fam.id === familiarId);

  if (!familiar) {
    console.log("No se encontró el familiar con el ID proporcionado.");
    return;
  }

  const imagenDNI = lado === "frente" ? familiar.dni_img_frente : lado === "dorso" ? familiar.dni_img_dorso : null;

  if (imagenDNI) {
    window.open(`https://backuatrebeneficios.galgoproductora.com/${imagenDNI}`, '_blank');
  } else {
    console.log(`No se encontró una imagen del ${lado === "frente" ? "frente" : lado === "dorso" ? "dorso" : "DNI"}.`);
  }
};



  const handleGrantBenefit = async () => {
  try {
    const res = await api.get(`tasks/beneficio/${dni}`);
    // Almacenar los datos del beneficio otorgado
    setBeneficio(res.data);
    
     navigate(`/beneficios?dni=${dni}`);
  } catch (error) {
    console.log(error.response.data.message);
  }
  
};

useEffect(() => {
  console.log("Beneficios otorgados",beneficiosOtorgados)
  console.log("Familiares",familiares)
  }
, [beneficiosOtorgados, familiares]
);


// useEffect(() => {
//   const hijos = affiliateData?.familiares.filter((familiar) => familiar.categoria === 'Hijo/a');
//   if (hijos?.length >= 5) {
//     setShowButton(false);
//     console.log("Mostrar botón: false, límite de 5 hijos alcanzado");
//   } else {
//     setShowButton(true);
//     console.log("Mostrar botón: true");
//   }
// }, [affiliateData?.familiares]);



const toggleFamiliar = id => {
  
  setExpandedFamiliars(prevState => ({
    ...prevState,
    [id]: !prevState[id]
  }));
  
};

 const handleValidateBenefit = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`tasks/beneficio/${dni}`,);
     const lunademiel = res.data;

// Filtrar los elementos con categoría "Luna de Miel"
const lunademielFiltrado = lunademiel.filter((elemento) => elemento.tipo === 'Luna de miel');
      // Almacenar los datos recibidos de la API
      setBeneficiosOtorgados((prevBeneficiosOtorgados) => [
      ...prevBeneficiosOtorgados,
      ...lunademielFiltrado,
    ]);
    const kitnacimientoFiltrado = lunademiel.filter((elemento) => elemento.tipo === 'Kit maternal');
      // Almacenar los datos recibidos de la API
      setBeneficiosOtorgados((prevBeneficiosOtorgados) => [
      ...prevBeneficiosOtorgados,
      ...kitnacimientoFiltrado,
    ]);
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

//   const beneficioPendiente = async (familiarId) => {
//   try {
//      // Convertir a cadena separada por comas
//     const res = await api.get(`/tasks/verified-kit-maternal/${familiarId}`);
//     const kitmaternal = res.data;
//     res.status === 200 &&
//     setBeneficiosOtorgados((prevBeneficiosOtorgados) => [
//       ...prevBeneficiosOtorgados,
//       ...kitmaternal,
//     ]);
//     //  console.log("RES DE kit maternal",res.data)
//     if(beneficiosOtorgados.length === 0) {
//       return;
//     } else {
//     console.log("qsy")
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

const comprobarBeneficios = async (familiarIds) => {
    try {
      const queryParams = familiarIds.join(","); // Convertir a cadena separada por comas
      const res = await api.get(`/tasks/verified-kit-escolar/${queryParams}`);
      const kitescolar = res.data;
    setBeneficiosOtorgados((prevBeneficiosOtorgados) => [
      ...prevBeneficiosOtorgados,
      ...kitescolar,
    ]);
      // console.log("RES DE LA API",res.data)
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

   const isBeneficioOtorgado = (familiarId, tipoBeneficio) => {
    const numericFamiliarId = parseInt(familiarId, 10);
    const beneficiosDelFamiliar = beneficiosOtorgados.filter(
      (beneficio) => beneficio.familiar_id === numericFamiliarId
    );


      let valorGuardapolvo = ""; 
    switch (tipoBeneficio) {
      case "mochila":
        return beneficiosDelFamiliar.some((beneficio) => beneficio.mochila);
      case "guardapolvo":
        return beneficiosDelFamiliar.some(
          (beneficio) => beneficio.guardapolvo_confirm
        );

        case "guardapolvo_talle":
      // Verifica si el arreglo beneficiosDelFamiliar tiene al menos un elemento
      if (beneficiosDelFamiliar.length > 0) {
        // Obtiene el último elemento del arreglo y accede a su propiedad guardapolvo
        valorGuardapolvo = beneficiosDelFamiliar[beneficiosDelFamiliar.length - 1].guardapolvo;
        console.log('Valor de guardapolvo para familiar', valorGuardapolvo);
        return valorGuardapolvo;
      } else {
        // Manejo del caso cuando no se encuentra ningún beneficio para el familiar
        return "";
      }


      case "utiles":
        return beneficiosDelFamiliar.some((beneficio) => beneficio.utiles);
      default:
        return false; // Tipo de beneficio no reconocido
    }
  };


 const handleReciboSueldoChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const maxFiles = 2;
    if (filesArray.length > maxFiles) {
      alert(`Por favor, selecciona un máximo de ${maxFiles} archivos.`);
      e.target.value = null;
      return
    }
setSelectedFiles((prevFormData) => ({
    ...prevFormData,
    recibo_sueldo: filesArray,
  }));

    
  };

const handleRecibo = async () => {
  try {
      setIsLoading(true);
      const reciboSueldoFormData = new FormData();
      reciboSueldoFormData.append("dni", dni ? dni : dniparams);
      selectedFiles.recibo_sueldo.forEach((reciboSueldo) => {
        reciboSueldoFormData.append("recibo_sueldo", reciboSueldo);
      });
    const res = await api.put(`uploads/images-recibo`, reciboSueldoFormData);
    res.status === 200 && setSuccessMessage("Los datos se cargaron correctamente.");
    setSelectedFiles([]);
    setIsLoading(false);
    handleAffiliateDataRequest();
    } catch (error) {
      console.log(error);
    }
}


//  const handleUpdateBeneficio = async () => {


//   try {
//     setErr(null); // Limpiar cualquier error previo
//     setIsLoading(true);    
//     const res = await api.put(`/tasks/${beneficiosOtorgados[0].id}`, {estado: "Entregado"});
//     res.status === 200 &&
//     console.log(res.data);
//     setIsLoading(false);

    

//   } catch (err) {
//     console.log(err.response)
//     setErr(err.response.data.error? err.response.data.error : "Error al entregar el beneficio");

//   }
//   setIsLoading(false);
// };
   
  







  return (
    <div  className="h-full mt-20 py-2 md:pl-80 w-full ">
      <div className='flex flex-col p-2 md:p-0 justify-center'>        
        <h1 className="mt-4 text-2xl max-md:text-center md:text-3xl font-extrabold ">{affiliateData ? 'Perfil del Trabajador: Revisar Datos' : 'INGRESA EL NUMERO DE DNI DEL TRABAJADOR'}</h1>
        <p className='text-gray-500 font-semibold md:mt-4'>{affiliateData ? '' : 'Ingrese un número de DNI para comenzar.'}</p>
      </div>

 
      { affiliateData ? (
        // Mostrar los datos del afiliado
        <div  className="flex max-xl:items-center max-xl:flex-col max-xl:px-10 h-full">
          {/* ... Código para mostrar los datos del afiliado ... */}
           <div  className="flex flex-col h-full  rounded-2xl max-xl:p-0 xl:w-[25%] xl:mt-3 ">
         
        
         <img className='mb-[-8px] md:mb-[-10px]' src={Avatar}>
              </img>


            <div className=' p-5 bg-white rounded-b-2xl grid gap-4'>
               <p className='mt-2 capitalize text-gray-800 font-semibold'><strong>{affiliateData.name}</strong></p>
               <div className='grid grid-cols-2'>
  <div >   

    <p><strong>DNI</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.dni}</p>

    <p ><strong>CUIT</strong></p>
    <p className='text-gray-500 font-semibold'> {affiliateData.cuit}</p>

    <p><strong>Nacionalidad</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.nacionalidad}</p>

    <p><strong>Sexo</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.sexo}</p>

    <p><strong>Provincia</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.provincia}, {affiliateData.ciudad}</p>
  </div>

  <div>
    
    <p><strong>Estado Civil</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.estado_civil}</p>

    <p><strong>Fecha de Nacimiento</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.fecha_de_nacimiento}</p>

    <p><strong>Teléfono</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.tel}</p>

    <p><strong>Email</strong></p>
    <p className='text-gray-500 break-all font-semibold'>{affiliateData.correo}</p>

     <p><strong>Domicilio</strong></p>
    <p className='text-gray-500 font-semibold'>{affiliateData.domicilio}</p>

   
  </div>
  </div>
</div>

        <div className='flex h-20 gap-x-4'>       
          <div onClick={getDniImg}  className='flex flex-col cursor-pointer justify-center items-center w-[50%] rounded-2xl mt-2  bg-white'>
                
            <FaIdCard className='text-4xl text-[#23A1D8]'></FaIdCard>
            <p className='text-[#23A1D8] text-sm hover:underline font-semibold'>Ver Frente del DNI</p> 
           
            
          </div>
          <div onClick={getDniImgDorso}  className='flex flex-col cursor-pointer justify-center items-center w-[50%] rounded-2xl mt-2  bg-white'>
                
            <BsPostcardFill className='text-4xl text-[#23A1D8]'></BsPostcardFill>
            <p className='text-[#23A1D8] text-sm hover:underline font-semibold'>Ver Dorso del DNI</p> 
           
            
          </div>
         

   

              
        </div>
    </div>

      {/* Cuadro de datos de familiares */}
  <div className="flex w-full max-xl:flex-col md:ml-5 justify-between rounded-lg xl:w-[71%] p-5 mt-3 bg-white">

                <div className='h-full max-xl:flex flex-col max-xl:items-center max-xl:justify-center max-xl:w-full'>
                <h3 className='font-bold text-2xl mb-5'>Hijos:</h3>
                  {affiliateData.familiares && affiliateData.familiares.some(familiar => familiar.categoria === 'Hijo/a') ? (
  <div className='flex h-[90%] max-xl:w-full max-xl:h-full   flex-col xl:justify-between' >
  
    <div className="max-xl:w-full   max-xl:h-full "> 
    <ul >
      {affiliateData.familiares
        .filter(familiar => familiar.categoria === 'Hijo/a')
        .map((familiar, index) => (
          <div className='max-xl:w-full max-xl:flex max-xl:flex-col max-xl:justify-center max-xl:items-center ' onClick={() => toggleFamiliar(familiar.id)} key={index} ref={animationParent} >
            <p 
              className='p-2 bg-[#d8d8d8] items-center capitalize font-semibold text-gray-800 relative w-full xl:w-[16vw] mt-4 pl-6 cursor-pointer flex flex-row justify-between'
             
            >
               
              <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
              {familiar.name} <span className='text-[#006084] text-sm pr-1'>{expandedFamiliars[familiar.id] ? "Ver menos" : "Ver más"}</span>
            </p>
               {
                        <div
                          key={familiar.id}
                          className="flex w-5/6 md:w-[16vw] pt-1"
                        >
                          <TbTools  className="text-gray-400" />
                          <p
                            className={`px-1 text-xs font-semibold text-gray-400`}
                          >
                            Útiles:{" "}
                            <strong
                              className={`px-1 text-xs font-semibold ${
                                isBeneficioOtorgado(familiar.id, "utiles")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {isBeneficioOtorgado(familiar.id, "utiles")
                                ? "ENTREGADO"
                                : "SIN ENTREGAR"}
                            </strong>
                          </p>
                          <PiBackpackDuotone className="text-gray-400" />
                          <p
                            className={`px-1 text-xs font-semibold text-gray-400`}
                          >
                            Mochila:{" "}
                            <strong
                              className={`px-1 text-xs font-semibold ${
                                isBeneficioOtorgado(familiar.id, "mochila")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {isBeneficioOtorgado(familiar.id, "mochila")
                                ? "ENTREGADO"
                                : "SIN ENTREGAR"}
                            </strong>
                          </p>
                          <TbJacket className="text-gray-400" />
                          <p
                            className={`px-1 text-xs font-semibold text-gray-400`}
                          >
                            Guardapolvo:{" "}
                            <strong
                              className={`px-1 text-xs font-semibold ${
                                isBeneficioOtorgado(familiar.id, "guardapolvo")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {isBeneficioOtorgado(familiar.id, "guardapolvo")
                                ? "ENTREGADO"
                                : "SIN ENTREGAR"}
                            </strong>
                          </p>
                        </div>
                      }

            {expandedFamiliars[familiar.id] && (
              <li   key={index} className="w-5/6 xl:w-[16vw] p-2 ">
                <p><strong>DNI:</strong></p>
                <p className='p-2 bg-gray-200 relative pl-6'>
                  <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                  {familiar.dni}
                </p>
                <p><strong>Fecha de Nacimiento:</strong></p>
                <p className='p-2 bg-gray-200 relative pl-6'>
                  <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                  {familiar.fecha_de_nacimiento}
                </p>
                <div id={familiar.id} className='p-2 mt-2 flex items-center justify-between md:w-full md:pl-6'>               
                <button onClick={() => getDniImgHijo(familiar.id, "frente")} className='bg-[#23A1D8] font-bold text-white text-sm rounded-lg p-2 hover:bg-opacity-75' >
                  
                  VER FRENTE
                </button>
                 <button onClick={() => getDniImgHijo(familiar.id, "dorso")} className='bg-[#23A1D8] font-bold text-sm text-white rounded-lg p-2 hover:bg-opacity-75' >
                  
                  VER DORSO
                </button>
                </div> 
              
                
                {/* Agregar aquí otros campos de los familiares */}
              </li>
            )}
          </div>
        ))}
    </ul>
  </div>
  
 
  </div>
) : (
  <>
  <p className='text-gray-500'>No hay datos de familiares.</p>

  

  </>

)}


              </div>
              

              <div  className='max-xl:mt-3'>
              <h3 className='font-bold max-xl:text-center  text-2xl mb-5'>Datos del Conyugue:</h3>
                  {affiliateData.familiares && affiliateData.familiares.some(familiar => familiar.categoria === 'Conyugue') ? (
  <div className=' flex h-[90%] max-xl:w-full max-xl:h-full   flex-col xl:justify-between' >
    
    <ul >
      {affiliateData.familiares
        .filter(familiar => familiar.categoria === 'Conyugue')
        .map((familiar, index) => (
          <div className='max-xl:w-full max-xl:flex max-xl:flex-col max-xl:justify-center max-xl:items-center ' onClick={() => toggleFamiliar(familiar.id)} key={index} ref={animationParent} >
            <p
              className='p-2 items-center capitalize bg-[#d8d8d8] font-semibold text-gray-800 relative w-full xl:w-[16vw] mt-4 pl-6 cursor-pointer flex flex-row justify-between'
             
            >
               
              <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
              {familiar.name} <span  className='text-[#006084] text-sm  pr-1'>{expandedFamiliars[familiar.id] ? "Ver menos" : "Ver más"}</span>
            </p>

            {expandedFamiliars[familiar.id] && (
              <li key={index} className="w-5/6 xl:w-[16vw] p-4 mb-4">
                <p><strong>DNI:</strong></p>
                <p className='p-2 bg-gray-200 relative pl-6'>
                  <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                  {familiar.dni}
                </p>
                <p><strong>Fecha de Nacimiento:</strong></p>
                <p className='p-2 bg-gray-200 relative pl-6'>
                  <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                  {familiar.fecha_de_nacimiento}
                </p>
                <p><strong>Teléfono:</strong></p>
                <p className='p-2 bg-gray-200 relative pl-6'>
                  <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                  {familiar.tel}
                </p>
                
                {/* Agregar aquí otros campos de los familiares */}
              </li>
            )}
          
            <div onClick={getLibretaImg}>
            <button className='mt-4 bg-[#006084] font-bold text-sm text-white rounded-lg p-2 hover:bg-opacity-75'
            
            >Ver libreta de matrimonio</button>
            </div>
           
          </div>
        ))}
    </ul>

      {isLoading ? (
  <Loader />
) : (
  <div className="flex max-xl:mt-3 items-end justify-around">
    {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
 
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                  beneficio.fecha_otorgamiento.includes(new Date().getFullYear()) &&
                (beneficio.estado === 'Entregado') &&
                beneficio.tipo === 'Kit maternal'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Mono} alt="Mono" />
                <p className="font-semibold text-gray-400">Kit Nacimiento</p>
                <span className='font-semibold text-sm capitalize'>{familiar.name}</span>
                <span className='font-semibold text-sm text-green-500'>Entregado</span>
              </div>
            </div>
          ))}
      </>
    )}
     {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
 
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                  beneficio.fecha_otorgamiento.includes(new Date().getFullYear()) &&
                (beneficio.estado === 'Pendiente' || beneficio.estado === "Enviado") &&
                beneficio.tipo === 'Kit maternal'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Mono} alt="Mono" />
                <p className="font-semibold text-gray-400">Kit Nacimiento</p>
                <span className='font-semibold text-sm capitalize'>{familiar.name}</span>
                <span className='font-semibold text-sm text-yellow-500'>Pendiente</span>
              </div>
            </div>
          ))}
      </>
    )}

    {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
    
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                beneficio.estado === 'Entregado' &&
                beneficio.tipo === 'Luna de miel'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Avion} alt="Avion" />
                <p className="font-semibold text-gray-400">Luna de Miel</p>
                <span  className='font-semibold text-sm capitalize'>{familiar.name}</span>
                <span className='font-semibold text-sm text-green-500'>Entregado</span>
              </div>
            </div>
          ))}
      </>
    )}
    {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
    
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                beneficio.estado === 'Pendiente' &&
                beneficio.tipo === 'Luna de miel'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Avion} alt="Avion" />
                <p className="font-semibold text-gray-400">Luna de Miel</p>
                <span  className='font-semibold text-sm capitalize'>{familiar.name}</span>
                <span className='font-semibold text-sm text-yellow-500'>Pendiente</span>
              </div>
            </div>
          ))}
      </>
    )}
  </div>
)}
    
  </div>
) : (
  <div className="flex h-[90%] max-xl:w-full max-xl:h-full flex-col xl:justify-between">  
  <p className='text-gray-500'>No hay datos de familiares.</p>
      {isLoading ? (
  <Loader />
) : (
  <div className="flex max-xl:mt-3 items-end justify-around">
    {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
 
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                  beneficio.fecha_otorgamiento.includes(new Date().getFullYear()) &&
                (beneficio.estado === 'Entregado') &&
                beneficio.tipo === 'Kit maternal'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Mono} alt="Mono" />
                <p className="font-semibold text-gray-400">Kit Nacimiento</p>
                <span className='font-semibold text-sm capitalize'>Madre: {familiar.name}</span>                
                <span className='font-semibold text-sm text-green-500'>Entregado</span>
              </div>
            </div>
          ))}
      </>
    )}
     {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
 
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                  beneficio.fecha_otorgamiento.includes(new Date().getFullYear()) &&
                (beneficio.estado === 'Pendiente' || beneficio.estado === "Enviado") &&
                beneficio.tipo === 'Kit maternal'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Mono} alt="Mono" />
                <p className="font-semibold text-gray-400">Kit Nacimiento</p>
                <span className='font-semibold text-sm capitalize'>Madre: {familiar.name}</span>      
                <span className='font-semibold text-sm text-yellow-500'>Pendiente</span>
              </div>
            </div>
          ))}
      </>
    )}

    {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
    
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                beneficio.estado === 'Entregado' &&
                beneficio.tipo === 'Luna de miel'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Avion} alt="Avion" />
                <p className="font-semibold text-gray-400">Luna de Miel</p>
                <span  className='font-semibold text-sm capitalize'>{familiar.name}</span>
                <span className='font-semibold text-sm text-green-500'>Entregado</span>
              </div>
            </div>
          ))}
      </>
    )}
    {Object.keys(beneficiosOtorgados).length > 0 && (
      <>
    
        {familiares
          .filter((familiar) =>
            beneficiosOtorgados.some(
              (beneficio) =>
                beneficio.familiar_id === familiar.id &&
                beneficio.estado === 'Pendiente' &&
                beneficio.tipo === 'Luna de miel'
            )
          )
          .map((familiar) => (
            <div key={familiar.id} className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <img className="w-auto h-8" src={Avion} alt="Avion" />
                <p className="font-semibold text-gray-400">Luna de Miel</p>
                <span  className='font-semibold text-sm capitalize'>{familiar.name}</span>
                <span className='font-semibold text-sm text-yellow-500'>Pendiente</span>
              </div>
            </div>
          ))}
      </>
    )}
  </div>
)}
   {/* <button 
              className='mt-4 bg-[#0E6F4B] font-bold text-white rounded-lg p-2 hover:bg-opacity-75'
              onClick={() => 
              setModalConyugueIsOpen(true)}>
                + CARGAR CONYUGUE
              </button> */}
  </div>

)

}

              </div>

        <div className='flex'>
              {affiliateData.datos_empleador && (
                        <div className='flex max-xl:w-full max-xl:h-full max-xl:mt-3  flex-col ' >
                                <h2 className="font-bold text-2xl max-xl:text-center mb-5">Datos del Empleador:</h2>
                                {affiliateData.datos_empleador && (
                                  <div>
                                    {(() => {
                                      try {
                                        const empleador = JSON.parse(affiliateData.datos_empleador);
                                        return (
                                          <div >
                                            <p><strong>Razon Social:</strong></p>
                                            <p
                                               className='p-2 capitalize bg-gray-200 font-semibold text-gray-800 relative xl:w-[16vw] mt-2 pl-6'
                                            >                
                                              <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                                              {empleador.razon_social} 
                                              
                                            </p>
                                            <p><strong>CUIT:</strong></p>
                                              <p className='p-2 bg-gray-200 xl:w-[16vw] relative pl-6'>
                                                <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                                                {empleador.cuit_empleador}
                                              </p>
                                              <p><strong>Actividad:</strong></p>
                                              <p className='p-2 capitalize bg-gray-200 xl:w-[16vw] relative pl-6'>
                                                <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                                                {empleador.actividad}
                                              </p> 
                                                <p><strong>Teléfono:</strong></p>
                                              <p className='p-2 capitalize bg-gray-200 xl:w-[16vw] relative pl-6'>
                                                <span className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-[#006084]'></span>
                                                {empleador.tel_empleador}
                                              </p>                                             
                                          </div>
                                        );
                                      } catch (error) {
                                        console.error('Error al analizar los datos del empleador:', error);
                                        setErr(error)
                                        return <p>{err}</p>;
                                      }
                                    })()}
                                    
                                  </div>
                      )}

                
                                    {affiliateData.recibo_sueldo && affiliateData.recibo_sueldo.length > 0 && (
                          <div className='flex flex-col cursor-pointer justify-center w-full xl:w-[16vw] items-center rounded-2xl p-2 mt-5  bg-gray-200'>
                            <RiBillLine className='text-3xl'/>
                            {affiliateData.recibo_sueldo.map((recibo, index) => (
                              
                              <div className='flex-col flex justify-center items-center' key={index}>
                                
                                <a
                                  href={`https://backuatrebeneficios.galgoproductora.com/${recibo}`} // Utiliza la URL de tu API
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#23A1D8] hover:underline"
                                >
                                  Ver Recibo de Sueldo {index + 1}
                                </a>
                              </div>
                            ))}
                                                            <a onClick={() => setModalReciboIsOpen(true)} className='mt-2 font-bold text-green-500  text-xs rounded-lg p-2 hover:bg-opacity-75'>Actualizar Recibo de Sueldo</a>

                          
                          </div>
                        )}
             <div className='flex flex-col items-center w-full h-1/3'>
  <button
    className='mt-5 bg-[#0E6F4B] h-2/3 w-full relative overflow-hidden rounded-2xl p-3 hover:bg-opacity-75'
    onClick={handleGrantBenefit}
    >
    <span className="flex items-center text-white font-bold justify-center">
      ENTREGAR BENEFICIO
      <img className='w-10 ml-2' src={Manito} alt='Icono de Mano' />
    </span>
  </button>
</div>

                          </div>
                        )}
                        
                        
                        </div>
                        
               
                                
  </div>
                              
  

             

          
        </div>
      ) :  (
        // Mostrar campo de búsqueda si no hay datos de afiliado
        <div ref={animationParent} className="flex flex-col h-full p-8 mt-36 md:mt-48 justify-center items-center">
          <div ref={animationParent} className='flex flex-col w-full max-md:p-6 md:w-[40rem] h-[14rem] md:items-center justify-center md:align-middle rounded-lg bg-white'>
          <label className='flex font-bold w-full mt-[-15px] max-md:justify-center md:pl-24 pb-2' htmlFor='dni'>DNI</label>
          <Input
            type="text"
            name='dni'
            value={dni}
            onChange={handleDniChange}
            className="py-4 px-4 w-full md:w-[28rem] bg-[#d8d8d8]"
            placeholder="123456"
          />
          </div>
          <button
            onClick={handleAffiliateDataRequest}
             className='mt-4 bg-[#006084] w-40 font-bold text-white rounded-lg p-1 hover:bg-opacity-75'>
            Buscar Afiliado
          </button>
             
       
        </div>
        
      )}
      

        {/* <Modal            
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Editar Familiares"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "50%",
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
            <h2 className="text-2xl font-bold mb-4">Añadir Hijos</h2>
            {err && <p className="text-red-500">{err}</p>}
            <div className="mb-2">
              <label className="block font-bold mb-1">
                Nombre y Apellido{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.name}
                </strong>
              </label>
              <Input
                required
                name="name"
                className="w-full"
                type="text"
                value={formData.name}
                onChange={handleChangeHijo}
              />
            </div>

            <div className="mb-2">
              <label className="block font-bold mb-1">
                DNI{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.dni}
                </strong>
              </label>
              <Input
                required
                name="dni"
                className="w-full"
                type="text"
                value={formData.dni}
                onChange={handleChangeHijo}
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-1">
                Fecha de Nacimiento{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.fecha_de_nacimiento}
                </strong>
              </label>
              <Input
                required
                name="fecha_de_nacimiento"
                className="w-full"
                type="date"
                value={formData.fecha_de_nacimiento}
                onChange={handleChangeHijo}
              />
            </div>
            <div className="flex flex-col justify-center items-center mt-4 rounded-xl min-h-[6rem] w-[100%] bg-gray-200 p-2">
              <p className="font-bold">Subir foto de DNI:</p>
              <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
                Frente.
              </p>

              <label
                htmlFor="dni_img_familiar"
                className="cursor-pointer mt-auto mb-2"
              >
                <FiDownload className="text-5xl text-[#23A1D8]" />
              </label>

              <input
                type="file"
                name="dni_img_familiar"
                id="dni_img_familiar"
                multiple
                required
                style={{ display: "none" }}
                onChange={handleDniImgChange}
              />

              <p className="text-xs font-semibold text-gray-600 text-center">
                Click aquí para cargar o{" "}
                <strong className="text-[#006084]">elegir archivos.</strong>
                <strong className="text-red-500 text-xl">
                  {validationErrors.dni_img_familiar}
                </strong>
              </p>
               {formData.dni_img_familiar?.map((file, index) => (
                  <li  key={index}>{file.name}</li>
                ))}
              {validationErrors.dni_img_familiar && (
                <p className="text-red-500"></p>
              )}
            </div>
             <div className="flex flex-col justify-center items-center mt-4 rounded-xl min-h-[6rem] w-[100%] bg-gray-200 p-2">
              <p className="font-bold">Subir foto de DNI:</p>
              <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
                Dorso.
              </p>

              <label
                htmlFor="dni_img_familiar"
                className="cursor-pointer mt-auto mb-2"
              >
                <FiDownload className="text-5xl text-[#23A1D8]" />
              </label>

              <input
                type="file"
                name="dni_img_familiar"
                id="dni_img_familiar"
                multiple
                required
                style={{ display: "none" }}
                onChange={handleDniImgChange}
              />

              <p className="text-xs font-semibold text-gray-600 text-center">
                Click aquí para cargar o{" "}
                <strong className="text-[#006084]">elegir archivos.</strong>
                <strong className="text-red-500 text-xl">
                  {validationErrors.dni_img_familiar}
                </strong>
              </p>
               {formData.dni_img_familiar?.map((file, index) => (
                  <li  key={index}>{file.name}</li>
                ))}
              {validationErrors.dni_img_familiar && (
                <p className="text-red-500"></p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                onClick={() => setModalIsOpen(false)}
              >
                Cerrar
              </button>
              <button
                className="mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                onClick={handleRegister}
              >
                Confirmar
              </button>
            </div>
          </Modal>
 */}

          <Modal            
            isOpen={modalReciboIsOpen}
            onRequestClose={() => setModalReciboIsOpen(false)}
            contentLabel="Subir Recibo de Sueldo"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "50%",
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
            <h2 className="text-2xl font-bold mb-4">Añadir Recibo de Sueldo</h2>
            {err && <p className="text-red-500">{err}</p>}
           
             
            <div className="flex flex-col justify-center items-center mt-4 rounded-xl min-h-[6rem] w-[100%] bg-gray-200 p-2">
              <p className="font-bold">Subir Recibo:</p>
              <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
                PDF, JPEG, JPG, PNG.
              </p>

              <label
                htmlFor="recibo_sueldo"
                className="cursor-pointer mt-auto mb-2"
              >
                <FiDownload className="text-5xl text-[#23A1D8]" />
              </label>

              <input
                type="file"
                name="recibo_sueldo"
                id="recibo_sueldo"
                multiple
                required
                style={{ display: "none" }}
                onChange={handleReciboSueldoChange}
              />

              <p className="text-xs font-semibold text-gray-600 text-center">
                Click aquí para cargar o{" "}
                <strong className="text-[#006084]">elegir archivos.</strong>
                <strong className="text-red-500 text-xl">
                  {validationErrors.recibo_sueldo}
                </strong>
              </p>
               {selectedFiles.recibo_sueldo?.map((file, index) => (
                  <li  key={index}>{file.name}</li>
                ))}
              {validationErrors.dni_img_familiar && (
                <p className="text-red-500"></p>
              )}
              {successMessage && (
                <p className="text-green-500 font-semibold mt-2">{successMessage}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
              onClick={() => {
                setModalReciboIsOpen(false);
            
              }}

              >
                Cerrar
              </button>
              {isLoading ? <Loader/> :
              <button
                className="mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                onClick={handleRecibo}
                disabled={successMessage}
              >
                Confirmar
              </button>
              }
            </div>
          </Modal>

       
          <Modal
                    
            isOpen={modalConyugueIsOpen}
            onRequestClose={() => setModalConyugueIsOpen(false)}
            contentLabel="Editar Familiares"            
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "50%",
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
            <h2 className="text-2xl font-bold mb-4">Añadir Conyugue</h2>
            
            {err && <p  className="text-red-500">{err}</p>}
            <div className="mb-2">
              <label className="block font-bold mb-1">
                Nombre y Apellido{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.name}
                </strong>
              </label>
              <Input
                required
                name="name"
                className="w-full"
                type="text"
                value={formData.name}
                onChange={handleChangeConyugue}
              />
            </div>

            <div className="mb-2">
              <label className="block font-bold mb-1">
                DNI{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.dni}
                </strong>
              </label>
              <Input
                required
                name="dni"
                className="w-full"
                type="text"
                value={formData.dni}
                onChange={handleChangeConyugue}
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-1">
                Teléfono{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.tel}
                </strong>
              </label>
              <Input
                required
                name="tel"
                className="w-full"
                type="number"
                value={formData.tel}
                onChange={handleChangeConyugue}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">
                Fecha de Nacimiento{" "}
                <strong className="text-red-500 text-sm">
                  {validationErrors.fecha_de_nacimiento}
                </strong>
              </label>
              <Input
                required
                name="fecha_de_nacimiento"
                className="w-full"
                type="date"
                value={formData.fecha_de_nacimiento}
                onChange={handleChangeConyugue}
              />
            </div>


            <div className="flex flex-col justify-center items-center mt-4 rounded-xl min-h-[6rem] w-[100%] bg-gray-200 p-2">
              <p className="font-bold">Subir foto de Libreta:</p>
              <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
                Donde figuren los datos del afiliado y la conyugue.
              </p>

              <label
                htmlFor="libreta_img"
                className="cursor-pointer mt-auto mb-2"
              >
                <FiDownload className="text-5xl text-[#23A1D8]" />
              </label>

              <input
                type="file"
                name="libreta_img"
                id="libreta_img"
                multiple
                required
                style={{ display: "none" }}
                onChange={handleLibretaImgChange}
              />

              <p className="text-xs font-semibold text-gray-600 text-center">
                Click aquí para cargar o{" "}
                <strong className="text-[#006084]">elegir archivos.</strong>              
                <strong className="text-red-500 text-xl">
                  {validationErrors.libreta_img}
                </strong>
                
              </p>
               {formData.libreta_img?.map((file, index) => (
                  <li  key={index}>{file.name}</li>
                ))}             
              {validationErrors.libreta_img && (
                <p className="text-red-500"></p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                onClick={() => setModalConyugueIsOpen(false)}
              >
                Cerrar
              </button>
              <button
                className="mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                onClick={handleRegister}
              >
                Confirmar
              </button>
       
            </div>
          </Modal>
          {/* <Modal
            isOpen={modalBenefitsOpen}
            onRequestClose={() => setModalBenefitsOpen(false)}
            contentLabel="Entregar Beneficio"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "50%",
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
            <h2 className="text-2xl font-bold mb-4">Entregar beneficio pendiente.</h2>
            {err && <p className="text-red-500">{err}</p>}
            <div className="mb-2">
             {familiares.length > 0 &&
             familiares.map((familiar) => (
                      <div key={familiar.id} className="flex justify-center items-center">
                        <div className="flex flex-col w-[95%] ">
                          <label className="font-semibold mt-4 ">
                            Nombre y Apellido
                          </label>

                          <div
                            key={familiar.id}
                            className={`flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200  `}
                          >
                            <label
                              htmlFor={`familiar_${familiar.id}`}
                              className="capitalize font-semibold text-black p-3"
                            >
                              {familiar.name}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">DNI</label>

                          <div
                            key={familiar.id}
                            className="flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                          >
                            <label className="font-semibold text-black p-3 ">
                              {familiar.dni}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">
                            Fecha de Solicitud
                          </label>

                          <div
                            key={familiar.id}
                            className={
                              "flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                            }
                          >
                            <label className="font-semibold text-black p-3">
                                   {beneficiosOtorgados[0] && 
                                   <>                             
                                   { new Date(beneficiosOtorgados[0].fecha_otorgamiento).toLocaleDateString()}{" "}
                                    {new Date(beneficiosOtorgados[0].fecha_otorgamiento).toLocaleTimeString()
                                   }
                                   </>
                            
                             }
                            </label>
                          </div>

                         
                          <div className="flex flex-col mt-4 items-center">
                          <Files 
                          label="Subir foto de REMITO DE ENTREGA" 
                          onUpload={handleUpdateBeneficio}
                          instructions="Recuerde que debe estar firmada por el trabajador." 
                            />
                          <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => setModalBenefitsOpen(false)}
                          >
                            Cerrar
                          </button>
                          </div>


                          {err && (
                            <p className="text-red-500 mt-2">{err}</p>
                          )}
                        </div>
                      </div>
                    ))
                          }
            </div>
                          

       
          </Modal> */}
          
        <div ref={animationParent}>
      {err && <p className='text-red-500 font-bold'>{err}</p>}
        </div>  
     
      

    </div>
  );
};

export default Home;

           
            
//             <div className="text-white">
              
              
              
              



    
  



//               {/* Agregar aquí otros campos relevantes */}



//               {/* Botón para otorgar el beneficio */}
//               <button
//                 onClick={handleGrantBenefit}
//                 className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
//               >
//                 Otorgar Beneficio
//               </button>
//               <button
//                 onClick={handleSeeBenefit}
//                 className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
//               >
//                 Ver Beneficios Otorgados
//               </button>
//               {/* Mostrar aviso de beneficio otorgado */}
//                          {beneficio && (
//   <div className="grid place-items-center bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded shadow-lg">
//     <h2 className="text-center text-black text-xl font-bold mb-2">Beneficios otorgados</h2>
//     {beneficio === null ? (
//       <p className='text-black'>No existen beneficios otorgados</p>
//     ) : (
//       beneficio.map((item) => (
//         <div key={item.id} className="mb-4">
//           <p className='text-black'><strong>Descripción:</strong> {item.tipo}</p>
//           <p className='text-black'><strong>Fecha de otorgamiento:</strong> {formatFechaOtorgamiento(item.fecha_otorgamiento)}</p>
//           {/* Resto de detalles del beneficio para cada elemento */}
//         </div>
//       ))
//     )}
//     {/* Mostrar otros detalles del beneficio */}
//     <button
//       onClick={() => {setShowPopup(false), setPopUpseen(true),
//         console.log(showPopup);}}
//       className="py-2 px-4 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
//     >
//       Cerrar
//     </button>
//   </div>
// )}


//             </div>
//           </div>
//         )
//       )}
