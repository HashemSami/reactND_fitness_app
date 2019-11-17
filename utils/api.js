// this is an api file to control the DB
// we are using AsyncStorage to set a local storage in the user browser 
// that can be saved even if the browser was closed
// AsuncStorage has three methods {getItem, mergeItem, setItem}
import {AsyncStorage} from 'react-native';
import {CALENDAR_STORAGE_KEY, formatCalendarResults} from './_calendar';

// This function will grab the calendar data from the fake data onthe _calendar.js
export function fetchCalendarResults (){
    AsyncStorage.clear()
    return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
        .then(formatCalendarResults)
}


export function submitEntry(entry, key){
    return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
        [key]: entry,
    }))

}

export function removeEntry(key){
    return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
        .then((results) => {
            const data = JSON.parse(results);
            data[key] = undefined;
            delete data[key];
            AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
        })
}