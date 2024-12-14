import { Stack } from 'expo-router';
import React from 'react';

const SendLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="amount" />
            <Stack.Screen name="done" />
            <Stack.Screen name="preview" />
            <Stack.Screen name="provide-address" />
            <Stack.Screen name="select-coin" />
        </Stack>
    );
};

export default SendLayout;
