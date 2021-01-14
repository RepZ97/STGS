import 'react-native-gesture-handler';
import React, { Component } from 'react';
import Home from './screens/home';
import SafeParking from './screens/safeParking';
import StreetFood from './screens/streetFood';
import TechnicalSupport from './screens/technicalSupport';
import AllInOne from './screens/allinone';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Safe Parking" component={SafeParking} />
        <Stack.Screen name="Street Food" component={StreetFood} />
        <Stack.Screen name="Technical Support" component={TechnicalSupport} />
        <Stack.Screen name="All in One" component={AllInOne} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;