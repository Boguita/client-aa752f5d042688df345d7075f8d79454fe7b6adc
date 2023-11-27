import { useState } from "react";
import { AuthContext } from "../context/authContext"
import { useContext, useEffect } from "react"
import api from "../common/Axiosconfig"
import Loader from "../components/Loader";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import TableSeccionales from "../components/TableSeccionales";
import axios
 from "axios";
import Input from "../components/Input";
import Modal from 'react-modal';
import { IoCloseOutline } from "react-icons/io5";

const Seccionales = () => {
  const [success, setSuccess] = useState(null);
  const { currentUser} = useContext(AuthContext);
  const [error, setError] = useState(null);
    const [dni, setDni] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [ciudades,setCiudades] = useState([]);
  const [seccionales, setSeccionales] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationParent] = useAutoAnimate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [inputs, setInputs] = useState({  
    nombre: "",
    delegacion: "",
    provincia: "",
    direccion: ""
  });



  

    const handleChange = async (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(inputs)

    if (e.target.name === "provincia") {
    try {
      const res = await axios.get(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${e.target.value}&campos=id,nombre&max=100`
      );
      setCiudades(res.data.localidades);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }
  };

 
   useEffect(() => {
    axios.get("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre").then((res) => {
      setProvincias(res.data.provincias);
       // Almacenar las provincias en el estado
    });
    
  }, []);

  const handleAffiliateDataRequest = async () => {  
  
  try {
    setIsLoading(true);
    const res = await api.get(`/tasks/seccionales`);
    // Almacenar los datos recibidos de la API
    const seccionales = res.data;
    
    setSeccionales(seccionales);
    setError(null);
    setIsLoading(false);
     // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    
    setSeccionales(null);
    console.log(error.response.data.message)
    setError(error.response.data.message);
    setIsLoading(false);
  }
   setIsLoading(false);
};

useEffect(() => {
  handleAffiliateDataRequest();
}, []); // Ejec


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!inputs.nombre || !inputs.provincia || !inputs.delegacion || !inputs.direccion) {    
    setError("Por favor complete todos los campos"),
    setSuccess(null);
    return;
  }

  try {
    setIsLoading(true);
    const res = await api.post("tasks/seccional", inputs);
    if (res.status === 200 || res.status === 204) {
      setSuccess("La seccional ha sido creada con éxito");
      handleAffiliateDataRequest();
      setInputs({
         provincia: "",
         delegacion: "",
         nombre: "",
         direccion: "",
     
        })
      setError(null);
      setIsLoading(false);
    } else {
      setError("Ha ocurrido un error, por favor intente nuevamente");
      setSuccess(null);
        setIsLoading(false);
    }
   
  } catch (error) {
    setError("Ha ocurrido un error, por favor intente nuevamente");
    setSuccess(null);
      setIsLoading(false);
    console.error(error);
  }
};

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const handleSearch = () => {
  const keywordWithoutAccents = removeAccents(searchKeyword.trim().toLowerCase());

  if (keywordWithoutAccents === '') {
    // Si la palabra clave de búsqueda está vacía, mostrar todos los afiliados.
    setSearchResults(seccionales);
  } else {
    // Filtrar los afiliados que coincidan con la palabra clave en nombre o provincia (sin tildes).
    const filteredResults = seccionales.filter((seccional) =>
      removeAccents(seccional.nombre.toLowerCase()).includes(keywordWithoutAccents) ||
      removeAccents(seccional.provincia.toLowerCase()).includes(keywordWithoutAccents)
    );

    setSearchResults(filteredResults);
  }
};

useEffect(() => {

    handleSearch(); 
}, [searchKeyword, seccionales]);

const handleUpdateUserData = async () => {
  try {
    // Llamar a la función que obtiene los datos actualizados
    await handleAffiliateDataRequest();
    // Aquí puedes realizar otras acciones después de actualizar los datos, si es necesario.
  } catch (error) {
    setError("Ha occurrido un error, por favor intente nuevamente")
    // Manejar errores si es necesario
  }
};




  return (
    <div className="md:ml-64 max-md:py-96 max-sm:py-96 w-screen h-screen flex flex-col justify-center items-center">
                 
      
   {isLoading ? <Loader/> :
                            <>
                                  <div className="w-[60%] mt-[32rem] " ref={animationParent}>
                                <h2 className='text-black font-extrabold text-xl'>Seccionales</h2>
                                <div className='flex flex-col'>            
         
                      <p className='text-gray-500 font-semibold mt-2'>Ingresa una palabra clave para buscar<br/>una seccional.</p>
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
                        <div className="flex items-center mt-1">
                                    <select
                                    
                    id="provincia"
                    name="provincia"
                    required
                    value={inputs.provincias}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                           className="bg-white focus:outline-none pl-5 py-1 rounded-lg "
                  >
                    <option value="" disabled selected>Provincia</option>
                  {provincias
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((provincia) => (
                        <option key={provincia.id} value={provincia.nombre}>
                          {provincia.nombre}
                        </option>
                      ))}

                  </select>
                     
                        
                        </div>
                         <div className="flex items-center mt-1">
                         <button 
                         className="p-1 w-32 font-bold text-white rounded-lg bg-[#006084] hover:bg-opacity-60"

                          onClick={() => {
                            setSuccess(null)
                            setError(null)
                            setOpenModal(true)
                            
                          }}
                        >
                          <span>Crear Seccional</span>
                        </button>

                        </div>
                     
                     </div>
                 
                    </div> 
                                <TableSeccionales data={searchResults} onUpdateUserData={handleUpdateUserData}  />
                              </div>


        <Modal isOpen={openModal}
            onRequestClose={() => setOpenModal(false)}
            contentLabel="Añadir Seccional"
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
    <div className="max-w-xl max-xl:max-w-xl max-lg:max-w-lg p-3 rounded-2xl w-full">
      <div onClick={() => setOpenModal(false)} className="flex items-end justify-end">
      <IoCloseOutline className="cursor-pointer text-2xl"  />
      </div>
        <h1 className="text-2xl font-semibold mb-4">Crear Nueva Seccional</h1>
        <form onSubmit={handleSubmit}>     
          <div className="mb-3">          
            <Input
              className="form-control capitalize py-3 w-full"
              id="nombre"
              type="text"
              required
              name="nombre"
              value={inputs.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de Seccional"
            />
          </div>
           <div className="mb-3">          
            <Input
              className="form-control capitalize py-3 w-full"
              id="delegacion"
              type="text"
              required
              name="delegacion"
              value={inputs.delegacion}
              onChange={handleInputChange}
              placeholder="Delegación"
            />
          </div>
            <div className="mb-3">          
            <Input
              className="form-control capitalize py-3 w-full"
              id="direccion"
              type="text"
              required
              name="direccion"
              value={inputs.direccion}
              onChange={handleInputChange}
              placeholder="Calle y Numeración"
            />
          </div>
       

        <div className="py-3 mb-3 !border-l-4 !border-[#006084] bg-gray-200">
                  <select
                    id="provincia"
                    name="provincia"
                    required
                    value={inputs.provincias}
                    onChange={handleChange}
                    className=" bg-gray-200 pl-3 text-sm font-semibold focus:text-[#808080] focus:outline-none w-full"
                  >
                    <option value="" disabled selected>Provincia</option>
                  {provincias
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((provincia) => (
                        <option key={provincia.id} value={provincia.nombre}>
                          {provincia.nombre}
                        </option>
                      ))}

                  </select>
                </div>
                
                {/* <div className="py-3 mb-3 !border-l-4 !border-[#006084] bg-gray-200">
                    <select
                      id="ciudad"
                      name="ciudad"
                      value={inputs.ciudad}
                      onChange={handleChange}
                      className=" bg-gray-200 pl-3 text-sm font-semibold focus:text-[#808080] focus:outline-none w-full"
                    >
                      <option value="" disabled selected>
                        Ciudad
                      </option>
                      {ciudades
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((ciudad) => (
                        <option key={ciudad.id} value={ciudad.nombre}>
                          {ciudad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>    */}
                  {isLoading ? <Loader/> :
          <div className="flex flex-col items-center justify-center">
        {success && <p className="text-green-500  font-semibold">{success}</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

          <button
                className="p-1 w-32 font-bold text-white rounded-lg bg-[#006084]"
            type="submit"
          >
            Confirmar
          </button>
          
          </div>
                  }
                 
        </form>

              
      </div>

                              </Modal>
                              </>
                }
    </div>
  );
};

export default Seccionales;