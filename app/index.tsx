import { Alert, Text, TouchableOpacity, View } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import { Logo } from '@/components';
import { Colors } from '@/constants';
import { router } from 'expo-router';

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

                router.push('/(onboard)');
            }
        } catch (e: any) {
            Alert.alert(e.message || 'Unable to complete request!');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView className="bg-background flex-1 items-center justify-between py-3">
            <View className="flex w-full px-5 h-[80vh] items-center justify-center">
                <View className="mb-10">
                    <Logo />
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setIsLoading(true);
                        promptAsync();
                    }}
                    disabled={isLoading}
                    className="w-full flex flex-row items-center justify-center border border-gray-600 rounded-full py-7 gap-3"
                >
                    {isLoading ? (
                        <Text className="text-white font-geistmono-regular text-[17px]">
                            Loading...
                        </Text>
                    ) : (
                        <>
                            <Entypo name="google-" size={22} color={Colors.Tertiary} />
                            <Text className="text-white font-geistmono-regular text-[17px]">
                                Continue with Google
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center gap-3">
                <View className="w-8 h-[1px] bg-gray-500" />
                <Text className="text-white text-lg font-geistmono-semi-bold">Built for Aptos</Text>
                <View className="w-8 h-[1px] bg-gray-500" />
            </View>
        </SafeAreaView>
    );
};

export default Page;
