import { AppState, AppStateStatus } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useStorageValues } from '@/hooks';
import Storage from '@/shared/adapters/storage';

const UserInactivityProvider = ({ children }: any) => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();
    const storage = new Storage();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, []);

    const handleAppStateChange = (state: AppStateStatus) => {
        if (state === 'inactive') {
            router.push('/(auth)/overlay');
        } else {
            if (router.canGoBack()) router.back();
        }

        if (!useStorageValues.getState().pin) return;

        if (state === 'background') {
            recordStartTime();
        } else if (state === 'active' && appState.current.match(/background/)) {
            const elapsed = Date.now() - Number(useStorageValues.getState().appLastInactive || 0);
            if (elapsed >= 3000) router.push('/(auth)/lock');
        }

        appState.current = state;
    };

    const recordStartTime = async () => {
        await storage.setPair('appLastInactive', Date.now().toString());
    };

    return children;
};

export default UserInactivityProvider;
