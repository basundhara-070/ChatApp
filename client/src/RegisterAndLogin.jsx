// import { useContext, useState } from "react"
// import axios from 'axios';
// import { UserContext } from "./context.jsx";

// export default function Register(){
//     const [username, setUsername]=useState('');
//     const [password, setPassword]=useState('');
//     const [isLogin, setIsLogin] =useState('register')
//     const{setUsername:setLoggedInUsername, setId}= useContext(UserContext);

//     async function handleSubmit(ev){
//         ev.preventDefault();
//         const url= isLogin==='register'?'register':'login';
//         const {data}= await axios.post(url,{username,password})
//         setLoggedInUsername(username);
//         setId(data.id);
//     }
//     return (
//         <div className="bg-blue-50 h-screen flex items-center">
//             <form className="w-100 mx-auto" onSubmit={handleSubmit}>
//                 <input value={username} 
//                 onChange={ev=> setUsername(ev.target.value)} type="text" placeholder="username" className="block rounded-sm p-2 mb-2 border" />
//                 <input value={password} 
//                 onChange={ev=> setPassword(ev.target.value)} type="password" placeholder="password" className="block rounded-sm p-2 mb-2 border" />
//                  <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
//                     {isLogin==='register'? 'Register':'Login'}
//                 </button>
//                 {isLogin==='register'&&(<div>
                   
//                 <div className="text-center mt-2">Already a member?
//                      <button onClick={()=>{setIsLogin('login')}}> Login
//                         </button></div>
//                 </div>)}
//                {isLogin==='login'&&(
//                  <div className="text-center mt-2">Don't have an account?
//                  <button onClick={()=>{setIsLogin('register')}}>Register
//                     </button></div>
//                )} 
//             </form>
//         </div>
//     )
// }

import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "./context.jsx";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    const {data} = await axios.post(url, {username,password});
    setLoggedInUsername(username);
    setId(data.id);
  }
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input value={username}
               onChange={ev => setUsername(ev.target.value)}
               type="text" placeholder="username"
               className="block w-full rounded-sm p-2 mb-2 border" />
        <input value={password}
               onChange={ev => setPassword(ev.target.value)}
               type="password"
               placeholder="password"
               className="block w-full rounded-sm p-2 mb-2 border" />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === 'register' && (
            <div>
              Already a member?
              <button className="ml-1" onClick={() => setIsLoginOrRegister('login')}>
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
              Dont have an account?
              <button className="ml-1" onClick={() => setIsLoginOrRegister('register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}