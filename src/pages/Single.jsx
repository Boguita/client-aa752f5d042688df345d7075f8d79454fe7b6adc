// import React, { useEffect, useState } from "react";
// import Edit from "../assets/img/edit.png";
// import Delete from "../assets/img/delete.png";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import Menu from "../components/Menu";
// import axios from "axios";
// import moment from "moment";
// import { useContext } from "react";
// import { AuthContext } from "../context/authContext";
// import DOMPurify from "dompurify";

// const Single = () => {
//   const [task, setTask] = useState({});

//   const location = useLocation();
//   const navigate = useNavigate();

//   const taskId = location.pathname.split("/")[2];

//   const { currentUser } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/tasks/${taskId}`);
//         setTask(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchData();
//   }, [taskId]);

//   const handleDelete = async ()=>{
//     try {
//       await axios.delete(`/tasks/${taskId}`);
//       navigate("/tickets")
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const getText = (html) =>{
//     const doc = new DOMParser().parseFromString(html, "text/html")
//     return doc.body.textContent
//   }

//   return (
//     <div className="single ml-64 flex w-screen h-screen justify-center text-white ">
//       <div className="content">
//         {/* <img src={`../upload/${task?.img}`} alt="" /> */}
//         <div className="user">
//           {/* {task.userImg && <img
//             src={task.userImg}
//             alt=""
//           />} */}
//           <div className="info">
//             <span>{task.username}</span>
//             <p>Posted {moment(task.date).fromNow()}</p>
//           </div>
//           {currentUser.username === task.username && (
//             <div className="edit">
//               <Link to={`/write?edit=2`} state={task}>
//                 <img src={Edit} alt="" />
//               </Link>
//               <img onClick={handleDelete} src={Delete} alt="" />
//             </div>
//           )}
//         </div>
//         <h1 className="text-xl">{task.title}</h1>
//         <p
//           dangerouslySetInnerHTML={{
//             __html: DOMPurify.sanitize(task.desc),
//           }}
//         ></p>      </div>
//       <Menu cat={task.cat}/>
//     </div>
//   );
// };

// export default Single;
