import React, { Component } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { inject } from "mobx-react";
import io from "socket.io-client/dist/socket.io";
import { API_URL } from "../../../config";
import axios from "axios";
import RoomListItemComponent from "../../components/Home/RoomListItemComponent";

@inject("AuthenticationStore")
export default class Home extends Component {


  state = {
    name : '',
    rooms : []
  };
  constructor() {
    super();


    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ["websocket"],
    };

    this.socket = io("http://localhost:3000", connectionConfig);

    this.socket.on("AddRoomListen",function() {
      this._getRooms()
    }.bind(this));
  }

  _customHeader = () => {
    const { navigation } = this.props;
    navigation.setOptions({
      headerShown: true,
      title: "Anasayfa",
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => this._logout()} style={{ marginRight: 10 }}>
            <Icon name={"log-out-outline"} style={{ fontSize: 35 }} size={35} color={"#ddd"}></Icon>
          </TouchableOpacity>
        );
      },
      headerLeft: () => {
        if (this.props.AuthenticationStore.isSuper) {
          return (
            <TouchableOpacity onPress={() => this._addChatRoom()} style={{ marginLeft: 10 }}>
              <Icon name={"add-outline"} style={{ fontSize: 35 }} size={30} color={"#ddd"}></Icon>
            </TouchableOpacity>
          );
        }
      },
    });
  };

   componentDidMount() {
     const {navigation} = this.props;
     navigation.addListener("focus",function() {
       this._customHeader();
       this._getRooms();
     }.bind(this))

  }

  _logout = () => {
    this.socket.disconnect();
    this.props.AuthenticationStore.removeToken();
  };

  _addChatRoom = () => {
    const { navigation } = this.props;
    navigation.navigate("AddChatRoom");
  };

  _getRooms = ()=>{
    axios.get(`${API_URL}/room/list`).then((res)=>{
      this.setState({rooms : res.data.data});
    }).catch((err)=>{
      console.log(err);
    });
  }

  _renderItem = ({item,index})=>{
    return (
     <RoomListItemComponent room={item}></RoomListItemComponent>
    )
  }

  render() {

    const {rooms,name} = this.state;

    return (
      <SafeAreaView style={{flex : 1,backgroundColor : "#f5f5f5"}}>
        <View style={styles.body}>
          <FlatList showsVerticalScrollIndicator={false} keyExtractor={(item)=>item.rm_id} data={rooms} renderItem={this._renderItem}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  body : {
    backgroundColor : "#f5f5f5",
    flex  :1
  }
})
