import * as Crypto from 'expo-crypto';

const cryptoPolyfill = {
    getRandomValues(array: Uint8Array): Uint8Array {
        if (!(array instanceof Uint8Array)) {
            throw new TypeError('Expected input to be an instance of Uint8Array');
        }

        const randomBytes = Crypto.getRandomBytes(array.length);

        for (let i = 0; i < randomBytes.length; i++) {
            array[i] = randomBytes[i];
        }

        return array;
    },
    subtle: {
        digest(algorithm: Crypto.CryptoDigestAlgorithm, data: ArrayBuffer): Promise<ArrayBuffer> {
            return Crypto.digestStringAsync(
                algorithm,
                String.fromCharCode(...new Uint8Array(data))
            ).then((hex) => Uint8Array.from(Buffer.from(hex, 'hex')).buffer);
        },
    },
};

if (typeof global.crypto === 'undefined') global.crypto = cryptoPolyfill as Crypto;
