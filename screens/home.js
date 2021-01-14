import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Button
} from 'react-native';


export default class Home extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../images/back.jpg')}
          resizeMode="stretch"
          style={styles.image}
          imageStyle={styles.image_imageStyle}
        >
          <View style={styles.group}>
            <Button
              title='Safe Parking'
              color='#800000'
              onPress={() => navigation.navigate('Safe Parking')}
              style={styles.rect1} />
            <Button
              title='Street Food'
              onPress={() => navigation.navigate('Street Food')}
              color='#800000'
              style={styles.rect2} />
            <Button
              title='Technical Support'
              onPress={() => navigation.navigate('Technical Support')}
              color='#800000'
              style={styles.rect3} />
            <Button
              title='All in One'
              onPress={() => navigation.navigate('All in One')}
              color='#800000'
              style={styles.rect4} />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 691
  },
  image: {
    width: 412,
    height: 775,
    backgroundColor: "rgba(15,15, 15,0.45)"
  },
  image_imageStyle: {
    opacity: 0.30
  },
  group: {
    width: 260,
    height: 342,
    justifyContent: "space-between",
    opacity: 0.59,
    marginTop: 121,
    marginLeft: 66,
    marginRight: 66
  },
  rect4: {
    width: 223,
    height: 45,
    //backgroundColor: "#E6E6E6",
    borderRadius: 15
  },
  rect1: {
    width: 223,
    height: 45,
    //backgroundColor: "#E6E6E6",
    borderRadius: 15
  },
  rect2: {
    width: 223,
    height: 45,
    //backgroundColor: "#E6E6E6",
    borderRadius: 15
  },
  rect3: {
    width: 223,
    height: 45,
    //backgroundColor: "#E6E6E6",
    borderRadius: 15
  }
});
