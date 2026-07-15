import React, { Component } from 'react'
import { StyleSheet, Text, View } from "react-native";
export default class MessageListItem extends Component {

  constructor() {
    super();
  }

  render() {

    const {item,token} = this.props;

    return (
      <View style={[styles.body,{
        justifyContent: (item.mg_user != token) ? "flex-start" : "flex-end",
      }]}>
        <View style={[styles.item,{
          backgroundColor: (item.mg_user != token) ? "white" : "#d5ffb4",
        }]}>
          <Text style={styles.receiver}>{item.mg_text}</Text>
          <Text style={styles.sender}>Gönderen: {item.name}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body : {
    marginHorizontal: 10,
    marginVertical: 13,
    flexDirection: "row",
  },
  item : {
    padding: 10,
    borderRadius: 10,
    flexDirection: "column",
  },
  receiver : { fontSize: 15, color: "black" },
  sender : { fontSize: 13, color: "black", marginTop: 12 }

});
