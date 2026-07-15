import React, { Component } from 'react'
import { SafeAreaView, Text, View } from "react-native";
import { inject } from "mobx-react";
@inject('AuthenticationStore')

export default class Loading extends Component {

  componentDidMount() {
    const {navigation} = this.props;

    navigation.addListener("focus",()=>{
      this.props.AuthenticationStore.getToken();
    });
  }

  render() {
    return (
      <SafeAreaView>

      </SafeAreaView>
    )
  }
}
