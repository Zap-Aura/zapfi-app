import Storage from '@/shared/adapters/storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { create } from 'zustand';

type StorageStore = {
    network: string | null;
    ephemeralKeyPair: string | null;
    keylessAccount: string | null;
    address: string | null;
    emailAddress: string | null;
    isBalanceHidden: string | null;
    pin: string | null;
    appLastInactive: string | null;
    preferredBrowser: string | null;
    clear: () => Promise<void>;
};

const useStorageValues = create<StorageStore>((set) => ({
    network: null,
    ephemeralKeyPair: null,
    keylessAccount: null,
    address: null,
    emailAddress: null,
    isBalanceHidden: null,
    pin: null,
    appLastInactive: null,
    preferredBrowser: null,
    clear: async () => {
        Alert.alert(
            '🚧🚨🚨🚨🚧\nSign Out of All Wallets?',
            'This will erase all settings. Not to fret, once you sign in with your Google account your wallet will be loaded back.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    isPreferred: true,
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await new Storage().clear();
                        set({
                            network: null,
                            ephemeralKeyPair: null,
                            keylessAccount: null,
                            address: null,
                            emailAddress: null,
                            isBalanceHidden: null,
                            pin: null,
                            appLastInactive: null,
                            preferredBrowser: null,
                        });

                        router.replace('/');
                    },
                },
            ]
        );
    },
}));

export default useStorageValues;
