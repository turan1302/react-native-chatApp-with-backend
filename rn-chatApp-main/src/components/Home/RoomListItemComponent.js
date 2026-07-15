import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as NavigationService from "../../NavigationService";

export default class RoomListItemComponent extends Component {
  render() {

    const {room} = this.props;

    return (
      <TouchableOpacity onPress={()=>{
        NavigationService.navigate("Detail",{
          room_id : room.rm_id,
          room_name : room.rm_name
        });
      }}>
        <View style={styles.body}>
          <Icon name={"log-in-outline"} color={"black"} size={30}/>
         <View style={{marginLeft : 13,flex : 1}}>
           <Text style={styles.text}>{room.rm_name}</Text>
           <Text>Oluşturan: {room.name}</Text>
         </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  body : {
    flexDirection : "row",
    alignItems : "center",
    backgroundColor : "#fff",
    marginHorizontal : 5,
    marginVertical : 4,
    padding : 15,
    shadowColor : "#000",
    shadowOffset : {
      height : 2,
      width : 0
    },
    elevation : 5,
    shadowOpacity : 0.25,
    shadowRadius : 3.84,
    borderRadius : 8
  },
  text : {
    color : "black",
    fontSize : 20
  }
})
