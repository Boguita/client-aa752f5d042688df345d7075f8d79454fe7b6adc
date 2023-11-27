import React, { useState } from 'react';

const Table = ({ data, rowsPerPage = 8,  showPagination = true }) => {
  const [currentPage, setCurrentPage] = useState(0);
  // Estilo en línea en el componente
const whiteRowClass = 'bg-white';
const grayRowClass = 'bg-gray-200';


  const totalPages = Math.ceil(data?.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-full w-full bg-gray-200">
      <div className="flex flex-col">
        <div className="mt-4 bg-white p-8 rounded-xl">
          <table className="min-w-full  divide-y-4 divide-[#006084]">
            <thead>
              <tr>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Delegado
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3  text-left text-xs leading-4 font-extrabold text-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            
            <tbody>
              {data?.slice(startIndex, endIndex).map((row, index) => (
                <tr key={index} className={`text-gray-600 text-sm font-semibold ${index % 2 === 0 ? grayRowClass : whiteRowClass }`}>
                  <td className="px-6 capitalize py-3 whitespace-no-wrap">{row.username}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.email}</td>
                  <td className="px-6 py-3 text-[#006084] whitespace-no-wrap">{row.ciudad}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">#{row.id}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">{row.dni}</td>
                  <td className="px-6 py-3 whitespace-no-wrap">
                    <button className="text-blue-600 hover:text-blue-900">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
          {showPagination && ( // Renderizar botones de paginación si showPagination es verdadero
            <div className="mt-4 flex justify-around">
              <button
                className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                Anterior
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
