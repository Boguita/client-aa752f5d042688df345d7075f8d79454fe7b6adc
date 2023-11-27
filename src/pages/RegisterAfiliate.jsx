import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import api from "../common/Axiosconfig";
import Input from "../components/Input";
import axios from "axios";
import Loader from "../components/Loader";
import {BsCheck2Circle} from 'react-icons/bs'
import { FiDownload } from 'react-icons/fi';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useLocation } from 'react-router-dom';

const RegisterAfiliate = () => {
  const [err, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
   const [provincias, setProvincias] = useState([]); // Estado para almacenar las provincias
  const [ciudades, setCiudades] = useState([]);
  const [paises, setPaises] = useState([]);
      const [animationParent] = useAutoAnimate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    funcion: '',
    name: '',
    dni: '',
    fecha_de_nacimiento: '',
    tel: '',
    nacionalidad: '',
    sexo: '',
    estado_civil: '',
    provincia: '',
    ciudad: '',
    cuit: '',
    domicilio: '',
    correo: '',
    datos_empleador: {
        razon_social: '',
        cuit_empleador: '',
        actividad: '',
        tel_empleador: ''
    },
    dni_img_frente: null,
    dni_img_dorso: null,
    recibo_sueldo: null,
    ddjj: null,
  });

    const location = useLocation();
  const datosAfiliado = location.state?.datosAfiliado || null;

  useEffect(() => {
    // Verificar si hay datosAfiliado y actualizar formData
    if (datosAfiliado) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: datosAfiliado.name || '',
        funcion: datosAfiliado.dni ? true : false,
        dni: datosAfiliado.dni || '',
        fecha_de_nacimiento: datosAfiliado.fecha_de_nacimiento || '',
        tel: datosAfiliado.tel || '',
        nacionalidad: datosAfiliado.nacionalidad || '',
        sexo: datosAfiliado.sexo || '',
        estado_civil: datosAfiliado.estado_civil || '',
        provincia: datosAfiliado.provincia || '',
        ciudad: datosAfiliado.ciudad || '',
        cuit: datosAfiliado.cuit || '',
        domicilio: datosAfiliado.domicilio || '',
        correo: datosAfiliado.correo || '',
        datos_empleador: {
          razon_social: datosAfiliado.datos_empleador?.razon_social || '',
          cuit_empleador: datosAfiliado.datos_empleador?.cuit_empleador || '',
          actividad: datosAfiliado.datos_empleador?.actividad || '',
        },
      }));
    }
  }, [datosAfiliado]);

  
  const navigate = useNavigate();


    const areAllFieldsComplete = () => {

      if(currentStep === 1){
    const requiredFields = ['name', 'dni', 'tel', 'nacionalidad', 'cuit', 'domicilio', 'correo', 'estado_civil', 'fecha_de_nacimiento', 'sexo'];
    return requiredFields.every(field => formData[field] !== '');
    } else if (currentStep === 2) {
      return formData.dni_img_frente !== null && formData.dni_img_dorso
      // formData.ddjj !== null;
    } else if (currentStep === 3) {
      const requiredFields = ['datos_empleador.razon_social', 'datos_empleador.cuit_empleador', 'datos_empleador.actividad'];
      return requiredFields.every(field => {
      const nestedFields = field.split('.');
      return formData[nestedFields[0]][nestedFields[1]] !== '';
    }) && formData.recibo_sueldo !== null;
  }
  };

 

  const handleNextStep = async () => {

    if (!areAllFieldsComplete()) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (currentStep === 1) {
      await comprobarAfiliado();
      return;
    }

  setError(null); // Limpiar cualquier error previo
  setCurrentStep(currentStep + 1);
};

const handleBackStep = () => {
  setError(null); // Limpiar cualquier error previo
  setCurrentStep(currentStep - 1);
};


const comprobarAfiliado = async () => {
  if(datosAfiliado) return setCurrentStep(currentStep + 1);
  const res = await api.get(`/users/comprobar-afiliado/${formData.dni}`);
  if (res.status === 200) {
    setError('Ya existe un afiliado con ese DNI');
  } else {
    setCurrentStep(currentStep + 1);
    setError(null);
  }
}

