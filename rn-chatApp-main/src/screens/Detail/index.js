import React, { Component } from "react";
import {
  Alert,
  FlatList, Keyboard, Platform,
  SafeAreaView, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { API_URL } from "../../../config";
import { inject } from "mobx-react";
import io from "socket.io-client";
import MessageListItem from "../../components/Detail/MessageListItem";
import Icon from "react-native-vector-icons/Ionicons";

@inject("AuthenticationStore")
export default class Detail extends Component {


  constructor(props) {
    super(props);
    this.state = {
      room_name: "",
      messages: [],
      messageText: "",
      count: 0,
      inputBottomMargin: 0,
    };


    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ["websocket"],
    };

    this.socket = io("http://localhost:3000", connectionConfig);

    this.socket.emit("add_room", {
      room_id: this.props.route.params.room_id,
    });

    this.socket.on("gonderData", (data) => {
      let { messages } = this.state;
      this.setState({ messages: [data, ...messages] });
    });

    this.socket.on("join_count", (data) => {
      this.setState({ count: data.count });
    });

    this.socket.on("remove_room_process", () => {
      this.props.navigation.navigate("Home");
    });
  }

  _customHeader = () => {
    const { navigation, route } = this.props;
    const { room_name } = this.state;

    navigation.setOptions({
      headerShown: true,
      headerTitle: room_name,
      headerTitleStyle: {
        maxWidth: (Platform.OS === "ios") ? 150 : 200,
      },
      headerRight: () => {
        if (this.props.AuthenticationStore.isSuper) {
          return (
            <TouchableOpacity onPress={() => this._removeRoom()} style={{ marginRight: 10 }}>
              <Icon name={"trash"} style={{ fontSize: 30 }} size={30} color={"#ff7979"}></Icon>
            </TouchableOpacity>
          );
        }
      },
    });
  };

  async componentDidMount() {
    const { params } = this.props.route;
    await this._getRoomMessages();
    await this.setState({ room_name: params.room_name });
    this._customHeader();

    this.props.navigation.addListener("beforeRemove", (e) => {
      this.socket.emit("leave_room", { room_id: params.room_id });
    });


    // klavey açılınca çalışacak IOS
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        (event) => this.setState({ inputBottomMargin: event.endCoordinates.height - 35 }),
      );

      // klavye kapanınca çalışacak
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        (event) => this.setState({ inputBottomMargin: 0 }),
      );
    }
  }

  _getRoomMessages = () => {
    const { params } = this.props.route;
    axios.get(`${API_URL}/message/list?mg_room=${params.room_id}`).then((res) => {
      this.setState({ messages: res.data.data.reverse() });
    }).catch((err) => {
      console.log(err);
      Alert.alert("Sistem Mesajı", "Bir Hata Oluştu. Lütfen daha sonra tekrar deneyiniz");
    });
  };

  _handleSendMessage = () => {
    const { messageText } = this.state;
    const { params } = this.props.route;
    axios.post(`${API_URL}/message/create`, {
      mg_user: this.props.AuthenticationStore.token,
      mg_room: params.room_id,
      mg_text: messageText,
    }).then((res) => {
      if (res.data.success) {
        this.socket.emit("gonder", {
          name: this.props.AuthenticationStore.name,
          mg_room: params.room_id,
          mg_text: messageText,
          mg_user: this.props.AuthenticationStore.token,
        });
        this.setState({ messageText: "" });
      } else {
        Alert.alert("Sistem Mesajı", res.data.message);
      }
    }).catch((err) => {
      Alert.alert("Sistem Mesajı", "Mesaj gönderme işleminde bir hata oluştu. Lütfen daha sonra tekrar deneyiniz");
    });
  };


  _removeRoom = () => {
    const { route } = this.props;
    axios.post(`${API_URL}/room/delete`, {
      rm_id: route.params.room_id,
    }).then((res) => {
      if (res.data.success) {
        this.socket.emit("remove_room", { room_id: route.params.room_id });
      } else {
        Alert.alert("Sistem Mesajı", res.data.message);
      }
    }).catch((err) => {
      Alert.alert("Sistem Mesajı", "Oda silme işleminde bir hata oluştu. Lütfen daha sonra tekrar deneyiniz");
    });

  };


  _renderItem = ({ item, index }) => {
    return (
      <MessageListItem item={item} token={this.props.AuthenticationStore.token}></MessageListItem>
    );
  };


  render() {
    const { messageText, messages, count } = this.state;

    return (
      <SafeAreaView style={styles.body}>
        <View style={styles.join_info}>
          <Text>Aktif Üye: {count}</Text>
        </View>
        <FlatList
          inverted
          style={styles.message_list} showsVerticalScrollIndicator={false}
          data={messages}
          renderItem={this._renderItem}>
        </FlatList>
        <View style={styles.input_area(this.state.inputBottomMargin)}>
          <TextInput value={messageText} onChangeText={(messageText) => this.setState({ messageText })} multiline={true}
                     style={styles.input} placeholderTextColor={"black"} placeholder={"Veri Yaz"}></TextInput>
          <TouchableOpacity onPress={this._handleSendMessage} disabled={(!messageText) ? true : false}
                            style={styles.send_button}>
            <Text style={{ color: "white" }}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  body: { flex: 1, backgroundColor: "#ccc" },
  join_info: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e3e3e3",
  },
  message_list: { flex: 1 },
  input_area: (inputBottomMargin) => {
    return {
      flex: 0.06,
      backgroundColor: "white",
      height: 30,
      flexDirection: "row",
      padding: 20,
      alignItems: "center",
      marginBottom: inputBottomMargin,
    };
  },
  input: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 5,
    flex: 1,
    borderRadius: 8,
    height: 40,
    textAlignVertical: "center",
    textAlign: "justify",
  },
  send_button: { marginHorizontal: 10, backgroundColor: "green", width : 80,height : 40,padding: 4, borderRadius: 5,justifyContent : "center",alignItems : "center" },
});
