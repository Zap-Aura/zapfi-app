import '@/shared/plugins/crypto';
import { useStorageValues } from '@/hooks';
import { router, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCallback, useEffect, useState } from 'react';
import Storage from '@/shared/adapters/storage';
import { UserInactivityProvider } from '@/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const queryClient = new QueryClient();
    const [shouldRenderApp, setShouldRenderApp] = useState<boolean>(false);

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
        (async function () {
            try {
                const pairs = await new Storage().loadValues();
                if (pairs) {
                    useStorageValues.setState(pairs);
                    if (pairs.address) router.push('/(auth)/lock');
                }
            } finally {
                setShouldRenderApp(true);
            }
        })();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (shouldRenderApp) await SplashScreen.hideAsync();
        if (fontLoaded || fontError) {
        }
    }, [fontLoaded, fontError, shouldRenderApp]);

    if (!shouldRenderApp) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <QueryClientProvider client={queryClient}>
                <UserInactivityProvider>
                    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(onboard)" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="index" />
                        <Stack.Screen name="receive" />
                        <Stack.Screen name="settings" />
                    </Stack>
                </UserInactivityProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
