import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="lock" />
            <Stack.Screen name="overlay" />
        </Stack>
    );
};

export default AuthLayout;
