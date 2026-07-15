import React, { Component } from 'react'
import { SafeAreaView, Text, View } from "react-native";
import Router from "./src/Router";
import Store from "./src/store";
import { Provider } from "mobx-react";


export default class App extends Component {
  render() {
    return (
      <Provider {...Store}>
        <Router />
      </Provider>
    )
  }
}
