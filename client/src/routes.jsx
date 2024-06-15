import React, { useContext } from "react";
import Register from "./RegisterAndLogin.jsx";
import { UserContext } from "./context.jsx";
import Chat from "./Chat.jsx";

export default function Routes() {
    const { username, id } = useContext(UserContext);
    if (username) {
        return <Chat />;  
    }
    return <Register />;
}
