import React,{
    View,
    Navigator,
    AppRegistry,
} from 'react-native';
import Login from './pages/login';

class Life extends React.Component {

    render() {
        let defaultName = 'Login';
        let defaultComponent = Login;
        return (
        <Navigator
          initialRoute={{ name: defaultName, component: defaultComponent }}
          configureScene={() => {
            return Navigator.SceneConfigs.VerticalDownSwipeJump;
          }}
          renderScene={(route, navigator) => {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} />
          }} />
        );

    }
}

AppRegistry.registerComponent('life', () => Life);