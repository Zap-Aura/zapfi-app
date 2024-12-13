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
};

const useStorageValues = create<StorageStore>(() => ({
    network: null,
    ephemeralKeyPair: null,
    keylessAccount: null,
    address: null,
    emailAddress: null,
    isBalanceHidden: null,
    pin: null,
    appLastInactive: null,
}));

export default useStorageValues;
