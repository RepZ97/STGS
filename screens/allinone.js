import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Button, Platform, Alert, Image, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline, } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import Carousel from 'react-native-snap-carousel';
import MapViewDirections from 'react-native-maps-directions';

const mapStyle =
    [
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

export default class AllInOne extends Component {

    state = {
        markers: [],
        coordinates: [
            { name: 'Wade', latitude: 6.914565, longitude: 79.972133, image: require('../images/Wade.jpg'), row2: 'Open Hours: 9.00 AM - 8.00 PM', row3: 'Price: Ranges from Rs 5 - Rs 30', icon: require('../icons/SF.png'), calloutStyle: styles.callout },
            { name: 'Shawarma', latitude: 6.916243, longitude: 79.972482, image: require('../images/shawarma.jpg'), row2: 'Open Hours: 6.00 PM - 10.00 PM', row3: 'Price: Ranges from Rs 100 - Rs 120', icon: require('../icons/SF.png'), calloutStyle: styles.callout },
            { name: 'Computer Accessories', latitude: 6.913207, longitude: 79.972172, image: require('../images/imalka.jpg'), row2: 'Open Hours: 9.00 AM - 8.00 PM', row3: 'Store: IMALKA TECHNOLOGIES', icon: require('../icons/tec.png'), calloutStyle: styles.callout2 },
            { name: 'Mobile Accessories', latitude: 6.914462, longitude: 79.972153, image: require('../images/mobileA.jpg'), row2: 'Open Hours: 9.30 AM - 9.00 PM', row3: 'Store: MACKTECH', icon: require('../icons/tec.png'), calloutStyle: styles.callout2 },
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
                    latitudeDelta: 0.00475,
                    longitudeDelta: 0.000475

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
            latitudeDelta: 0.00475,
            longitudeDelta: 0.000475
        })

        this.state.markers[index].showCallout()
        this.setState({ points: this.state.coordinates[index] });
    }

    onMarkerPressed = (location, index) => {
        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.00475,
            longitudeDelta: 0.000475
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
                                title={'Street Food'}>

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
        width: 25,
        height: 25,
    },
    callout: {
        flex: 1,
        width: 60,
        height: 25,

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