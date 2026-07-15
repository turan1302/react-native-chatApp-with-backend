import React, { Component } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../../config";


export default class Register extends Component {

  constructor() {
    super();
    this.state = {
      secure: true,
      checkboxColor: "#f7f7f7",
      isChecked: false,
      isSubmit: false,
    };
  }

  _handleSubmit = (values) => {
    const {isChecked} = this.state;
    const {navigation} = this.props;

    if (isChecked==false){
      Alert.alert("Sistem Mesajı","Sözleşmeyi onaylamadan kayıt olamazsınız",[
        {
          text : "Vazgeç"
        },
        {
          text : "Tamam"
        }
      ]);
    }else{

      this.setState({isSubmit : true});

      axios.post(`${API_URL}/user/create`,{
        ...values
      }).then((res)=>{
        if (res.data.success){
          Alert.alert("Sistem Mesajı",res.data.message);
          this.setState({isSubmit : false});
          navigation.navigate("Login");
        }else{
          this.setState({isSubmit : false});
          Alert.alert("Sistem Mesajı",res.data.message);
        }
      }).catch((err)=>{
        this.setState({isSubmit : false});
        Alert.alert("Sistem Mesajı","Kayıt ekleme işleminde bir hata oluştu. Lütfen daha sonra tekrar deneyiniz");
      });
    }
  };

  render() {

    const { navigation } = this.props;
    const { secure, isChecked, checkboxColor, isSubmit } = this.state;


    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.sub_title}>Please provide following details for your new account</Text>
          </View>

          <Formik initialValues={{
            name: "",
            email: "",
            password: "",
          }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required("Ad Soyad alanı boş bırakılamaz"),
                    email: Yup.string().email("Lütfen geçerli bir E-Mail adresi giriniz").required("E-Mail alanı boş bırakılamaz"),
                    password: Yup.string().min(8, "Şifreniz 8 karakterden az olamaz").max(16, "Şifreniz 16 karakterden fazla olamaz").required("Şifre alanı boş bırakılamaz"),
                  })}
                  onSubmit={this._handleSubmit}>

            {({ touched, errors, values, isValid, handleSubmit, handleChange }) => (
              <View style={styles.form_area}>
                <View style={styles.name_area}>
                  <TextInput value={values.name} onChangeText={handleChange("name")} style={styles.text_input}
                             placeholderTextColor={"black"}
                             placeholder={"Full Name"}></TextInput>
                </View>
                {(errors.name) && <Text style={styles.error_text}>{errors.name}</Text>}

                <View style={styles.email_area}>
                  <TextInput value={values.email} onChangeText={handleChange("email")} style={styles.text_input}
                             keyboardType={"email-address"} placeholderTextColor={"black"}
                             placeholder={"Email"}></TextInput>
                </View>
                {(errors.email) && <Text style={styles.error_text}>{errors.email}</Text>}


                <View style={styles.password_area}>
                  <TextInput value={values.password} onChangeText={handleChange("password")} style={styles.text_input}
                             placeholderTextColor={"black"} secureTextEntry={secure}
                             placeholder={"Password"}></TextInput>
                  <TouchableOpacity onPress={() => this.setState({ secure: !secure })}>
                    <Icon name={(secure) ? "eye-outline" : "eye-off-outline"} size={18} color={"black"} />
                  </TouchableOpacity>
                </View>
                {(errors.password) && <Text style={styles.error_text}>{errors.password}</Text>}


                <View style={styles.checkbox_area}>
                  <TouchableOpacity style={styles.checkbox(checkboxColor)} onPress={() => {
                    let checkboxColor = (!isChecked) ? "#7165e3" : "#f7f7f7";
                    this.setState({
                      isChecked: !isChecked,
                      checkboxColor,
                    });
                  }}>
                    {(isChecked) && <Icon name={"checkmark-outline"} size={20} color={"white"} />}
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.checkbox_text}>By creating your account you have to agree with our Teams and
                      Conditions.</Text>
                  </View>
                </View>


                <TouchableOpacity onPress={handleSubmit} disabled={(!isValid || isSubmit)} style={styles.signup_button}>
                  <Text style={styles.signup_button_text}>Sign up My Account</Text>
                </TouchableOpacity>

                <View style={styles.signin_button_area}>
                  <Text style={{ fontSize: 15 }}>Do you have an account ? - </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Sign In</Text>
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
    width: "55%",
    textAlign: "center",
  },
  form_area: {
    marginTop: 87,
    marginHorizontal: 37,
  },
  text_input: {
    flex: 1,
  },
  name_area: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    height: 50,
    justifyContent: "center",
    paddingLeft: 29,
    borderRadius: 10,
    marginBottom: 5,
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
  forget_password_area: {
    alignItems: "flex-end",
    marginTop: 21,
  },
  forget_password_text: {
    color: "#1c1939",
  },
  signup_button: {
    marginTop: 49,
    alignItems: "center",
    backgroundColor: "#7165E3",
    paddingVertical: 19,
    borderRadius: 10,
  },
  checkbox_area: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  checkbox(background) {
    return {
      width: 26,
      height: 26,
      backgroundColor: background,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    };
  },
  checkbox_text: {
    marginLeft: 10,
  },
  signup_button_text: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  signin_button_area: {
    flexDirection: "row",
    marginTop: 19,
    justifyContent: "center",
  },
  error_text: {
    color: "red",
    marginBottom: 8,
  },
});
