import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';
import AddEntry from './components/AddEntry';
import History from './components/History';
import FlexboxExamples from './components/FlexBoxExample';
import { createAppContainer } from "react-navigation";
import {createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import { purple, white } from './utils/colors';
import Constants from 'expo-constants';
import EntryDetail from './components/EntryDatail';

function CuctomStatusBar({backgroundColor, ...props}){
  return(
    <View style={{backgroundColor, height:Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props}/>
    </View>
  )
}

const RouteConfigs = {
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel:  'History',
      tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions:{
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
    }
  }
};
const TabNavigatorConfig =  {
  navigationOptions:{
    header:null
  },
  tabBarOptions:{
    activeTinColor: Platform.OS === 'ios'? purple : white,
    style:{
      height:56, backgroundColor: Platform.OS === 'ios'? white:purple,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset:{
        width: 0, 
        height:3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const TabContainer = Platform.OS === 'ios'? createBottomTabNavigator(RouteConfigs,TabNavigatorConfig)
  : createMaterialTopTabNavigator(RouteConfigs,TabNavigatorConfig);

const StackNavigator = {
  Home : {
    screen: TabContainer,
  },
  EntryDetail:{
    screen: EntryDetail,
    navigationOptions:{
      headerTintColor: white,
      headerStyle:{
        backgroundColor:purple,
      }
    }
  }
}


const MainNavigation = createAppContainer(createStackNavigator(StackNavigator))


export default class App extends React.Component {
  state={
    value:0
  }
  render(){
    return (
      <Provider store={createStore(reducer)}>
        <View style={{flex:1}}>
          <CuctomStatusBar backgroundColor={purple} barStyle='light-content'/>
          <MainNavigation/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft:10,
    marginRight:10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  btn: {
    backgroundColor:'#E53224',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff'
  }
})
