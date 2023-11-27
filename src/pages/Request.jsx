// import React, { useContext, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import moment from "moment";
// import { uploadFile } from "../firebase/config";
// import { AuthContext } from "../context/authContext";
// import Select from "react-select";


// const Request = () => {
//   const { currentUser } = useContext(AuthContext);
//   const state = useLocation().state;
//   const [value, setValue] = useState(state?.title || "");
//   const [title, setTitle] = useState(state?.desc || "");
//   const [file, setFile] = useState([]);
//   const [cat, setCat] = useState(state?.cat || "");
//   const [progress, setProgress] = useState(0);
//   const [hidden, setHidden] = useState("hidden");
  
//   const colourStyles = {
//   control: (styles) => ({ ...styles, backgroundColor: "#E1FE03", border: "none", borderRadius: "2px",})
//   }
//   const handleSelect = (e) => {     
//      setCat(e.cat);           
//   };

//   const navigate = useNavigate();

//   const upload = async () => {
//     try {     
//       let id = title; 
//       for (let i = 0; i < file.length; i++) {
//         const result = await uploadFile(file[i], currentUser?.username, id, setProgress);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

  
 

//   const DBArea = [ 
//     "Graphic Design",
//     "Web Design",
//     "Social Media",
//     "Print Design",
//     "Video Editing",   
//     "Other"
//   ]  

//   const handleClick = async (e) => {
//     e.preventDefault();
//     if(title === "" || value === "" || cat === "") {
//       return alert("Please, complete all the fields")
//     } else {
//     const res = await upload();
//     try {
//       state
//         ? await axios.put(`/tasks/${state.id}`, {
//             title,
//             desc: value,
//             cat,
//           })
//         : await axios.post(`/tasks/`, {
//             title,
//             desc: value,
//             cat,
//             date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//           });                  
//     } catch (err) {
//       console.log(err);
//     }    
//     }  
//   };

//   return (
//     <div className="flex pl-64 bg-black w-screen h-screen justify-center items-center">
      
    
//       <div className="flex flex-col w-full h-full items-center">
        
//         {/* TITLE */}
//         <div className="flex w-full justify-center gap-8 mt-10">

//         <div className="flex flex-col h-24 w-2/6 bg-[#1D1D1D] justify-evenly items-center  rounded">
          
//           <div className="flex">
//             <h2 className="text-white font-semibold text-xl">TITLE FOR YOUR PROJECT<span className="text-red-700">*</span></h2>
//           </div>

//             <div className="flex w-full items-center justify-center">
//               <input
//                 className="w-4/5 text-center text-l border-b border-b-[#CFFE03] bg-transparent text-white focus:outline-none"
//                 type="text"
//                 placeholder="Changue photos of my..."
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>
//         </div>
//           <div className="flex flex-col items-center justify-center rounded h-24 w-2/6 bg-[#1D1D1D]">
//               <h3 className="text-white font-semibold text-xl">SELECT TYPE OF REQUEST<span className="text-red-700">*</span></h3>
//               <div className="w-[80%] mt-2">
//               <Select  
//                 default= {[]}    
//                 options = {DBArea.map(value => ({label: value, cat: value}))}
//                 onChange={handleSelect}                
//                 required
//                 type="text"
//                 placeholder="Select type of task..."                
//                 styles={colourStyles}
//                 theme={(theme) => ({
//                 ...theme,
//                 borderRadius: 0,
//                 backgroundColor: 'black',
//                 colors: {
//                   ...theme.colors,
//                   primary25: "#E1FE03",
//                   primary: "black"
//                 }
//                 })}             
//               />
//               </div>              
//             </div>
//           </div> 
        

//         {/* DESCRIPTION */}

