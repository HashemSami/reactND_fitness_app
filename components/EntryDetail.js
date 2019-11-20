import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {white} from '../utils/colors';
import MerticCard from './MetricCard';
import {addEntry} from '../actions';
import {removeEntry} from '../utils/api';
import {timeToString, getDailyReminder} from '../utils/helpers';
import TextButton from './TextButton';

class EntryDetail extends Component{
    static navigationOptions = ({navigation}) => {
        const {entryId} = navigation.state.params;
        const year =entryId.slice(0,4);
        const month = entryId.slice(5,7);
        const day = entryId.slice(8);

        return{
            title: `${month}/${day}/${year}`
        }
    }

    // this method will reset the entry details to null 
    reset = () =>{
        const {remove, goBack, entryId} = this.props
        
        remove()
        goBack()
        removeEntry(entryId)   
    }

    // this will sheck the entry if the component need to rerender after setting the entry to null 
    shouldComponentUpdate(nextProps){
        // it will return tru or false
        return nextProps.metrics !== null && !nextProps.metrics.today;

    }
    render(){
        const {metrics} = this.props;

        return(
            <View style={styles.container}>
                <MerticCard metrics={metrics}/>
                <TextButton onPress={this.reset} style={{margin:20}}>
                    RESET
                </TextButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: white,
        padding: 15,
    }
})

function mapStateToProps(state,{navigation}){
    const {entryId} = navigation.state.params;

    return{
        entryId,
        metrics: state[entryId]
    }
}

function mapDispatchToProps(dispatch, {navigation}){
    const {entryId} = navigation.state.params;

    return{
        remove: () => dispatch(addEntry({
            [entryId]: timeToString() === entryId
                ? getDailyReminder()
                : null
        })),
        goBack: () => navigation.goBack(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (EntryDetail);