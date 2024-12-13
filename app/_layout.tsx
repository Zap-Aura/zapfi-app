import '@/shared/plugins/crypto';
import { useStorageValues } from '@/hooks';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCallback, useEffect, useState } from 'react';
import Storage from '@/shared/adapters/storage';
import { UserInactivityProvider } from '@/providers';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [shouldRenderApp, setShouldRenderApp] = useState<boolean>(false);

    useEffect(() => {
        (async function () {
            try {
                const pairs = await new Storage().loadValues();
                if (pairs) useStorageValues.setState(pairs);
            } finally {
                setShouldRenderApp(true);
            }
        })();
    }, []);

    const onLayoutRootView = useCallback(() => {
        if (shouldRenderApp) SplashScreen.hide();
    }, [shouldRenderApp]);

    if (!shouldRenderApp) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <UserInactivityProvider>
                <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="index" />
                </Stack>
            </UserInactivityProvider>
        </GestureHandlerRootView>
    );
}
