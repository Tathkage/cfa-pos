import { GoogleLogin } from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = "701943938891-m4tuu3ab7rui5fu18kgesgdnvn5bplg3.apps.googleusercontent.com";


/**
 * This funct
 * @returns {JSX.Element}
 * @constructor
 */


function Login(){

    const navigate = useNavigate();
    const changeToLanding = () =>{
        navigate('/login/server');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }
    const onSuccess = (res) => {
        changeToLanding()
    }
    const onFailure = (res) => {
        console.log("login fails :" + res)
    }

    return(
        <GoogleOAuthProvider clientId="701943938891-m4tuu3ab7rui5fu18kgesgdnvn5bplg3.apps.googleusercontent.com">

        <div id = "signInButton">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
            />;
        </div>

        </GoogleOAuthProvider>
    )
}

export default Login;