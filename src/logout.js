import { googleLogout } from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "701943938891-m4tuu3ab7rui5fu18kgesgdnvn5bplg3.apps.googleusercontent.com";

function Logout(){
    const navigate = useNavigate();
    const changeToLogin = () =>{
        googleLogout()
        navigate('/login');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }
    const OnSuccess = (res) => {
        console.log("logout works")
        changeToLogin()
    }

    return(
        <GoogleOAuthProvider clientId="701943938891-m4tuu3ab7rui5fu18kgesgdnvn5bplg3.apps.googleusercontent.com">

        <div id = "signOutButton" className="justify-center items-center text-center content-center drop-shadow-2xl w-24 h-8 bg-red-500 hover:bg-red-700 active:bg-blue-950 text-2xl border-slate-400 font-light rounded-full">
            <googleLogout/>
            <button onClick={changeToLogin} className="justify-center items-center text-center" > Logout </button>
        </div>
        </GoogleOAuthProvider>

    )
}
export default Logout;