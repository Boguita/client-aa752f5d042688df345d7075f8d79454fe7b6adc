import { useState } from "react";
import { AuthContext } from "../context/authContext"
import { useContext, useEffect } from "react"
import api from "../common/Axiosconfig"

const Soporte = () => {
  const [success, setSuccess] = useState(null);
  const { currentUser} = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: currentUser?.email,
    name: currentUser?.username,
    dni: '',
    seguimiento: '',
    type: 'Consulta',
    benefit: 'Otro',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("users/soporte", formData);
    if (res.status === 200 || res.status === 204) {
      setSuccess("Su consulta ha sido enviada con éxito");
      setFormData({
    email: currentUser?.email,
    name: currentUser?.username,
    dni: '',
    seguimiento: '',
    type: 'Consulta',
    benefit: 'Otro',
    message: '',
  })
      setError(null);
    } else {
      setError("Ha ocurrido un error, por favor intente nuevamente");
      setSuccess(null);
    }
    console.log(formData);
  } catch (error) {
    setError("Ha ocurrido un error, por favor intente nuevamente");
    setSuccess(null);
    console.error(error);
  }
};

  return (
    <div className="md:ml-64 max-md:p-12 max-sm:pt-52 w-screen h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-3xl max-xl:max-w-xl max-lg:max-w-lg bg-white p-8 rounded shadow w-full">
        <h1 className="text-2xl font-semibold mb-4">Soporte</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="type">
              Tipo de Consulta
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="Consulta">Consulta</option>
              <option value="Error de Datos">Error de Datos</option>
              <option value="Eliminar Datos">Eliminar Datos</option>
              <option value="Modificar">Modificar</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="dni">
              Número de DNI del Afiliado
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dni"
              type="text"
              required
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              placeholder="Número de DNI"
            />
          </div>

           <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="seguimiento">
              Número de Seguimiento
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="seguimiento"
              type="text"
              name="seguimiento"
              value={formData.seguimiento}
              onChange={handleInputChange}
              placeholder="Número de Seguimiento"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="benefit">
              Tipo de Beneficio
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="benefit"
              name="benefit"
              required
              value={formData.benefit}
              onChange={handleInputChange}
            >
              <option value="Modificar">Otro</option>
              <option value="Consulta">Kit Escolar</option>
              <option value="Error de Datos">Kit Nacimiento</option>
              <option value="Eliminar Datos">Luna de Miel</option>
              
            </select>
          </div>
          <div className="mb-4">
            <label className="block  text-gray-700 font-bold mb-2" htmlFor="message">
              Mensaje Detallado
            </label>
            <textarea
              className="appearance-none resize-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Escribe tu mensaje detallado aquí..."
              rows="4"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
        </form>
        {success && <p className="text-green-500 font-semibold">{success}</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}
      </div>
    </div>
  );
};

export default Soporte;