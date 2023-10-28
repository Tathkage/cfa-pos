/*global google*/

/*body > iframe {
    display: none;
}*/
/*import React, { useMemo } from 'react';
import { GoogleMap} from "@react-google-maps/api";
import {useLoadScript} from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";
import './settings.css';

function Map(){
    const Home = () =>{
        const { isLoaded } = useLoadScript({
            googleMapsApiKey: "AIzaSyDYjDm1SrG_fXhstY_M7rpkinQwFBTtT5M",
        })
    }

    const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

    return(

    <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container">
        <Marker position={center} />
    </GoogleMap>


    );

}
export default Map; */
import React, {useMemo} from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

/*const center = {
    lat: 18.52043,
    lng: 73.856743
};*/


function MyComponent() {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDYjDm1SrG_fXhstY_M7rpkinQwFBTtT5M"
    });

    const [map, setMap] = React.useState(null);
    const [markerPosition, setMarkerPosition] = React.useState(null);

    const handleMapClick = (event) => {
        setMarkerPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    };
    const center = useMemo(() => ({ lat: 30.6129, lng:-96.3405 }), []);

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        //map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {markerPosition && (
                <Marker position={markerPosition} />
            )}
        </GoogleMap>
    ) : <></>;
}

export default React.memo(MyComponent);