useEffect(() => {
  console.log(formData);
}, [formData]);



  const handleChange = async (e) => {
  const { name, value, type, files } = e.target;

  if (name === "dni" && !/^[0-9]*$/.test(value)) {
    return setError("Ingresa solo números en el campo DNI");
  }

  if (name === "cuit") {
    // Formatear el valor del CUIT según el patrón deseado
    const formattedCuit = formatCuit(value);
    setFormData({
      ...formData,
      [name]: formattedCuit,
    });
    return; // No ejecutar las siguientes validaciones para "cuit"
  }

  if (e.target.name === "provincia") {
    try {
      const res = await axios.get(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${e.target.value}&campos=id,nombre&max=1000`
      );
      setCiudades(res.data.localidades);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  if (type === 'file') {
    setFormData({ ...formData, [name]: files[0] });
  } else if (name === 'razon_social' || name === 'cuit_empleador' || name === 'actividad' || name === 'tel_empleador') {
    // Handle changes in empleador data
    setFormData({
      ...formData,
      datos_empleador: {
        ...formData.datos_empleador,
        [name]: value,
      },
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const formatCuit = (cuit) => {
    // Eliminar caracteres no numéricos
    const numericValue = cuit.replace(/[^\d]/g, "");

    // Formatear el valor según el patrón deseado
    if (numericValue.length > 2 && numericValue.length <= 10) {
      return `${numericValue.slice(0, 2)}-${numericValue.slice(2, 10)}`;
    } else if (numericValue.length > 10) {
      return `${numericValue.slice(0, 2)}-${numericValue.slice(2, 10)}-${numericValue.slice(10, 11)}`;
    } else {
      return numericValue;
    }
  };

  useEffect(() => {
    axios.get("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre").then((res) => {
      setProvincias(res.data.provincias);
       // Almacenar las provincias en el estado
    });
    axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
      const commonNames = res.data.map((country) => country.name.common);
      setPaises(commonNames);
       // Almacenar las provincias en el estado
    }
    );
  }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setIsLoading(true); 
   if (!areAllFieldsComplete()) {
      setError('Por favor complete todos los campos');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
     formDataToSend.append('funcion', formData.funcion);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('dni', formData.dni);
    formDataToSend.append('fecha_de_nacimiento', formData.fecha_de_nacimiento);
    formDataToSend.append('tel', formData.tel);
    formDataToSend.append('nacionalidad', formData.nacionalidad);
    formDataToSend.append('sexo', formData.sexo);
    formDataToSend.append('estado_civil', formData.estado_civil);
    formDataToSend.append('cuit', formData.cuit);
    formDataToSend.append('domicilio', formData.domicilio);
    formDataToSend.append('correo', formData.correo);
    formDataToSend.append('provincia', formData.provincia);
    formDataToSend.append('ciudad', formData.ciudad);

    

    const datosEmpleador = {
    razon_social: formData.datos_empleador.razon_social,
    cuit_empleador: formData.datos_empleador.cuit_empleador,
    actividad: formData.datos_empleador.actividad,
    tel_empleador: formData.datos_empleador.tel_empleador,
  };

  formDataToSend.append('datos_empleador', JSON.stringify(datosEmpleador));

    const response = await api.post('/users/afiliado-registro', formDataToSend)
  
     if (response.status === 200) {
      await handleImageUpload();
      setIsLoading(false);
    }
    setCurrentStep(currentStep + 1);
    // Aquí puedes mostrar un mensaje de éxito o redirigir a otra página
  } catch (error) {
    console.error(error.data);
    setIsLoading(false);
    setError(error.response.data.error);
    // Aquí puedes mostrar un mensaje de error o realizar acciones adicionales en caso de error
  }
  };




     const handleDniImgDorso = (e) => {
    const filesArray = Array.from(e.target.files);
    const maxFiles = 1;
     if (filesArray.length > maxFiles) {
      alert(`Por favor, selecciona un máximo de ${maxFiles} archivos.`);
      e.target.value = null;
      return
    } 
    setFormData((prevFormData) => ({
      ...prevFormData,
      dni_img_dorso: filesArray,
    }));
    
  };

   const handleDniImgFrente = (e) => {
    const filesArray = Array.from(e.target.files);
    const maxFiles = 1;
     if (filesArray.length > maxFiles) {
      alert(`Por favor, selecciona un máximo de ${maxFiles} archivos.`);
      e.target.value = null;
      return
    } 
    setFormData((prevFormData) => ({
      ...prevFormData,
      dni_img_frente: filesArray,
    }));
    
  };

  const handleReciboSueldoChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const maxFiles = 2;
    if (filesArray.length > maxFiles) {
      alert(`Por favor, selecciona un máximo de ${maxFiles} archivos.`);
      e.target.value = null;
      return
    }
setFormData((prevFormData) => ({
    ...prevFormData,
    recibo_sueldo: filesArray,
  }));

    
  };

//   const handleDdjjChange = (e) => {
//     const filesArray = Array.from(e.target.files);
//     const maxFiles = 2;
//     if (filesArray.length > maxFiles) {
//       alert(`Por favor, selecciona un máximo de ${maxFiles} archivos.`);
//       e.target.value = null;
//       return
//     }
// setFormData((prevFormData) => ({
//     ...prevFormData,
//     ddjj: filesArray,
//   }));
//   console.log(formData.ddjj);
    
//   };

// const loadImage = (imageFile) => {
//   return new Promise((resolve) => {
//     const imgElement = new Image();
//     imgElement.onload = resolve;
//     imgElement.src = URL.createObjectURL(imageFile);
//   });
// };

const handleImageUpload = async () => {
    try {

      // Upload DNI images
      const dniFormData = new FormData();
      dniFormData.append("dni", formData.dni);
      formData.dni_img_frente.forEach((dniImg) => {
      dniFormData.append("dni_img_frente", dniImg);
    });
     formData.dni_img_dorso.forEach((dniImg) => {
      dniFormData.append("dni_img_dorso", dniImg);
    });
      // await Promise.all(formData.dni_img.map(loadImage));
      const responseDni = await api.post("/uploads/images-dni", dniFormData);
   

      // Upload recibo de sueldo images
      const reciboSueldoFormData = new FormData();
      reciboSueldoFormData.append("dni", formData.dni);
      formData.recibo_sueldo.forEach((reciboSueldo) => {
        reciboSueldoFormData.append("recibo_sueldo", reciboSueldo);
      });
      // await Promise.all(formData.recibo_sueldo.map(loadImage));
      const responseRecibo = await api.post(
        "/uploads/images-recibo",
        reciboSueldoFormData
      );

        // Upload  ddjj images
      const ddjjFormData = new FormData();
      ddjjFormData.append("dni", formData.dni);
      formData.ddjj.forEach((ddjj) => {
        ddjjFormData.append("ddjj", ddjj);
      });
      // await Promise.all(formData.recibo_sueldo.map(loadImage));
      const responseDdjj = await api.post(
        "/uploads/images-ddjj",
        ddjjFormData
      );
    

      // Aquí puedes mostrar un mensaje de éxito o realizar acciones adicionales después de la carga de imágenes
    } catch (err) {
      console.error(err);
      // Aquí puedes mostrar un mensaje de error o realizar acciones adicionales en caso de error
    } // finally {
    //   // Revocar las URLs de los objetos Blob para liberar memoria
    //   formData.dni_img.forEach((dniImg) => URL.revokeObjectURL(dniImg.src));
    //   formData.recibo_sueldo.forEach((reciboSueldo) =>
    //     URL.revokeObjectURL(reciboSueldo.src)
    //   );
    // }
  };

   return (
    <div className="bg-gray-200 flex justify-center mt-36 h-screen w-screen sm:pl-80 sm:ml-5">
      
   <div className="flex flex-col pt-10 rounded-3xl items-center h-[110%] w-[95%] sm:w-2/3 sm:h-2/3 bg-white">
    <div ref={animationParent} className="flex flex-col justify-center items-center h-20">
        <h2 className="text-[#006084] text-2xl sm:text-4xl font-bold">Registro del Trabajador</h2>
        {!datosAfiliado && currentStep === 1 ?
        <p className="text-red-500 text-xs w-4/5 sm:w-full font-semibold mt-1">No existe afiliado registrado con ese DNI, para continuar carga los datos correspondientes.</p>
        :
        datosAfiliado && currentStep === 1 &&
        <p className="text-red-500 text-xs w-4/5 sm:w-full font-semibold mt-1">Por favor, complete los datos del trabajador antes de continuar.</p>
      }
      {currentStep === 3 && 
      <h4 className="text-[#006084] text-xl font-bold">Datos del Empleador</h4>
      }
        </div>
      
      <form
        className="xl:form-horizontal grid sm:grid-cols-2 gap-x-8 gap-y-2 sm:w-[45vw] p-4"
        onSubmit={handleSubmit}
      >
        
        {currentStep === 1 && (
          <>
        <div ref={animationParent} className="mb-4">
          
          <Input
            type="text"
            placeholder={"Nombre y Apellido"}
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-control  w-full py-2 px-3 focus:outline-none "
          />
        </div>
        <div className="mb-4">
          
          <Input
            type="text"
            name="dni"
            placeholder={"DNI"}
            pattern="[0-9]*"
            required
            value={formData.dni}
            onChange={handleChange}
            className="w-full py-2 px-3 focus:outline-none "
          />
        </div>

      
                 <div className="py-2 pr-2 mb-4 !border-l-4 !border-[#006084] bg-gray-200">
                  <select
                    id="estado_civil"
                    name="estado_civil"
                    required
                    value={formData.estado_civil}
                    onChange={handleChange}
                    className=" bg-gray-200 pl-3 text-base font-semibold focus:outline-none w-full "
                  >
                    <option value="" disabled selected>Estado Civil</option>
                    <option value="Soltero">Soltero</option>
                    <option value="Casado">Casado</option>
                    <option value="Otro">Otro</option>
                    
                  </select>
                </div>
<div className="relative mb-4">
  <Input
    type="date"
    name="fecha_de_nacimiento"
    required
    value={formData.fecha_de_nacimiento}
    onChange={handleChange}
    className="w-full focus:text-[#808080] py-2 px-3"
  />
  <label className="absolute left-0 bottom-full text-gray-600 text-xs mt-1 opacity-0">
    Fecha de nacimiento del trabajador
  </label>
  
  {/* Selector CSS para mostrar el texto emergente */}
  <style>
    {`.mb-4:hover label { opacity: 1; }`}
  </style>
</div>
       
        
        <div className="block pr-2 py-2 h-max !border-l-4 !border-[#006084] bg-gray-200">
          
          <select
            name="sexo"
            required
            value={formData.sexo}
            onChange={handleChange}
            className=" bg-gray-200 pl-3 text-base font-semibold focus:outline-none w-full "
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="mb-4">
          
          <Input
            type="text"
            name="cuit"
            placeholder="CUIT"
            required
            maxLength={13}
            value={formData.cuit}
            onChange={handleChange}
            className=" bg-gray-200 pl-3 text-base font-semibold focus:outline-none w-full "
          />
        </div>
        
        <span className="mb-4 border border-gray-200 w-full"></span>
        <span className="mb-4 border border-gray-200 w-full"></span>
        

        <div className="block pr-2 py-2 h-max !border-l-4 !border-[#006084] bg-gray-200">
                  <select
                    id="nacionalidad"
                    name="nacionalidad"
                    required
                    value={formData.nacionalidad}
                    onChange={handleChange}
                    className=" bg-gray-200 w-full pl-2 font-semibold focus:text-[#808080] focus:outline-none"
                  >
                    <option value="" disabled selected><strong className="!text-black">Nacionalidad</strong></option>
               {paises.sort().map((pais, index) => (
                <option key={index} value={pais}>
                  {pais}
                </option>
              ))}
                  </select>
                </div>

              <div className="block mb-4 pr-2 py-2 h-max !border-l-4 !border-[#006084] bg-gray-200">
                  <select
                    id="provincia"
                    name="provincia"
                    required
                    value={formData.provincia}
                    onChange={handleChange}
                    className=" bg-gray-200 w-full pl-2 font-semibold focus:text-[#808080] focus:outline-none"
                  >
                    <option value="" disabled selected>Provincia de Residencia</option>
                   {provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((provincia) => (
  <option key={provincia.id} value={provincia.nombre}>
    {provincia.nombre}
  </option>
))}
                  </select>
                </div>

              <div className="block mb-4 pr-2 py-2 h-max !border-l-4 !border-[#006084] bg-gray-200">
                    <select
                      id="ciudad"
                      name="ciudad"
                      required
                      value={formData.ciudad}
                      onChange={handleChange}
                    className=" bg-gray-200 w-full pl-2 font-semibold focus:text-[#808080] focus:outline-none"
                    >
                      <option value="" disabled selected>
                        Ciudad
                      </option>
                      {ciudades.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((ciudad) => (
                        <option key={ciudad.id} value={ciudad.nombre}>
                          {ciudad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                <div className="mb-4">
          
                  <Input
                    type="text"
                    name="domicilio"
                    placeholder={"Calle"}
                    required
                    value={formData.domicilio}
                    onChange={handleChange}
                    className="w-full  py-2 px-4 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
          
          <Input
            type="email"
            name="correo"
            placeholder={"Correo Electrónico"}
            required
            value={formData.correo}
            onChange={handleChange}
            className="w-full border-gray-300 py-2 px-3 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          
          <Input
            type="number"
            name="tel"
            placeholder={"Teléfono"}
            required
            value={formData.tel}
            onChange={handleChange}
            className="w-full border-gray-300 py-2 px-3 focus:outline-none"
          />
        </div>

         <div   className="flex justify-between pt-10">
            <button
               type="button"
                className="bg-[#23A1D8] hover:bg-[#006084] text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate("/home")}
              >
                Volver
              </button>
             
          {err && <p className="text-red-500">{err}</p>}
              
             
            </div>

             <div className="flex justify-end sm:pt-10">
           
          
              <button
               type="button"
                className="bg-[#23A1D8] hover:bg-[#006084] text-white font-bold py-2 px-4 rounded"
                onClick={handleNextStep}
              >
                Siguiente
              </button>
             
            </div>
        </>
      )}


      {currentStep === 2 && (
        <>
       <div ref={animationParent} className="flex flex-col justify-center items-center bg-gray-200 rounded-xl min-h-[10rem] w-[90%] p-2">
  <p className="font-bold">Adjuntar DNI Frente:</p>
  <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
    La imagen debe tener buena iluminación y apreciarse los datos completos.
  </p>

  <label htmlFor="dni_img_frente" className="cursor-pointer mt-auto mb-2">
    <FiDownload className='text-5xl text-[#23A1D8]' />
  </label>

  <input
    type="file"
    name="dni_img_frente"
    id="dni_img_frente"
    required
    style={{ display: 'none' }}
    onChange={handleDniImgFrente}
  />

  <p className="text-xs font-semibold text-gray-600 text-center">
    Suelte el archivo aquí para cargar o <strong className="text-[#006084]">elegir archivos.</strong>
  </p>
   {formData.dni_img_frente &&
    formData.dni_img_frente.map((file, index) => (
      file.name && <li className="text-sm" key={index}>{file.name}</li>
    ))}
</div>

 <div className="flex flex-col justify-center items-center bg-gray-200 rounded-xl min-h-[10rem] w-[90%] p-2">
  <p className="font-bold">Adjuntar DNI Dorso:</p>
  <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
    La imagen debe tener buena iluminación y apreciarse los datos completos.
  </p>

  <label htmlFor="dni_img_dorso" className="cursor-pointer mt-auto mb-2">
    <FiDownload className='text-5xl text-[#23A1D8]' />
  </label>

  <input
    type="file"
    name="dni_img_dorso"
    id="dni_img_dorso"
    required
    style={{ display: 'none' }}
    onChange={handleDniImgDorso}
  />

  <p className="text-xs font-semibold text-gray-600 text-center">
    Suelte el archivo aquí para cargar o <strong className="text-[#006084]">elegir archivos.</strong>
  </p>
   {formData.dni_img_dorso &&
    formData.dni_img_dorso.map((file, index) => (
      file.name && <li className="text-sm" key={index}>{file.name}</li>
    ))}
</div>

{/* 
      <div className="flex flex-col justify-center items-center bg-gray-200 rounded-xl min-h-[10rem] w-[90%] p-2">
  <p className="font-bold">Adjuntar Declaración Jurada:</p>
  <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
    Debe estar firmada por el trabajador.
  </p>

  <label htmlFor="ddjj" className="cursor-pointer mt-auto mb-2">
    <FiDownload className='text-5xl text-[#23A1D8]' />
  </label>

  <input
    type="file"
    name="ddjj"
    id="ddjj"
    multiple
    required
    style={{ display: 'none' }}
    onChange={handleDdjjChange}
  />

  <p className="text-xs font-semibold text-gray-600 text-center">
    Suelte el archivo aquí para cargar o <strong className="text-[#006084]">elegir archivos.</strong>
  </p>
   {formData.ddjj &&
    formData.ddjj.map((file, index) => (
      file.name && <li className="text-sm" key={index}>{file.name}</li>
    ))}
</div>   */}
    
      
         <div className="flex justify-between pt-10">
              <button
               type="button"
                className="bg-[#23A1D8] hover:bg-[#006084] text-white font-bold py-2 px-4 rounded"
                onClick={handleBackStep}
              >
                Volver
              </button>
             
          {err && <p className="text-red-500">{err}</p>}
              
             
            </div>

             <div className="flex justify-end pt-10">
             
          
              <button
               type="button"
                className="bg-[#23A1D8] hover:bg-[#006084] text-white font-bold py-2 px-4 rounded"
                onClick={handleNextStep}
              >
                Siguiente
              </button>
             
            </div>
       
        </>
      )}
      
  
  {currentStep === 3 && (
<>
  
  <div className="mb-4">
    
    <Input
      type="text"
      name="razon_social"
      placeholder={"Razón Social"}
      required
      value={formData.datos_empleador.razon_social}
      onChange={handleChange}
      className="w-full py-2 px-3 focus:outline-none"
    />
  </div>

   <div className="mb-4">
          
          <Input
            type="text"
            name="tel_empleador"
            placeholder={"Teléfono Empleador"}
            required
            value={formData.datos_empleador.tel_empleador}
            onChange={handleChange}
            className="w-full  py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        
  <div className="mb-4">
    
    <Input
      type="text"
      name="cuit_empleador"
      placeholder={"CUIT"}
      required
      value={formData.datos_empleador.cuit}
      onChange={handleChange}
      className="w-full  py-2 px-3 focus:outline-none "
    />
  </div>

  <div className="mb-4">    
    <Input
      type="text"
      name="actividad"
      placeholder={"Actividad"}
      required
      value={formData.datos_empleador.actividad}
      onChange={handleChange}
      className="w-full  py-2 px-3 focus:outline-none "
    />
  </div>
  

    <div className="flex flex-col justify-center items-center bg-gray-200 rounded-xl min-h-[10rem] w-[90%] p-2">
  <p className="font-bold">Adjuntar Recibo de Sueldo:</p>
  <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
    Revisar que coincida con los datos del trabajador.
  </p>

  <label htmlFor="recibo_sueldo" className="cursor-pointer mt-auto mb-2">
    <FiDownload className='text-5xl text-[#23A1D8]' />
  </label>

  <input
    type="file"
    name="recibo_sueldo"
    id="recibo_sueldo"
    multiple
    required
    style={{ display: 'none' }}
    onChange={handleReciboSueldoChange}
  />

  <p className="text-xs font-semibold text-gray-600 text-center">
    Suelte el archivo aquí para cargar o <strong className="text-[#006084]">elegir archivos.</strong>
  </p>
  {formData.recibo_sueldo &&
    formData.recibo_sueldo.map((file, index) => (
      file.name && <li className="text-sm" key={index}>{file.name}</li>
    ))}
</div>  

    
   {isLoading ? (
  <Loader /> // Muestra el componente de carga si isLoading es true
) : (
  <div className="flex flex-col items-end justify-end">
  <button
    className="bg-[#23A1D8] hover:bg-[#006084] text-white font-bold py-2 px-4 rounded"
    onClick={handleSubmit}
  >
    Confirmar Registro
  </button>
  </div>
)}
        {err && <p className="text-red-500">{err}</p>}
</>
  )}
  
  
      </form>
      {currentStep === 4 && (
    <>

    <div className="flex flex-col h-full w-full justify-end items-center space-y-4">
                  <BsCheck2Circle className="text-[8rem] text-[#006084]"/>
                  <p className="font-extrabold text-3xl text-[#006084]">El afiliado ha sido registrado.</p>
                  <p className="font-bold text-xl text-gray-500">Por favor, verifique si se cargaron los datos correctamente.</p>

                  </div>
                  <div className="h-full w-full items-end pb-10 justify-center flex">
              <button className="btn w-1/3" onClick={() => navigate(`/home/${formData.dni}`)}><span>SIGUIENTE</span></button>
                {err && <p>{err}</p>}
                </div>
        
        </>
        )}
      
      </div>
      
    </div>
  );
};





export default RegisterAfiliate;



  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div className="flex w-screen h-screen justify-center align-middle items-center bg-white">
  //        <div>
  //        <label htmlFor="dni">DNI:</label>
  //       <input type="text" name="dni" value={dni} onChange={handleInputChange} />
  //     </div>
  //       <div>
  //       <label>Credencial de Identidad:</label>
  //       <input type="file" multiple onChange={handleCredencialImageChange} />
  //     </div>
  //     <div>
  //       <label>Recibo de Haberes:</label>
  //       <input type="file" multiple onChange={handleReciboHaberesImageChange} />
  //     </div>
  //     <button type="submit">Guardar Imágenes</button>
  //     </div>
  //   </form>
  // );