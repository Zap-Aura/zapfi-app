import { useApp, useStorageValues } from '@/hooks';
import { router, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { UserInactivityProvider } from '@/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const queryClient = new QueryClient();
    const address = useStorageValues((state) => state.address);
    const pin = useStorageValues((state) => state.pin);
    const isMounting = useApp((state) => state.isMounting);
    const load = useApp((state) => state.load);
    const isUnlocked = useApp((state) => state.isUnlocked);

    const [fontLoaded, fontError] = useFonts({
        'GeistMono-Black': require('../assets/fonts/Geist_Mono/static/GeistMono-Black.ttf'),
        'GeistMono-Bold': require('../assets/fonts/Geist_Mono/static/GeistMono-Bold.ttf'),
        'GeistMono-ExtraBold': require('../assets/fonts/Geist_Mono/static/GeistMono-ExtraBold.ttf'),
        'GeistMono-ExtraLight': require('../assets/fonts/Geist_Mono/static/GeistMono-ExtraLight.ttf'),
        'GeistMono-Light': require('../assets/fonts/Geist_Mono/static/GeistMono-Light.ttf'),
        'GeistMono-Medium': require('../assets/fonts/Geist_Mono/static/GeistMono-Medium.ttf'),
        'GeistMono-Regular': require('../assets/fonts/Geist_Mono/static/GeistMono-Regular.ttf'),
        'GeistMono-SemiBold': require('../assets/fonts/Geist_Mono/static/GeistMono-SemiBold.ttf'),
        'GeistMono-Thin': require('../assets/fonts/Geist_Mono/static/GeistMono-Black.ttf'),
        'Inter-Light': require('../assets/fonts/Inter/static/Inter_28pt-Light.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter/static/Inter_28pt-Medium.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter/static/Inter_28pt-Regular.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter/static/Inter_28pt-SemiBold.ttf'),
    });

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        (async () => {
            if (fontLoaded || fontError) {
                if (!isMounting) {
                    await SplashScreen.hideAsync();
                    if (address && !pin) router.replace('/(onboard)');
                    if (address && pin && !isUnlocked) router.replace('/(auth)/lock');
                }
            }
        })();
    }, [fontLoaded, fontError, address, pin, isMounting, isUnlocked]);

    if ((!fontLoaded && !fontError) || isMounting) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <UserInactivityProvider>
                    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(onboard)" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(send)" />
                        <Stack.Screen name="(settings)" />
                        <Stack.Screen name="index" />
                        <Stack.Screen name="buy" />
                        <Stack.Screen name="receive" />
                        <Stack.Screen name="settings" />
                    </Stack>
                </UserInactivityProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
