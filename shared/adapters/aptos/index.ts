import { useStorageValues } from '@/hooks';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export default (function () {
    let network;

    switch (useStorageValues().network) {
        case 'mainnet':
            network = Network.MAINNET;

        case 'testnet':
            network = Network.TESTNET;

        case 'devnet':
            network = Network.DEVNET;

        default:
            network = Network.TESTNET;
    }

    return new Aptos(new AptosConfig({ network }));
})();
