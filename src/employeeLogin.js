import './employeeLogin.css';
import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LoginButton from "./login";
import LogoutButton from "./logout";
import { useEffect} from "react";
import { gapi } from 'gapi-script';
import { GoogleOAuthProvider } from '@react-oauth/google';

import bcrypt from 'bcryptjs';

const clientId = "701943938891-m4tuu3ab7rui5fu18kgesgdnvn5bplg3.apps.googleusercontent.com";
const salt = bcrypt.genSaltSync(10)
/**
 * This function handles the overall processes that take place for all employee
 * authentication, login, as well as our security. It uses a database login, as well as
 * a Google OAuth2 login for servers to access the ordering screens.
 * @returns {JSX.Element}
 * @constructor
 */
function EmployeeLogin() {

    useEffect(() => {
        function start()
        {
            gapi.auth2.init({
                client_id: clientId,
                scope: ""
            })
        }

        gapi.load('auth2', start);
    });




    let [managerNumber, setManagerNumber] = useState('');
    const [managers, setManager] = useState([]);
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [employees, setEmployee] = useState([]);

    const navigate = useNavigate();
    /**
     * Change to the landing page on successful button click.
     */
    const changeToLanding = () =>{
        navigate('/');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }
    /**
     * Used to push text field data into a format that can be parsed into a JSON.
     */
    const [formData, setFormData] = useState({
        pass: '',
        user: '',
    });
    /**
     * handleInput updates fromData for a POST API request,
     * it also updates properly for employee and manager numbers.
     * This information is needed so that we can use a map to verify credentials.
     * @param event
     */

    const handleInput = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
        setEmployeeNumber(event.target.value)
        setManagerNumber(event.target.value)
    }

    /**
     * This functions handles the API and backend for the manager_id.
     */

    function searchManager() {
        axios.get(`http://localhost:3000/api/login_info?manager_id=${managerNumber}`)
            .then(function(response) {

                //setManagerNumber(bcrypt.hashSync((response.data), salt) );

                //console.log("check search: " + managerNumber)
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    /**
     * This functions handles the API and backend for the employee_id.
     */
    function searchEmployee() {
        axios.get(`http://localhost:3000/api/login_info?server_id=${employeeNumber}`)
            .then(function(response) {
                setManager(response.data);
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    /**
     * This functions handles when the submit button is pressed, it
     * sends the JSON with the correct information in it to the backend to be parsed in the database.
     * @param event
     */
    function handleSubmit(event) {
        event.preventDefault();

        console.log(bcrypt.hashSync(managerNumber, salt));

        axios.post(`http://localhost:3000/api/userPass`,{formData}, {headers: { "Content-Type": "application/json" }})

            .then(res=>{
                formData.pass = bcrypt.hashSync(formData.pass, salt)
                console.log("formData: ", formData);
                let testpass = bcrypt.hashSync("4321", salt)
                console.log(res);
                //console.log("formData test hash : ", testpass)

                //$2a$10$F9S0/CL35hvLqik4Zq4q6OSHKuQpjN.Ek8QqNyCnnLHLjDyNAnByO
                if(formData.user === "2519" && (formData.pass === testpass))
                {
                    navigate("/login/managerlanding");
                }

            })
            .catch(err => {
                console.log(err);
            })
        searchManager();
        searchEmployee();
        //console.log("user" + formData.user,"pass" + formData.pass);




    }

    return (

        <div className="App">



            <div id="banner">



                <h1 className="text-5xl font-bold grid grid-cols-3 gap-4 content-center">

                    <div id="logo">
                        <img src={require('./images/WhiteCFAIcon.png')} alt="" height="200" width="120"/>
                    </div>


                    <div id="back_button" className="text-1xl  font-light rounded-b-lg rounded-t-lg grid place-items-center h-screen">
                        <button onClick={changeToLanding} > <img src={require('./images/backBack.png')} alt="" width={"40"}/> </button>
                    </div>

                </h1>

            </div>
            <div className="custom-shape-divider-top-1682377788" >
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                     preserveAspectRatio="none">
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="shape-fill"></path>
                </svg>
            </div>


            <div id = "manager" className="drop-shadow-2x1 text-7xl text-white font-bold rounded-b-lg rounded-t-lg">
                Chick-Fil-A Employee Login
            </div>

            <div id = "login" className="rounded-b-lg rounded-t-lg">

                <div className="submit">

                    <form onSubmit ={handleSubmit} autoComplete="off">

                        <div id="spacer">
                            <label className="block text-white mr-48"> </label>
                        </div>
                        <div id = "serving2" className="drop-shadow-2x1 text-2xl text-white font-light">
                            Manager Login

                        </div>

                        <hr className="w-96 h-px my-8 mx-auto bg-gray-100 border-0 dark:bg-gray-400"/>
                        <div id="field" className="drop-shadow-1xl bg-white w-96 border-2 border-slate-400 h-16 rounded-b-lg rounded-t-lg grid place-items-center">

                            <input type="text"
                                   name="user"
                                   placeholder={"Username"}
                                   onChange={handleInput}
                                   autoComplete="off"/>
                        </div>

                        <div id="spacer">
                            <label className="text-white mr-48"> space </label>
                        </div>

                        <div id="field" className="drop-shadow-1xl bg-white w-96 border-2 border-slate-400 h-16 rounded-b-lg rounded-t-lg grid place-items-center">

                            <input type="password"
                                   name="pass"
                                   placeholder={"Password"}
                                   onChange={handleInput}
                                   autoComplete="off"/>
                        </div>

                        <hr className="drop-shadow-2x1 w-96 h-px my-8 mx-auto bg-gray-100 border-0 dark:bg-gray-400"/>
                        <div id = "serving" className="drop-shadow-2x1 text-2xl text-white font-light">
                            Server: <div id="google">
                            <GoogleOAuthProvider clientId="701943938891-m4tuu3ab7rui5fu18kgesgdnvn5bplg3.apps.googleusercontent.com">
                                <LoginButton/>
                            </GoogleOAuthProvider>

                            </div>
                        </div>
                        <div id="submit_button" className="drop-shadow-2xl bg-red-600 hover:bg-red-700 active:bg-blue-950 text-1xl border-slate-400 font-light rounded-full grid place-items-center h-screen">
                            <button> Submit </button>


                        </div>

                    </form>

                    <div className="spacer">
                    </div>
                    <div className="text-1xl bg-white font-light rounded-b-lg rounded-t-lg grid place-items-center v-screen">

                        <table id="product-table">
                            <thead>
                            <tr>
                            </tr>
                            </thead>

                            <tbody>
                            {managers.map((manager) => (
                                <tr key={manager.pass}>

                                    <th>unsuccessful login: try again</th>
                                    {/* <td>{ manid = manager.manager_id}</td>
                                            <td>{manager.first_name}</td>
                                            <td>{manager.last_name}</td>
                                            <td>{manpass = manager.password}</td> */}
                                </tr>


                            ))}


                            </tbody>


                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.pass}>
                                    <th>unsuccessful login: try again</th>
                                    {/*}  <td>{employee.server_id}</td>
                                            <td>{employee.first_name}</td>
                                            <td>{employee.last_name}</td>
                                            <td>{employee.password}</td> */}
                                </tr>
                            ))}


                            </tbody>



                        </table>


                    </div>

                </div>



            </div>






        </div>

    );
}

export default EmployeeLogin;