import { useState } from "react";
import api from "../common/Axiosconfig";


const ImageUpload = () => {
  const [err, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    fecha_de_nacimiento: '',
    tel: '',
    nacionalidad: '',
    sexo: '',
    estado_civil: '',
    cuit: '',
    domicilio: '',
    correo: '',
    datos_empleador: {
        razon_social: '',
        cuit_empleador: '',
        actividad: '',
    },
    dni_img: null,
    recibo_sueldo: null,
  });



  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'razon_social' || name === 'cuit_empleador' || name === 'actividad') {
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

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {

    const formDataToSend = new FormData();
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

    

    const datosEmpleador = {
    razon_social: formData.datos_empleador.razon_social,
    cuit_empleador: formData.datos_empleador.cuit_empleador,
    actividad: formData.datos_empleador.actividad,
  };

  formDataToSend.append('datos_empleador', JSON.stringify(datosEmpleador));

    const response = await api.post('/users/afiliado-registro', formDataToSend)
  
     if (response.status === 200) {
      await handleImageUpload();
    }
    // Aquí puedes mostrar un mensaje de éxito o redirigir a otra página
  } catch (error) {
    console.error(error.data);
    setError(error.response.data.error);
    // Aquí puedes mostrar un mensaje de error o realizar acciones adicionales en caso de error
  }
  };




    const handleDniImgChange = (e) => {
    const filesArray = Array.from(e.target.files);
  setFormData((prevFormData) => ({
    ...prevFormData,
    dni_img: filesArray,
  }));
  console.log(formData.dni_img);
    
  };

  const handleReciboSueldoChange = (e) => {
    const filesArray = Array.from(e.target.files);
setFormData((prevFormData) => ({
    ...prevFormData,
    recibo_sueldo: filesArray,
  }));
  console.log(formData.recibo_sueldo);
    
  };

// const loadImage = (imageFile) => {
//   return new Promise((resolve) => {
//     const imgElement = new Image();
//     imgElement.onload = resolve;
//     imgElement.src = URL.createObjectURL(imageFile);
//   });
// };

const handleImageUpload = async () => {
    try {
      console.log(formData.dni_img)
      console.log(formData.recibo_sueldo)
      // Upload DNI images
      const dniFormData = new FormData();
      dniFormData.append("dni", formData.dni);
      formData.dni_img.forEach((dniImg) => {
        dniFormData.append("dni_img", dniImg);
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
    <div className="w-screen h-screen flex items-center justify-center">
      <form
        className="w-96 mt-[600px] p-6 rounded-lg shadow-lg bg-gray-100 text-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-6">Registro de Afiliado</h2>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Nombres y Apellidos:</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">DNI:</label>
          <input
            type="text"
            name="dni"
            required
            value={formData.dni}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fecha_de_nacimiento"
            required
            value={formData.fecha_de_nacimiento}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Teléfono:</label>
          <input
            type="text"
            name="tel"
            required
            value={formData.tel}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Nacionalidad:</label>
          <input
            type="text"
            name="nacionalidad"
            required
            value={formData.nacionalidad}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Sexo:</label>
          <select
            name="sexo"
            required
            value={formData.sexo}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Estado Civil:</label>
          <input
            type="text"
            name="estado_civil"
            required
            value={formData.estado_civil}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">CUIT/CUIL/CDI:</label>
          <input
            type="text"
            name="cuit"
            required
            value={formData.cuit}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Domicilio:</label>
          <input
            type="text"
            name="domicilio"
            required
            value={formData.domicilio}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Correo:</label>
          <input
            type="email"
            name="correo"
            required
            value={formData.correo}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
  <label className="block mb-2 font-medium">Datos del Empleador:</label>
  <div>
    <label className="block mb-2">Razón Social:</label>
    <input
      type="text"
      name="razon_social"
      required
      value={formData.datos_empleador.razon_social}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
  <div>
    <label className="block mb-2">CUIT:</label>
    <input
      type="text"
      name="cuit_empleador"
      required
      value={formData.datos_empleador.cuit}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
  <div>
    <label className="block mb-2">Actividad:</label>
    <input
      type="text"
      name="actividad"
      required
      value={formData.datos_empleador.actividad}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
</div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Adjuntar Imagen de DNI:</label>
          <input
            type="file"
            multiple
            required
            onChange={handleDniImgChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Adjuntar Recibo de Sueldo:</label>
          <input
            type="file"
            multiple
            onChange={handleReciboSueldoChange}
            className="w-full border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
        >
          Submit
        </button>
        {err && <p className="text-red-500">{err}</p>}
        
      </form>
      
    </div>
  );
};





export default ImageUpload;



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