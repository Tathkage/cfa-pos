import React from "react";
import { useNavigate } from 'react-router-dom';
import './landingPageStylesheet.css';
import './settings.css';
import cookie from "react-cookies";
import Home from "./translate.js";

import { useEffect } from "react";
import { GoogleMap } from "@react-google-maps/api";
import {useLoadScript} from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";
import { useMemo, useRef } from "react";



const Settings = () => {

    let translateButtonExistRef = useRef(false);
    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                autoDisplay: false
            },
            "google_translate_element"
        );
    };
    useEffect(() => {
        if (!translateButtonExistRef.current) {
            translateButtonExistRef.current = true;
            const addScript = document.createElement("script");
            addScript.setAttribute(
                "src",
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            );
            document.body.appendChild(addScript);
            window.googleTranslateElementInit = googleTranslateElementInit;
            //translateButtonExistRef.current = false;
        }
    }, []);

    //translate.google.com/translate_a/element.js?cb=googleTranslateElementInit

    const navigate = useNavigate();

    const changeToLanding = () =>{
        //document.body.removeAttributeNode(addScript)
        navigate('/landing');
        // navigate('./customer_pages/menuOrdering', {state: {drinkIds}});
    }




    return (
        <div id = "land" className="grid place-items-center v-screen justify-center">

            <h1 id = "head" className="text-4xl">
                Information and Accessibility
            </h1>


            <div id = "transoptions"> Google Translate Options: </div>
            <div id="google_translate_element">

            </div>

            <div className="big_space">
            </div>




            <div id={"map"}>


                <Home/>


            </div>

            <div id = "settings" className="space-y-4">
                <button onClick={changeToLanding} className=" text-4x1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-[3vmin] px-[5vmin] h-32 w-80 rounded-lg shadow-lg">Back</button>
            </div>


        </div>
    );
}

export default Settings;