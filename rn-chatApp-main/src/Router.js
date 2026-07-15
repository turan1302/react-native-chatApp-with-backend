import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import { navigationRef } from "./NavigationService";

import Loading from "./screens/Loading";
import Login from "./screens/Login";
import Register from "./screens/Register";

import Home from "./screens/Home";
import AddChatRoom from "./screens/AddChatRoom";
import Detail from "./screens/Detail";


export default class Router extends Component {

  stackExternalOptions = ()=>{
    return {
      headerShown: false,
    }
  }

  render() {
    return (
     <NavigationContainer ref={navigationRef}>
       <Stack.Navigator initialRouteName={"Loading"} screenOptions={this.stackExternalOptions}>
         <Stack.Screen name="Loading" component={Loading} />
         <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="Register" component={Register} />

         <Stack.Screen name="Home" component={Home} />
         <Stack.Screen name="AddChatRoom" component={AddChatRoom} />

         <Stack.Screen name="Detail" component={Detail} />
       </Stack.Navigator>
     </NavigationContainer>
    )
  }
}
