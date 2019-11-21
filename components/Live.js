import React, {Component} from 'react';
import  {View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Foundation} from '@expo/vector-icons';
import {purple, white} from '../utils/colors';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {calculateDirection} from '../utils/helpers'

class Live extends Component{
    state={
        cords:null,
        status: null,
        direction: '',
        // used for animating the value
        bounceValue: new Animated.Value(1)
    }

    componentDidMount() {
        // we need to make sure that we have the user permission first 
        // so every time this component mount, it will ask for the user permission
        Permissions.getAsync(Permissions.LOCATION)
            .then(({status}) => {
                // if the status returned 'granted' run the setLocation method
                if(status === 'granted'){
                    // the setLocation() method will updated the state status to 'granted'
                    // and will updated withthe location every time the lacation changed
                    return this.setLocation()
                };
                // if the status is not 'granted', go aheadt and update the state 
                // with the status return
                this.setState(() => ({status}));
            })
            .catch((error) => {
                console.warn('Error getting Location permossion:', error)
                // if there is any errors the component will render the 'undetermined'page
                // to grant the user permission
                this.setState(() => ({status: 'undetrmined'}));
            })
    }

    askPermission = () => {
        // this method will ensable the user to set thier permissions when he click the enable button
        // it will return a status (same as getAsync), the will set the state based on the status
        Permissions.askAsync(Permissions.LOCATION)
            .then(({status}) => {
                if(status === 'granted') { 
                    return this.setLocation()
                }
                this.setState(() => ({status}))
            })
            .catch((error) => {
                console.warn('error asking Location permission: ', error)
            })

    }

    // this method will invoked when we have permission of the user location
    setLocation = () => {
        Location.watchPositionAsync({
            // give high accuracy for the lacation data
            enableHighAccuracy : true,
            // to update the location as fast as it can
            timeInterval: 1,
            distanceInterval: 1,
        }, ({coords}) => {
            // this function will be invoked every time the user change laction 
            // and it will pass the coordenated to it's arguments
            // will pass the coord.heading to helper function to get the string direction
            const newDirection = calculateDirection(coords.heading);
            const {direction, bounceValue} = this.state;

            if(newDirection !== direction){
                // to add a sequence of animations
                Animated.sequence([
                    Animated.timing(bounceValue, {duration: 200, toValue: 1.04}),
                    Animated.spring(bounceValue, {toValue: 1, friction:4})
                ]).start();
            }

            this.setState(() => ({
                coords,
                status: 'granted',
                direction: newDirection,
            }))
        })
    }
    render() {
        const {coords, status, direction, bounceValue} = this.state;

        if (status === null) {
            // the Activity Indecator is the loding spinner 
            // it will render a spinner like we are waiting on something
            return <ActivityIndicator style={{marginTop:30}}/>
        }

        if(status === 'denied') {
            return(
                <View style={styles.center}>
                    <Foundation name='alert' size={50} />
                    <Text>
                        You denide your location. You can fix this by visiting your settings location services for this app.
                    </Text>
                </View>
            )
        }

        if(status === 'undetermined') {
            return(
                <View style={styles.center}>
                    <Foundation name='alert' size={50} />
                    <Text>
                        You need to enable location sevices for this app.
                    </Text>
                    <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Enable
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return(
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Animated.Text 
                    style={[styles.direction, {transform: [{scale: bounceValue}]}]}>
                        {direction}
                    </Animated.Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color:white}]}>
                            Altitude
                        </Text>
                        <Text style={[styles.subHeader, {color:white}]}>
                            {/* to convert to feet */}
                            {Math.round(coords.altitude * 3.2808)} feet
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color:white}]}>
                            Speed
                        </Text>
                        <Text style={[styles.subHeader, {color:white}]}>
                            {(coords.speed * 2.2369).toFixed(1)} MPH
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'space-between'
    },
    center:{
        flex:1,
        justifyContent: 'center',
        marginLeft: 30, 
        marginRight: 30,
    },
    button:{
        padding: 10,
        backgroundColor: purple,
        alignSelf:'center',
        borderRadius: 5,
        margin:20,
    },
    buttonText:{
        color:white,
        fontSize: 20,
    },
    directionContainer:{
        flex: 1,
        justifyContent: 'center',
    },
    header:{
        fontSize:35,
        textAlign: 'center',
    },
    direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center'
    },
    metricContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple
    },
    metric:{
        flex:1,
        paddingTop: 15, 
        paddingBottom: 15, 
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop:20,
        marginBottom:20,
        marginLeft:10,
        marginRight:10
    }, 
    subHeader:{
        fontSize:25,
        textAlign: 'center',
        marginTop: 5,
    }
})

export default Live;