import React from 'react'
import { TouchableOpacity, View } from "react-native";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'


function BackButton({navigation, nav_input}) {
    return (
        <TouchableOpacity style={{ backgroundColor: "red", position: "absolute", zIndex: 99999, top: 50, left: 10, borderRadius: 999, padding: 5, backgroundColor: "black", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate(nav_input)}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white" }} />
        </TouchableOpacity>
    )
}

export default BackButton