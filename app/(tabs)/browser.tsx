import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Page = () => {
    return (
        <SafeAreaView className="bg-background h-full px-5">
            <ScrollView></ScrollView>
        </SafeAreaView>
    );
};

export default Page;
