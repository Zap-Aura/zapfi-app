import { Text, TouchableOpacity, View } from 'react-native';
import { EphemeralKeyPair } from '@aptos-labs/ts-sdk';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    EphemeralKeyPairEncoding,
    getLocalEphemeralKeyPair,
    storeEphemeralKeyPair,
} from '@/shared/ephemeral';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_iOS_CLIENT_ID } from '@/shared/Env';
import aptos from '@/shared/adapters/aptos';
import { useStorageValues } from '@/hooks';
import Storage from '@/shared/adapters/storage';
import { storeKeylessAccount } from '@/shared/keyless';

WebBrowser.maybeCompleteAuthSession();

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ephemeralKeyPair, setEphemeralKeyPair] = useState<EphemeralKeyPair>();
    const _currentEphemeralKeyPair = useStorageValues((state) => state.ephemeralKeyPair);

    useEffect(() => {
        (async function () {
            const currentEphemeralKeyPair = _currentEphemeralKeyPair;
            let _ephemeralKeyPair: EphemeralKeyPair;

            if (currentEphemeralKeyPair) {
                try {
                    _ephemeralKeyPair = EphemeralKeyPairEncoding.decode(currentEphemeralKeyPair);

                    if (!_ephemeralKeyPair.isExpired()) {
                        return setEphemeralKeyPair(_ephemeralKeyPair);
                    }
                } catch (e) {
                    console.error('Error decoding existing ephemeral key pair:', e);
                }
            }

            _ephemeralKeyPair = EphemeralKeyPair.generate();

            setEphemeralKeyPair(_ephemeralKeyPair);
            await storeEphemeralKeyPair(_ephemeralKeyPair);
        })();
    }, [_currentEphemeralKeyPair]);

    const [_, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: GOOGLE_iOS_CLIENT_ID,
        responseType: 'id_token',
        scopes: ['openid', 'email', 'profile'],
        extraParams: { ...(ephemeralKeyPair ? { nonce: ephemeralKeyPair.nonce } : {}) },
    });

    useEffect(() => {
        if (ephemeralKeyPair) completeGoogleSignIn();
    }, [response, ephemeralKeyPair]);

    async function completeGoogleSignIn() {
        try {
            if (response?.type === 'success') {
                const { authentication } = response;
                const idToken = authentication?.idToken;
                if (!idToken || !ephemeralKeyPair) return;

                const payload = jwtDecode<{ nonce: string }>(idToken);
                const nonce = payload.nonce;

                const ekp = getLocalEphemeralKeyPair();

                if (!ekp || ekp.nonce !== nonce) throw new Error('Ephemeral key pair not found ');
                if (ekp.isExpired()) throw new Error('Ephemeral key pair has expired');

                const keylessAccount = await aptos.deriveKeylessAccount({
                    jwt: idToken,
                    ephemeralKeyPair,
                });

                const storage = new Storage();

                await Promise.all([
                    storage.multiSetPair({
                        address: keylessAccount.accountAddress.toString(),
                        emailAddress: (payload as any).email,
                    }),
                    storeKeylessAccount(keylessAccount),
                ]);

                // redirect to dashboard here
                // other states will be updated too for this to take effect
            }
        } catch (e) {
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
        </View>
    );
};

export default Page;
