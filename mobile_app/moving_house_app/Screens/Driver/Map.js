import React from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken('sk.eyJ1IjoicGhhbnRoYW5ob2siLCJhIjoiY2xuaGdxam8zMWFwcjJqb2gyZWNwamNtdCJ9.xQTrBHZ2L30LX6SXLtQhbg');

const Map = () => {
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Mapbox.MapView style={styles.map} />
            </View>
        </View>
    );
}

export default Map;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: 300,
        width: 300,
    },
    map: {
        flex: 1
    }
});