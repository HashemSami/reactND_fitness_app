import React from 'react';
import {
  View,
  StyleSheet,
  Platform
} from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';
import AddEntry from './components/AddEntry';
import History from './components/History';
import FlexboxExamples from './components/FlexBoxExample';
import {TabNavigator} from 'react-navigation';
import {FontAwesome, Ionicons} from '@expo/vector-icons';

const tab = TabNavigator({
  History: {
    screen: History,
    navigationOptions: {
      tabBarLable:  'History',
      tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions:{
      tabBarLable: 'Add Entry',
      tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
    }
  }
})


export default class App extends React.Component {
  state={
    value:0
  }
  render(){
    return (
      <Provider store={createStore(reducer)}>
        <View style={{flex:1}}>
          <View style={{height: 20}}/>
          <History/>
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
