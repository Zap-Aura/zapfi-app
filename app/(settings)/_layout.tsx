import React from 'react';
import { Stack } from 'expo-router';

const SettingsLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="network" />
            <Stack.Screen name="preferred-browser" />
            <Stack.Screen name="security" />
        </Stack>
    );
};

export default SettingsLayout;
