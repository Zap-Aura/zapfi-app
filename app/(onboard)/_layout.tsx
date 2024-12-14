import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import { useStorageValues } from '@/hooks';

const OnboardLayout = () => {
    useEffect(() => {
        if (!useStorageValues.getState().address) return router.push('/');
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
            <Stack.Screen name="index" />
        </Stack>
    );
};

export default OnboardLayout;
