import React, { Component } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Formik } from "formik";
import * as Yup from "yup";
import { inject } from "mobx-react";
import axios from "axios";
import { API_URL } from "../../../config";

@inject('AuthenticationStore')

export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      secure: true,
      isSubmit: false,
    };
  }

  _handleSubmit = (values)=>{
    const {navigation} = this.props;
    this.setState({isSubmit : true});

    axios.post(`${API_URL}/user/login`,{
      ...values
    }).then((res)=>{
      this.setState({isSubmit : false});
      if (res.data.success){
        this.props.AuthenticationStore.saveToken(res.data.data.token,res.data.data.isSuper,res.data.data.name);
        Alert.alert("Sistem Mesajı",res.data.message);
        navigation.navigate("Home");
      }else{
        Alert.alert("Sistem Mesajı",res.data.message);
      }
    }).catch((err)=>{
      this.setState({isSubmit : false});
      Alert.alert("Sistem Mesajı","Giriş işleminde bir hata oluştu. Lütfen daha sonra tekrar deneyiniz");
    });
  }

  render() {

    const { navigation } = this.props;
    const { secure,isSubmit } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.sub_title}>Sign in to continue</Text>
          </View>
          <Formik initialValues={{
            email : '',
            password : ''
          }}
                 validationSchema={Yup.object().shape({
                   email: Yup.string().email("Lütfen geçerli bir E-Mail adresi giriniz").required("E-Mail alanı boş bırakılamaz"),
                   password: Yup.string().min(8, "Şifreniz 8 karakterden az olamaz").max(16, "Şifreniz 16 karakterden fazla olamaz").required("Şifre alanı boş bırakılamaz"),
                 })}
                  onSubmit={this._handleSubmit}>
            {({values, errors, isValid, handleChange, handleSubmit}) => (
            <View style={styles.form_area}>
              <View style={styles.email_area}>
                <TextInput value={values.email} onChangeText={handleChange('email')} style={styles.text_input} keyboardType={"email-address"} placeholderTextColor={"black"}
                           placeholder={"Email"}></TextInput>
              </View>
              {(errors.email) && <Text style={styles.error_text}>{errors.email}</Text>}


              <View style={styles.password_area}>
                <TextInput value={values.password} onChangeText={handleChange('password')} style={styles.text_input} placeholderTextColor={"black"} secureTextEntry={secure}
                           placeholder={"Password"}></TextInput>
                <TouchableOpacity onPress={() => this.setState({ secure: !secure })}>
                  <Icon name={(secure) ? "eye-outline" : "eye-off-outline"} size={18} color={"black"} />
                </TouchableOpacity>
              </View>
              {(errors.password) && <Text style={styles.error_text}>{errors.password}</Text>}

              <TouchableOpacity  disabled={(!isValid || isSubmit)} style={styles.login_button} onPress={handleSubmit}>
                <Text style={styles.login_button_text}>Sign in My Account</Text>
              </TouchableOpacity>

              <View style={styles.signup_button_area}>
                <Text style={{ fontSize: 15 }}>Don’t have an account? - </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
              )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    marginHorizontal: 37,
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginTop: 70,
    fontSize: 35,
    color: "#1c1939",
  },
  sub_title: {
    marginTop: 21,
    fontSize: 15,
    color: "#1c1939",
  },
  form_area: {
    marginTop: 87,
    marginHorizontal: 37,
  },
  text_input: {
    flex: 1,
  },
  email_area: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    height: 50,
    justifyContent: "center",
    paddingLeft: 29,
    borderRadius: 10,
  },
  password_area: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 29,
    paddingRight: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  login_button: {
    marginTop: 51,
    alignItems: "center",
    backgroundColor: "#7165E3",
    paddingVertical: 19,
    borderRadius: 10,
  },
  login_button_text: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  signup_button_area: {
    flexDirection: "row",
    marginTop: 19,
    justifyContent: "center",
  },
  error_text: {
    color: "red",
    marginBottom: 8,
  },
});
