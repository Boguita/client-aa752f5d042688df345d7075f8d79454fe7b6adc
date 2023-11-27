import axios from "axios";

    const api = axios.create({
      baseURL: "https://backuatrebeneficios.galgoproductora.com/api", // URL base del servidor
      withCredentials: true, // Habilita el envío de cookies
    });

    // baseURL: "https://uatre-api.onrender.com/api",

    // api.defaults.adapter = (config) => {
    //   return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(config.method, config.url, true);
    //     xhr.withCredentials = true; // Asegúrate de configurar withCredentials en true para permitir el envío de cookies
    //     xhr.setRequestHeader("Content-Type", "application/json");
    //     xhr.onload = () => {
    //       if (xhr.status >= 200 && xhr.status < 300) {
    //         resolve({
    //           data: JSON.parse(xhr.responseText),
    //           status: xhr.status,
    //           statusText: xhr.statusText,
    //           headers: xhr.getAllResponseHeaders(),
    //         });
    //       } else {
    //         reject(new Error(xhr.statusText));
    //       }
    //     };
    //     xhr.onerror = () => reject(new Error("Network Error"));
    //     xhr.send(config.data);
    //   });
    // };

    export default api;