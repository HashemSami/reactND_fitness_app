import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { purple } from '../utils/colors';

export default function TextButton({children, onPress, style={}}){
    return(
        <TouchableOpacity onPress={onPress}>
            <Text style={[{textAlign: 'center', color: purple}, style]}>{children}</Text>
        </TouchableOpacity>
    )

}