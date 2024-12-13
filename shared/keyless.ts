import { KeylessAccount } from '@aptos-labs/ts-sdk';
import Storage from './adapters/storage';
import { useStorageValues } from '@/hooks';

const storage = new Storage();

export const storeKeylessAccount = async (account: KeylessAccount): Promise<void> => {
    await storage.setPair('keylessAccount', encodeKeylessAccount(account));
};

export const getSecureKeylessAccount = async (): Promise<KeylessAccount | undefined> => {
    try {
        const encodedAccount = useStorageValues.getState()['keylessAccount'];
        return encodedAccount ? decodeKeylessAccount(encodedAccount) : undefined;
    } catch (error) {
        console.warn('Failed to decode account from storage', error);
        return undefined;
    }
};

export const encodeKeylessAccount = (account: KeylessAccount): string => {
    return JSON.stringify(account, (_, e) => {
        if (typeof e === 'bigint') return { __type: 'bigint', value: e.toString() };
        if (e instanceof Uint8Array) return { __type: 'Uint8Array', value: Array.from(e) };
        if (e instanceof KeylessAccount) return { __type: 'KeylessAccount', data: e.bcsToBytes() };
        return e;
    });
};

export const decodeKeylessAccount = (encodedAccount: string): KeylessAccount => {
    return JSON.parse(encodedAccount, (_, e) => {
        if (e && e.__type === 'bigint') return BigInt(e.value);
        if (e && e.__type === 'Uint8Array') return new Uint8Array(e.value);
        if (e && e.__type === 'KeylessAccount') return KeylessAccount.fromBytes(e.data);
        return e;
    });
};
