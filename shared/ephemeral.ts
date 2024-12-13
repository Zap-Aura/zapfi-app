import { useStorageValues } from '@/hooks';
import { EphemeralKeyPair } from '@aptos-labs/ts-sdk';
import Storage from './adapters/storage';

const storage = new Storage();

export const storeEphemeralKeyPair = async (ekp: EphemeralKeyPair): Promise<void> => {
    await storage.setPair('ephemeralKeyPair', EphemeralKeyPairEncoding.encode(ekp));
};

export const getLocalEphemeralKeyPair = (): EphemeralKeyPair | undefined => {
    try {
        const encodedEkp = useStorageValues.getState()['ephemeralKeyPair'];
        return encodedEkp ? EphemeralKeyPairEncoding.decode(encodedEkp) : undefined;
    } catch (error) {
        console.warn('Failed to decode ephemeral key pair from storage', error);
        return undefined;
    }
};

export const EphemeralKeyPairEncoding = {
    encode: (ekp: EphemeralKeyPair) => {
        return JSON.stringify(ekp, (_, e) => {
            if (typeof e === 'bigint') return { __type: 'bigint', value: e.toString() };
            if (e instanceof Uint8Array) return { __type: 'Uint8Array', value: Array.from(e) };
            if (e instanceof EphemeralKeyPair)
                return { __type: 'EphemeralKeyPair', data: e.bcsToBytes() };
            return e;
        });
    },
    decode: (encodedEkp: string) => {
        return JSON.parse(encodedEkp, (_, e) => {
            if (e && e.__type === 'bigint') return BigInt(e.value);
            if (e && e.__type === 'Uint8Array') return new Uint8Array(e.value);
            if (e && e.__type === 'EphemeralKeyPair') return EphemeralKeyPair.fromBytes(e.data);
            return e;
        });
    },
};
