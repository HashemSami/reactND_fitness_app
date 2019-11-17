import React from 'react';
import {View, Text, Slider, StyleSheet} from 'react-native'; 

export default function FitnessSlider ({max, unit, step, value, onChange}){
    // the information on the function is comming from the addEntry component
    return(
        <View style={styles.row}>
            <Slider
                // setting flex 1 to made the slider to take the full size of its perent
                style={{flex: 1}}
                step={step}
                value={value}
                maximumValue={max}
                minimumValue={0}
                onValueChange={onChange}
            />
            <View style={styles.metricCounter}>
                <Text style={{fontSize: 24, textAlign: 'center'}}>{value}</Text>
                <Text style={{fontSize: 13 , color: "gray"}}>{unit}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    metricCounter:{
        width: 85,
        justifyContent: 'center',
        alignItems: 'center'
    }
})