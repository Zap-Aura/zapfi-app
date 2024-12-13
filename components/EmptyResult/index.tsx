import { View, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const EmptyResult = () => {
    return (
        <View className="items-center justify-center min-h-[65vh] gap-2">
            <MaterialCommunityIcons name="mailbox-open-up-outline" size={40} color="#d1d5db" />
            <Text className="font-geistmono-light text-white text-lg">Nothing here...</Text>
        </View>
    );
};

export default EmptyResult;
