import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {receiveEntries, addEntry} from '../actions';
import {getDailyReminder, timeToString} from '../utils/helpers';
import {fetchCalendarResults} from '../utils/api';
import UdacityFitnessCalendar from 'udacifitness-calendar';
import DateHeader from './DateHeader';
import MetricCard from './MetricCard';
import { white } from '../utils/colors';
import {AppLoading} from 'expo';

class History extends Component{
    state={
        ready: false
    }
    componentDidMount(){
        const {dispatch} = this.props;
        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            // then will take the entry and perform some functionality on it
            .then(({entries}) => {
                // if the current entry does not exsist
                if(!entries[timeToString()]){
                    // if is not there will add it to redux data
                    dispatch(addEntry({
                        [timeToString()] : getDailyReminder()
                    }))
                }
            })
            .then(() => this.setState(() => ({
                ready : true
            })))
    }

    // change the curly braces to parens to get an emediate return
    renderItem = ({today, ...metrics}, formattedDate, key) => (
        <View style={styles.item}>
            {today
            ?<View>
                <DateHeader date={formattedDate}/>
                <Text style={styles.noDataText}>
                    {today}
                </Text>
            </View>
            : <TouchableOpacity onPress={()=> console.log('pressed')}>
                <MetricCard date={formattedDate} metrics={metrics}/>
                </TouchableOpacity>}
        </View>
    )



    renderEmptyDate(formattedDate){
        return(
            <View style={styles.item}>
                 <DateHeader date={formattedDate}/>
                <Text style={styles.noDataText}>No data for this day</Text>
            </View>
        )

    }

    render(){
        const {entries}= this.props;
        const {ready} = this.state;

        if(!ready){
            return <AppLoading/>
        }
        return(
            <UdacityFitnessCalendar
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
            />
        )
    }
}

const styles = StyleSheet.create({
    item:{
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios'? 16: 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
            width:0,
            height:3
        }
    },
    noDataText:{
        fontSize:20,
        paddingTop: 20,
        paddingBottom:20
    }
})

function mapStateToProps(entries){
    console.log(entries)
    return {
        entries
    }
}

export default connect(mapStateToProps) (History);