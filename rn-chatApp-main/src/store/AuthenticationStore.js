import { action, makeAutoObservable, observable } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationService from "../NavigationService";

class AuthenticationStore {

  token = null;
  isSuper = null;
  name = null;

  constructor() {
    makeAutoObservable(this,{
      token : observable,
      isSuper : observable,
      saveToken : action,
      getToken : action,
      removeToken : action
    })
  }

  async saveToken (token,isSuper,name){
    try {
      await AsyncStorage.setItem("token",token);
      await AsyncStorage.setItem("isSuper",isSuper.toString());
      this.token = token;
      this.isSuper = isSuper;
      this.name = name;
      this.redirectControl();
    }catch (e) {
      console.log(e);
    }
  }

  async getToken(){
    try{
      let token = await AsyncStorage.getItem("token");
      let isSuper = await AsyncStorage.getItem("isSuper");
      this.token = token;
      this.isSuper = isSuper;
      this.redirectControl();
    }catch (e){
      console.log(e);
    }
  }

  async removeToken(){
    try{
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("isSuper");
      this.token = null;
      this.redirectControl();
    }catch (e){
      console.log(e);
    }
  }

  redirectControl = ()=>{
    if (!this.token){
      NavigationService.navigate("Login");
      return false;
    }
    NavigationService.navigate("Home");
  }
}

export default new AuthenticationStore();
