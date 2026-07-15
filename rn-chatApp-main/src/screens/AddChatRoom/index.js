import React, { Component } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { inject } from "mobx-react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../../config";
import io from "socket.io-client/dist/socket.io";

@inject("AuthenticationStore")

export default class AddChatRoom extends Component {


  constructor() {
    super();
    this.state = {
      secure: true,
      isSubmit: false,
    };

    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ["websocket"],
    };

    this.socket = io("http://localhost:3000", connectionConfig);

  }

  _customHeader = () => {
    const { navigation } = this.props;
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Yeni Oda Kur",
    });
  };

  componentDidMount() {
    this._customHeader();
  }

  _handleSubmit = (values, { resetForm }) => {
    this.setState({ isSubmit: true });
    axios.post(`${API_URL}/room/create`, {
      ...values,
      rm_user: this.props.AuthenticationStore.token,
    }).then((res) => {
      this.setState({ isSubmit: false });
      if (res.data.success) {
        resetForm({values : ''});
        Alert.alert("Sistem Mesajı", res.data.message);
        this.socket.emit("AddRoomEvent", { oda: values.rm_name });
      } else {
        Alert.alert("Sistem Mesajı", res.data.message);
      }
    }).catch((err) => {
      Alert.alert("Sistem Mesajı", "Oda ekleme işleminde bir hata oluştu. Lütfen daha sonra tekrar deneyiniz");
    });
  };

  render() {

    const { navigation } = this.props;
    const { secure, isSubmit } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Yeni Oda Kur</Text>
            <Text style={styles.sub_title}>Farklı konularda konuşabilmek için farklı oda oluşturunuz</Text>
          </View>
          <Formik initialValues={{
            rm_name: "",
          }}
                  validationSchema={Yup.object().shape({
                    rm_name: Yup.string().required("Oda İsmi alanı boş bırakılamaz"),
                  })}
                  onSubmit={this._handleSubmit}>
            {({ values, errors, isValid, handleChange, handleSubmit }) => (
              <View style={styles.form_area}>
                <View style={styles.email_area}>
                  <TextInput value={values.rm_name} onChangeText={handleChange("rm_name")} style={styles.text_input}
                             keyboardType={"email-address"} placeholderTextColor={"black"}
                             placeholder={"Oda İsmi"}></TextInput>
                </View>
                {(errors.rm_name) && <Text style={styles.error_text}>{errors.rm_name}</Text>}


                <TouchableOpacity disabled={(!isValid || isSubmit)} style={styles.login_button} onPress={handleSubmit}>
                  <Text style={styles.login_button_text}>Yeni Oda Kur</Text>
                </TouchableOpacity>
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
    textAlign: "center",
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
