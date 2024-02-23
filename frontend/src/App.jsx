import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import SignInPage from "./pages/signin.page";
import SignUpPage from "./pages/signup.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";

export const UserContext = createContext({})
  

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
    }, [])


    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
        <Routes>
            <Route path="/" element={<Navbar/>}>
            <Route path="signup" element={<SignUpPage/>}/>
            <Route path="signin" element={<SignInPage/>}/>
            </Route>
        </Routes>
        </UserContext.Provider>
    )
}

export default App;