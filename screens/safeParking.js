import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Button, Platform, Alert, Image, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import MapViewDirections from 'react-native-maps-directions';
import Carousel from 'react-native-snap-carousel';

const mapStyle = [
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

/*const origin = {latitude: 6.914643, longitude: 79.973518};
const destination = {latitude: 6.915863, longitude: 79.973136};*/

export default class SafeParking extends Component {

    state = {
        markers: [],
        coordinates: [
            //{ name: '1', latitude: 6.018988, longitude: 80.241482, image: require('../images/01.jpg'), size: '20', price: 'Rs 150' },
            //{ name: '2', latitude: 6.017459, longitude: 80.236420, image: require('../images/02.jpg'), size: '3', price: 'Rs 50' },
            { name: 'SLIIT Parking IT Faculty', latitude: 6.914643, longitude: 79.973518, image: require('../images/03.jpg'), row2: 'Approximate Size: 31 Vehicles', row3: 'Price: Students and Staff Only', icon: require('../icons/park.jpg'), calloutStyle: styles.callout2 },
            { name: 'SLIIT Parking ENG Faculty', latitude: 6.915863, longitude: 79.973136, image: require('../images/04.jpg'), row2: 'Approximate Size: 36 Vehicles', row3: 'Price: Students and Staff Only', icon: require('../icons/park.jpg'), calloutStyle: styles.callout2 },
        ],
        points: { latitude: null, longitude: null },
        userloc: { latitude: null, longitude: null }
    }


    componentDidMount() {
        this.requestLocationPermission();
    }

    requestLocationPermission = async () => {
        if (Platform.os === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            console.log('iPhone: ' + response);

            if (response === 'granted') {
                this.locateCurrentPosition();
            }
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            console.log('Android: ' + response);

            if (response === 'granted') {
                this.locateCurrentPosition();
            }
        }
    }
    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(JSON.stringify(position));

                let initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0075,
                    longitudeDelta: 0.00075

                }
                this.setState({ initialPosition });
                this.setState({ userloc: this.state.initialPosition });

            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
        )
    }

    onCarouselItemChange = (index) => {
        let location = this.state.coordinates[index];

        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0075,
            longitudeDelta: 0.00075
        })

        this.state.markers[index].showCallout()
        this.setState({ points: this.state.coordinates[index] });
    }

    onMarkerPressed = (location, index) => {
        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0075,
            longitudeDelta: 0.00075
        });

        this.setState({ markerPressed: true });
        this.setState({ firstItem: index });
        { this.state.markerPressed && this._carousel.snapToItem(index) };
        this.setState({ points: this.state.coordinates[index] });
    }

    renderCarouselItem = ({ item }) =>
        <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{item.name} {"\n"}
                {item.row2} {"\n"}
                {item.row3}
            </Text>
            <Image style={styles.cardImage} source={item.image} />
        </View>

    render() {
        return (
            <View style={styles.container} >
                <MapView

                    Provider={PROVIDER_GOOGLE}
                    ref={map => this._map = map}
                    showsUserLocation={true}
                    style={styles.map}
                    initialRegion={this.state.initialPosition}
                    customMapStyle={mapStyle}>

                    {
                        this.state.coordinates.map((marker, index) => (
                            <Marker
                                key={marker.name}
                                ref={ref => this.state.markers[index] = ref}
                                onPress={() => this.onMarkerPressed(marker, index)}
                                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                title={'Safe Parking'}>

                                <Image
                                    source={marker.icon}
                                    style={styles.icon} />
                                <Callout>
                                    <View style={marker.calloutStyle}><Text adjustsFontSizeToFit numberOfLines={1}>{marker.name}</Text></View>
                                </Callout>
                            </Marker>
                        ))
                    }

                    {(this.state.points.latitude != null) && <MapViewDirections
                        origin={this.state.userloc}
                        destination={this.state.points}
                        apikey={'AIzaSyAaCZmhuWrFcGHMVgEGoETsvjBiNUbqnEc'}
                        mode={"DRIVING"}
                        strokeWidth={4}
                        strokeColor="blueviolet"
                    />}

                </MapView>

                {this.state.markerPressed && <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.coordinates}
                    containerCustomStyle={styles.carousel}
                    renderItem={this.renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    onSnapToItem={(index) => this.onCarouselItemChange(index)}
                    firstItem={this.state.firstItem}
                />}

            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    icon: {
        width: 20,
        height: 20,
    },
    callout2: {
        flex: 1,
        width: 100,
        height: 15,
    },
    carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 48
    },
    cardContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: 200,
        width: 300,
        padding: 10,
        borderRadius: 24,

    },
    cardImage: {
        height: 120,
        width: 300,
        bottom: 0,
        position: 'absolute',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    cardTitle: {
        color: 'white',
        fontSize: 15,
        alignSelf: 'center'
    }
})

