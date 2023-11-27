import React, { useState, useEffect } from 'react';
import { PieChart, ResponsiveContainer, Pie, Tooltip, Cell, Legend } from 'recharts';
import api from '../common/Axiosconfig';
import {FiDownload} from 'react-icons/fi'


const COLORS = ['#006084', '#23A1D8', '#0E6F4B'];

const SimplePieCharts = () => {
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const handleDownload = async (index) => {
    if (index === 2) {
    try {
      const res = await api.get(`tasks/luna_de_miel/excel`, {responseType: 'blob'});
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `beneficios-LunadeMiel.xlsx`);
      document.body.appendChild(link);
      link.click();
    }
    catch (error) {
      console.log(error);
    }
  }
 if (index === 1) {
    try {
      const res = await api.get(`tasks/kit-escolar/excel`, {responseType: 'blob'});
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `beneficios-KitEscolar.xlsx`);
      document.body.appendChild(link);
      link.click();
    }
    catch (error) {
      console.log(error);
    }
  }
  if (index === 0) {
      try {
      const res = await api.get(`tasks/kit-maternal/excel`, {responseType: 'blob'});
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `beneficios-KitMaternal.xlsx`);
      document.body.appendChild(link);
      link.click();
    }
    catch (error) {
      console.log(error);
    }
}
}


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`users/beneficios-otorgados`);
        const apiData = res.data;

        // Sumar los valores de cada beneficio para todos los meses
         let totalValor = 0;

        for (const key in apiData) {
          const beneficio = key;
          const meses = apiData[key];
          let beneficioValor = 0;

          for (const mes in meses) {
            beneficioValor += meses[mes];
            totalValor += meses[mes];
          }

          setData((prevData) => [
            ...prevData,
            {
              label: beneficio, // Mostrar el nombre del beneficio
              value: beneficioValor,
            },
          ]);
        }

        // Calcular el porcentaje en relación con el total de todos los beneficios
        setData((prevData) =>
          prevData.map((entry) => ({
            ...entry,
            percent: ((entry.value / totalValor) * 100).toFixed(2),
          }))
        );

        
        setIsLoading(false); // Marcamos que los datos se han cargado
      } catch (error) {
        console.log(error.response.data.message);
        setIsLoading(false); // En caso de error, también marcamos que los datos se han cargado
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    // Mientras los datos se están cargando, puedes mostrar un mensaje de carga
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="bg-white w-full rounded-lg p-4">
      <h3 className='font-semibold'>Beneficios Otorgados</h3>
      <p className='text-gray-500 font-semibold text-sm'>Desde el comienzo</p>
      <div className="flex">
        <div className="aspect-auto w-4/6 mt-8">
          <ResponsiveContainer aspect={2}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={60}
                outerRadius={100}
                fill="#82ca9d"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
             
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3">
          <ul className='flex flex-col justify-around w-full h-full'>
            {data.map((entry, index) => (
              <li className={`text-[${COLORS[index % COLORS.length]}] font-bold`} key={`legend-item-${index}`}>
                <span
                  className="mr-2"
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    
                    borderRadius: '50%',
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                ></span>
                {entry.label} {entry.percent}%
                <br></br>
                <a onClick={() => handleDownload(index)} className='text-sm cursor-pointer font-medium text-gray-500 flex'>Descargar listado {<FiDownload className='ml-2'/>}</a>
                
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimplePieCharts;


// 