import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Routes from "./routes";

function App() {
  axios.defaults.baseURL = 'https://flatchat-backend.onrender.com';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App