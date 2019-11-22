import React, {Component} from 'react';
import{View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import{getMetricMetaInfo,
    timeToString,
    getDailyReminder,
    clearLocalNotification,
    setLocalNotification
    } from '../utils/helpers';
import FitnessSteppers from './FitnessStepper';
import FitnessSlider from './FitnessSlider';
import DateHeader from './DateHeader';
import {Ionicons} from '@expo/vector-icons';
import TextButton from './TextButton';
import {submitEntry, removeEntry} from '../utils/api';
import {connect} from 'react-redux';
import {addEntry} from '../actions';
import {white, purple} from '../utils/colors';
import {NavigationActions} from 'react-navigation';

function SubmitBtn({onPress}){
    return(
        <TouchableOpacity
        style={Platform.OS === "ios"? styles.iosSubmitBtn: styles.androidSubmitBtn}
        onPress={onPress}>
            <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component{
    state={
        run:0,
        bike:0,
        swim:0,
        sleep:0,
        eat:0,
    }

    // the increment method is for the run,bike,swim stat since thay will be added by numbers
    increment = (metric) =>{
        const {max, step} = getMetricMetaInfo(metric)
        
        this.setState((state) => {
            // getting the prvious state to decrement
            const count = state[metric] + step;
            return{
                ...state,
                [metric] : count < 0 ? 0 : count 
            }
        })

    } 

    decrement = (metric) =>{
        const {max, step} = getMetricMetaInfo(metric)
        
        this.setState((state) => {
            // getting the prvious state to increment
            const count = state[metric] - getMetricMetaInfo(metric).step;
            return{
                ...state,
                [metric] : count > max? max : count 
            }
        })

    } 

    // setting the slider value for the sleep and eat state
    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value,
        }))
    }

    submit = ()=>{
        // this will save the formated date from timeToString() function
        const key = timeToString();
        const entry = this.state;

        // update redux
        this.props.dispatch(addEntry({
            [key]: entry,
        }));

        this.setState(()=>({
            run:0,
            bike:0,
            swim:0,
            sleep:0,
            eat:0,
        }));

        // navigate to home
        this.toHome();

        // save to 'DB'
        submitEntry({key, entry});

        // clear local notification
        // if the user alredy submitted the stats for today
        // it will clear any other notification or it will not invoke the notification set
        // and then will set a new notification for tomorrow
        clearLocalNotification()
            // we didn't add the () on the function
            .then(setLocalNotification())

    }

    reset = () => {
        const key = timeToString();

        // update Redux
        this.props.dispatch(addEntry({
            [key]: getDailyReminder(),
        }));
        
        // route to Home
        this.toHome();


        // update 'DB'
        removeEntry(key);
    }

    // this will reset the AddEntry Component every time we submit or reset data
    // by nagivat to the same component
    toHome = () => {
        this.props.navigation.dispatch(NavigationActions.back({
            key: 'AddEntry'
        }))
    }

    
    render(){
        const metaInfo = getMetricMetaInfo();

        // this will be rendered if the user already entered his information for the day
        if(this.props.alreadyLogged){
            return(
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios'? 'ios-happy': 'md-happy'}
                        size={100}/>
                    <Text>You already logged your information for today</Text>
                    {/* fix a reset button by rendering our costom button */}
                    <TextButton style={{padding: 10}} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {/* <Text>{JSON.stringify(this.state)}</Text> */}
                {Object.keys(metaInfo).map((key)=>{
                    const { getIcon , type, ...rest} = metaInfo[key]
                    const value = this.state[key]

                    // this will the meta info to the sliders and steppers components
                    // depends on the type value
                    return (
                        <View key={key} style={styles.row}> 
                            {getIcon()}
                            {type === 'slider'
                            ?<FitnessSlider
                                value={value}
                                onChange = {(value) => this.slide(key, value)}
                                {...rest}/>
                            :<FitnessSteppers
                                value={value}
                                onIncrement = {() => this.increment(key)}
                                onDecrement = {() => this.decrement(key)}
                                {...rest}/>}
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>

        )
    }
}

const styles= StyleSheet.create({
    container:{
        flex: 1,
        padding:20, 
        backgroundColor: white,
    },
    row:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height:45,
        marginRight: 40,
        marginLeft: 40,

    },
    androidSubmitBtn:{
        backgroundColor: purple,
        padding: 10, 
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText:{
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    }
})

function mapStateToProps(state){
    const key = timeToString();
    return{
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry);
