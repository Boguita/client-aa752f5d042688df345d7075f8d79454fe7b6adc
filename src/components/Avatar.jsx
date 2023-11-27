import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from "../context/authContext";



const Avatar = ({path}) => {
  const { currentUser } = useContext(AuthContext);

  return (
   <div className="flex pr-10 py-2 items-center justify-center">
    <Link to={`${path === true ? '/admin/profile' : '/profile'}`} className="flex items-center">
      <span className="max-md:hidden cursor-pointer text-xl mr-4 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
       Hola, {currentUser?.username.charAt(0).toUpperCase() + currentUser?.username.slice(1)}
      </span>

      <div className="flex items-center">
        <svg className="w-14 h-14 bg-slate-300 rounded-full text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
        </svg>
       
      </div>
    </Link>
  </div>
);
  
}

export default Avatar