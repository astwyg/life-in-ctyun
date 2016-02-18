
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';
const Button = require('react-native-button');
import Storage from 'react-native-storage';
import Order from './order.js';

let storage = new Storage({
  //最大容量，默认值1000条数据循环存储
  size: 1000,    

  //数据过期时间，默认一整天（1000 * 3600 * 24秒）
  defaultExpires: null,

  //读写时在内存中缓存数据。默认启用。
  enableCache: true,

  //如果storage中没有相应数据，或数据已过期，
  //则会调用相应的sync同步方法，无缝返回最新数据。
  sync : {
    //同步方法的具体说明会在后文提到
  }
})  

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
    };
  }
  componentDidMount(){
    storage.load({
      key: "userAuth",
    }).then(data => {
      this.setState({
        username: data.username,
        password: data.password,
      })
    }).catch(err => {
      this.setState({
        username: "17710432234",
        password: "tmyi5177163",
      })
    });
  }
  _login(){
    fetch("http://life.ctyun.com.cn/admin/ajax/userLogin",{
      credentials: 'include', 
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: `{"userPhone": "${this.state.username}", "userPassword": "${this.state.password}"}`
    }).then((resp) => {
      if(resp.ok){
        resp.json().then((obj)=>{
          console.log(obj);
          if(obj.returnObj.isLogin){
            storage.save({
              key: "userAuth",
              rawData: { 
                username: this.state.username,
                password: this.state.password,
              },
              expires: null
            });
            const navigator = this.props.navigator;
            if (navigator){
              navigator.push({
                name: 'Order',
                component: Order,
                params: {
                  name: obj.returnObj.userRealname,
                  department: obj.returnObj.departmentName,
                }
              })
            }
          } else {
            ToastAndroid.show('用户名和密码好像不对唉', ToastAndroid.LONG);
          }
        });
      } else {
        ToastAndroid.show('网络不通, 只能在办公网使用.', ToastAndroid.LONG);
      }
    });
    return;
  }
  _regist(){
    ToastAndroid.show('注册到产品部找王佳', ToastAndroid.LONG);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          欢迎登陆天翼云订餐系统!
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
        <View style={{marginTop:5,flexDirection: 'row',}}>
          <Button
            style={{fontSize: 20, color: 'white',flex:1}}
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'red'}}
            onPress={this._regist}>
            注册
          </Button>
          <View style={{width: 10}}/>
          <Button
            style={{fontSize: 20, color: 'white', flex:1}}
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'blue'}}
            onPress={this._login.bind(this)}>
            登陆
          </Button>
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  cell: 
  {
    flex: 1,
  },
});

export default Login;
