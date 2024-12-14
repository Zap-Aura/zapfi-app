import { useStorageValues } from '@/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
    private keys: string[];

    constructor() {
        this.keys = [
            'network',
            'ephemeralKeyPair',
            'keylessAccount',
            'address',
            'emailAddress',
            'isBalanceHidden',
            'pin',
            'appLastInactive',
            'preferredBrowser',
        ];
    }

    async multiSetPair(data: Record<string, string>) {
        try {
            await AsyncStorage.multiSet(Object.entries(data));
            useStorageValues.setState({ ...data });
        } catch (e) {
            console.error(e);
        }
    }

    async loadValues() {
        try {
            const values = await AsyncStorage.multiGet(this.keys);
            return Object.fromEntries(values);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async setPair(key: string, value: string) {
        try {
            await AsyncStorage.setItem(key, value);
            useStorageValues.setState({ [key]: value });
        } catch (e) {
            console.error(e);
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error(e);
        }
    }
}