//         <div className="w-full h-full flex flex-col mt-12 items-center ">
//           <h2 className="text-white font-semibold mb-4 text-xl">
//             WRITE YOUR REQUEST<span className="text-red-700">*</span>
//           </h2>
//           <ReactQuill
//             className="w-3/6 h-4/6 text-white"
//             theme="snow"
//             value={value}
//             onChange={setValue}
//           />
//         </div>
//         {/* DRAG AND DROP */} 
//          <div className="flex flex-col h-screen w-screen justify-center items-center text-white ">
//            <div className="flex justify-center items-center w-3/5 h-4/5"
//            onDragOver={(event) => event.preventDefault()} // Prevenir comportamiento predeterminado en 'dragover'
//            onDrop={(event) => event.preventDefault()} // Prevenir comportamiento predeterminado en 'drop'
//            >
//             <label
//               for="files"
//               class="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#1D1D1D] dark:hover:bg-bray-800 dark:bg-[#1D1D1D] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//             >
//               <div class="flex flex-col items-center justify-center pt-5 pb-6">
//                 <svg
//                   aria-hidden="true"
//                   class="w-10 h-10 mb-3 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   ></path>
//                 </svg>
//                 <div>  
//                   <div className="flex-row line-clamp-2 h-40  w-auto">                
//                     <p className="flex items-center justify-center"> Uploading files: 
//                     </p>
//                       {                       
//                        file.length > 0 &&
//                          Object.keys(file).map((key) => (                          
//                            <span className="text-s" key={key}>                            
//                              {file[key].name} |                            
//                            </span>
                          
//                          ))                         
//                         }
                    
//                   </div>
                   
//                   <div class={`${hidden} w-full mb-2 bg-gray-200 rounded-full dark:bg-gray-700`}>
//                     <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: `${progress}%`}}> {progress}%</div>
//                    </div> 
//                 </div>
//               <p class="mb-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
//                 <span class="font-semibold">Click to upload</span> or drag and
//                 drop
//               </p>
//               <p class="text-xs text-gray-500 dark:text-gray-400">
//                 SVG, PNG, JPG, GIF... (MAX. 200MB)
//               </p>
//             </div>
//             <input
//               id="files"
//               type="file"
//               class="hidden"
//               multiple
//               onChange={(e) => {  
                 
//                 setFile(e.target.files)
//                 setHidden("")
//             }}   
//             />  
//           </label>
//         </div>

        {/*Select category*/}
        

        {/* <div className="flex flex-row w-full mt-4 justify-center gap-14 text-white">
        <h2>Select Category<span className="text-red-700">*</span></h2>
        <div className="cat">
          <input
            required
            type="radio"
            checked={cat === "web"}
            name="cat"
            value="web"
            id="web"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="web"><span className="ml-2">Web</span></label>
        </div>
        <div className="cat">
          <input
            required
            type="radio"
            checked={cat === "social"}
            name="cat"
            value="social"
            id="social"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="social">Social Media</label>
        </div>
        <div className="cat">
          <input
            required
            type="radio"
            checked={cat === "graphic"}
            name="cat"
            value="graphic"
            id="graphic"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="graphic">Graphic Design</label>
        </div>     
        <div className="cat">
          <input
            required
            type="radio"
            checked={cat === "video"}
            name="cat"
            value="video"
            id="video"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="video">Video Editing</label>
        </div>
        <div className="cat">
          <input
            required
            type="radio"
            checked={cat === "print"}
            name="cat"
            value="print"
            id="print"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="print">Print</label>
        </div>
           <div className="cat">
          <input
            required
            type="radio"
            checked={cat === "other"}
            name="cat"
            value="other"
            id="other"
            onChange={(e) => setCat(e.target.value)}
          />
          <label htmlFor="other">Other</label>
        </div>
      </div> */}

            {/*Buttons */}
      //     <div className="flex w-full  justify-center">
      //       <div className=" flex gap-60 w-3/6 mt-8">
      //         <button className="btn flex w-5/6 h-14 items-center justify-center mb-4"><span>Save as a draft</span></button>
      //         <button className="btn flex w-5/6 h-14 items-center justify-center mb-4" onClick={handleClick}><span>Publish</span></button>
      //       </div>
      //     </div>
      
      // </div>
      

    

    // </div>
    

        {/* <div className="flex text-white">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Published
          </span>
        </div> */}


//       </div>

     
//   );
// };

// export default Request;

{
  /* SUSCRIPTION TASKS */
}
// <div className="flex flex-col pl-6 justify-center rounded h-24 w-2/6 bg-[#1D1D1D]">
//   <h3 className="text-white">REQUEST NAME</h3>
//   <input
//     className="mt-1 block w-[90%] py-2 bg-transparent border-b border-[#E1FE03] text-sm shadow-sm placeholder-[#777]
//     focus:outline-none text-white mb-2
//     disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
//     invalid:border-[#E1FE03] invalid:text-[#E1FE03]
//     focus:invalid:border-[#E1FE03] focus:invalid:ring-[#E1FE03]"
//     required
//     type="text"
//     placeholder="New fotos for gallery..."
//   />
// </div>
