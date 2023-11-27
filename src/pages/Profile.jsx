import { useContext, useEffect, useState } from "react"
import api from "../common/Axiosconfig"
import Avatar from "../assets/img/avatar.png"
import { AuthContext } from "../context/authContext"
import { FiDownload } from "react-icons/fi"
import Input from "../components/Input"




export const Profile = () => {
    const [avatar, setAvatar] = useState("")
    const { currentUser, logout } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userComprobation, setUserComprobation] = useState(null);
     const [userData, setUserData] = useState({
    id: currentUser?.id,
    email: currentUser?.email,
    cuit: currentUser?.cuit,
    dni: currentUser?.dni,
    sexo: currentUser?.sexo,
    provincia: currentUser?.provincia,
    ciudad: currentUser?.ciudad,
    domicilio: currentUser?.domicilio,
    tel: currentUser?.tel, 
    password: "",
    repeat_password: "",   
  });

  
  const handleChangue = (e) => {
    if (isEditing) {
      const { name, value } = e.target;
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value,
      }));
    }
  };

const handleSave = () => {
  if(userData === userComprobation) { 
    return setError("No se realizaron cambios."), setIsEditing(false) 
  }
   const fieldsToCheck = Object.entries(userData).filter(
    ([key]) => key !== "password" && key !== "repeat_password"
  );

  // Verificamos si los campos no vacíos son válidos
  const allFieldsFilled = fieldsToCheck.every(([key, value]) => {
    return value !== "" && value !== null;
  });


    const userDataToSend = { ...userData };

 userData.password === "" ?? delete userDataToSend.password 
 userData.repeat_password === "" ?? delete userDataToSend.repeat_password
 
  if (userData.password !== userData.repeat_password) {
    setError("Las contraseñas no coinciden");
    return; // Detenemos el flujo
  }
  
  if (allFieldsFilled) {
    api
      .post(`/users/users/update/${currentUser.id}`, userDataToSend)
      .then((res) => {
        if (res.status === 200) {
          // Desactiva el modo edición
          setIsEditing(false);
          setError(null);
          
          setTimeout(() => {
            logout();
          }, 2000);
          alert("Los cambios se guardaron correctamente, vuelve a iniciar sesión.");
          
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    // Mostrar algún tipo de mensaje o alerta de que todos los campos deben estar completos.
    setError("Todos los campos deben estar completos");
  }
};

const handleEdit = () => {
  setIsEditing(true);
  setUserComprobation(userData); 
};


   useEffect(() => {
    console.log(isEditing)
  }, [isEditing])
   


  return (
    <div className="flex sm:pl-80 pt-40 w-screen h-screen  ">
      
      <div className="flex flex-col">
        <div className="flex justify-between pr-20">
        <h2 className="sm:pl-20 max-sm:pl-6 text-3xl font-bold text-gray-800">Mi Perfil</h2>
        {isEditing ? (
            <div className="flex sm:mt-4 space-x-3 md:mt-6">
              <button
                className="p-1 sm:w-36 font-bold text-white rounded-lg bg-[#0E6F4B]"
                onClick={handleSave}
              >
                Guardar
              </button>
               <button
                className="p-1 sm:w-36 font-bold text-white rounded-lg bg-red-500"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex sm:mt-4 space-x-3 md:mt-6">
              <button
                className="p-1 w-36 font-bold text-white rounded-lg bg-[#006084]"
                onClick={handleEdit}
              >
                Editar
              </button>
            </div>
          )}
        </div>

       <div className="flex max-sm:p-3 max-sm:flex-col justify-evenly">
          
          
            <div className="flex flex-col mt-4 rounded-2xl sm:w-[25%]">
         
        
         <img className='mb-[-5px]' src={Avatar}>
              </img>


            <div className='flex flex-col p-5 bg-white rounded-b-2xl'> 
            <p className='mt-2 text-gray-800 text-2xl uppercase font-semibold'><strong>{currentUser?.username}</strong> </p>
               <p className='mt-2 font-medium text-gray-800'>Delegado: #{currentUser?.id}</p>
            <p className='mt-2 font-medium text-gray-800'>{currentUser?.provincia}, {currentUser?.ciudad}</p> 
      </div>

        <div className='flex sm:h-28'>
               
          {/* <div onClick={""}  className='flex flex-col cursor-pointer justify-center items-center w-full rounded-2xl mt-5 h-[80%] bg-white'>
                
            <FiDownload className='text-5xl text-[#23A1D8]'></FiDownload>
            <p className='text-[#727272] hover:underline font-semibold'>Ver foto del DNI</p> 
           
            
          </div> */}
          
        </div>
    </div>

   <div className="flex-col bg-white p-8 rounded-2xl  sm:w-3/5 h-max mt-4 grid sm:grid-cols-2">
    <div className="flex flex-col w-full space-y-2 p-8 max-sm:border-b-2 sm:border-r-2">
    
    <label className="font-semibold">CUIT:</label>
    <Input 
    disabled
    className={"w-full text-opacity-70"}
    value={currentUser?.cuit}
    />
    <label className="font-semibold">Email:</label>
    <Input
    name={"email"}
    type={"email"}
    placeholder={currentUser?.email}
    onChange={handleChangue}
    disabled={!isEditing}
    className={"w-full"}
    value={userData.email}
    />
    <label className="font-semibold">Dirección:</label>
    <Input
    name={"domicilio"}
    placeholder={currentUser?.domicilio}
    onChange={handleChangue}
    disabled={!isEditing}
    className={"w-full"}    
    value={userData.domicilio}
    />
     <label className="font-semibold">Ciudad:</label>
    <Input
    name={"ciudad"}
    onChange={handleChangue}
    disabled={!isEditing}
    className={"w-full"}    
    placeholder={currentUser?.ciudad}
    value={userData.ciudad}
    />
     <label className="font-semibold">Provincia:</label>
    <Input
    name={"provincia"}
    onChange={handleChangue}
    disabled={!isEditing}
    className={"w-full"}    
    placeholder={currentUser?.provincia}
    value={userData.provincia}
    />  
    </div>
  
  <div className="flex flex-col space-y-2 p-8">
    {/* <label className="font-semibold">Seccional:</label> */}
        
    <label className="font-semibold">DNI:</label>
    <Input
    disabled
    value={currentUser?.dni}
    className={"w-full text-opacity-70"}
    />
    <label className="font-semibold">Sexo:</label>
    <Input
    disabled
    value={currentUser?.sexo}
    className={"w-full text-opacity-70"}
    />
      <label className="font-semibold">Teléfono:</label>
    <Input
    name={"tel"}
    type={"number"}
    onChange={handleChangue}
    disabled={!isEditing}
    placeholder={currentUser?.tel}
    value={userData.tel}
    className={"w-full"}
    />
  <label className="font-semibold">Contraseña:</label>
    <Input
    name={"password"}
    onChange={handleChangue}
    disabled={!isEditing}
    type={"password"}
    placeholder={"*************"}
    className={"w-full"}
    value={userData.password}
    />
           <label className="font-semibold">Repetir Contraseña:</label>
    <Input
    name={"repeat_password"}
    onChange={handleChangue}
    disabled={!isEditing}
    type={"password"}
    placeholder={"*************"}
    className={"w-full"}
    value={userData.repeat_password}
    />
    {error && <p className="text-red-500 font-semibold">{error}</p>}
  </div>
</div>


</div>
        </div>
    </div>
  );
  }

export default Profile


// <div className="flex w-3/5 h-3/5 lg:w-4/5 lg:h-4/5 justify-center items-center max-w-lg bg-white rounded-lg shadow dark:bg-[#1D1D1D]">
//         <div className="flex flex-col items-center pb-10">
//           <Avatar />
//           <span className="text-sm text-gray-500 dark:text-gray-400">Delegado de UATRE.</span>
//           <input
//             type="text"
//             name="domicilio"
//             value={userData.domicilio}
//             onChange={handleChangue}
//             placeholder="Domicilio"
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none"
//             disabled={!isEditing}
//           />
//           {/* Resto de los campos de entrada */}
//           
//         </div>
//       </div>