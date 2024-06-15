import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:4000/profile')
            .then(response => {
                setId(response.data.userId);
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                // Handle error state or show error message
            });
    }, [username, id]); // Include state variables in the dependency array if needed

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}>
            {children}
        </UserContext.Provider>
    );
}
