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
  ListView,
  Image,
} from 'react-native';
const Button = require('react-native-button');


class Order extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	orderMealStartTime: "loading",
    	orderMealEndTime: "loading",
    	todayMenu: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    }
  }
  componentDidMount(){
  	//读取用户信息
  	fetch("http://life.ctyun.com.cn/ajax/queryorderMealConfig",{
    	credentials: 'include',
    	method: "POST",
	    headers: {
	      "Content-Type": "application/x-www-form-urlencoded"
	    },
	    body: "{}"
    }).then((resp)=>{
    	if(resp.ok){
    		resp.json().then((obj)=>{
    			this.setState({
			      orderMealStartTime: obj.returnObj.orderMealStartTime,
			      orderMealEndTime: obj.returnObj.orderMealEndTime,
			    });
    		});
    	}
    });
    //读取今日菜单
    fetch("http://life.ctyun.com.cn/ajax/getTodayMeal",{
    	credentials: 'include',
    	method: "POST",
    	headers: {
	      "Content-Type": "application/json"
	    },
	    body: `{"pageSize": 16, "pageNo": 1, "query": {}}`
    }).then((resp) => {
    	if (resp.ok){
    		resp.json().then((obj) => {
    			this.setState({
    				todayMenu: this.state.todayMenu.cloneWithRows(obj.returnObj.result),
    				loaded: true,
    			});
    		})
    	}
    });

  }
  _logout(){
  	const navigator = this.props.navigator;
  	if(navigator)
      navigator.pop();
  }
  _check(id){
  	fetch("http://life.ctyun.com.cn/ajax/takeOrder",{
  		credentials: 'include',
  		method: "POST",
  		headers: {
	      "Content-Type": "application/json"
	    },
	    body: `{"addressId": 2, "id": ${id}}`
  	}).then((resp) => {
  		if(resp.ok){
  			resp.json().then((obj) => {
    			ToastAndroid.show(obj.returnObj.msg, ToastAndroid.SHORT);
    		})
  		}
  	});
  }
	render() {
		console.log(this.state.loaded);
		return (
			<View>
	      <View style={{flexDirection: 'row', margin:5}}>
	      	<Text style={styles.topText} numberOfLines={2} >
		        欢迎{this.props.name}({this.props.department}) {'\n'}
		        今日订餐时间为{this.state.orderMealStartTime} - {this.state.orderMealEndTime}
		      </Text>
	      	<Button
            style={{fontSize: 20, color: 'white', flex:1}}
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'red'}}
            onPress={this._logout.bind(this,)}>
            注销
          </Button>
        </View>
        {this.state.loaded?
        <ListView
	        dataSource={this.state.todayMenu}
	        renderRow={this.renderMenu.bind(this)}
	        style={styles.listView} />
        :
        <View style={styles.container}>
	        <Text>
	          Loading menu...
	        </Text>
	      </View>
        }
        
			</View>
		);
	}
	renderMenu(menu) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: menu.path}}
          style={styles.thumbnail} />
        <View style={styles.rightContainer}>
          <Text style={styles.mealName}>{menu.mealName}</Text>
          <Text style={styles.remainingNum}>还剩: {menu.remainingNum} 份</Text>
        </View>
        <Button
          style={{fontSize: 15, color: 'white'}}
          containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'blue'}}
          onPress={this._check.bind(this,menu.id)}>
          订餐
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topText: {
    fontSize: 18,
    color: "black",
    backgroundColor: 'gray',
    flex:1,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 5,
  },
  mealName: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  remainingNum: {
    textAlign: 'left',
  },
  thumbnail: {
    width: 81,
    height: 81,
  },
  rightContainer: {
    flex: 1,
  },
});

export default Order;
