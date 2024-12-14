import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp, useStorageValues } from '@/hooks';
import { Images } from '@/constants';
import { truncateAddress } from '@/shared/uitls';
import aptos from '@/shared/adapters/aptos';
import { getSecureKeylessAccount } from '@/shared/keyless';

const Page = () => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const { coin, address, amount } = useLocalSearchParams();
    const [META, setMETA] = useState<any>();
    const coins = useApp((state) => state.coins);
    const load = useApp((state) => state.load);

    const network = useStorageValues((state) => state.network);
    const myAddress = useStorageValues((state) => state.address);

    useEffect(() => {
        if (!coins || !coins) return;
        setMETA(coins.find((item) => item.asset_type === coin));
    }, [coins, coin]);

    async function send() {
        const keylessAccount = await getSecureKeylessAccount();
        if (!keylessAccount) return;

        setIsSending(true);

        const transaction = await aptos.transferCoinTransaction({
            sender: myAddress!,
            recipient: address as string,
            amount: Number(amount) * 10 ** (META?.metadata?.decimals || 8),
            coinType: coin as any,
        });

        const committedTxn = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction,
        });

        const committedTransactionResponse = await aptos.waitForTransaction({
            transactionHash: committedTxn.hash,
        });

        if (committedTransactionResponse.success) {
            await load();

            router.push({
                pathname: '/(send)/done',
                params: { hash: committedTransactionResponse.hash },
            });
        } else {
            Alert.alert(committedTransactionResponse.vm_status);
        }

        setIsSending(false);
    }

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <ScrollView>
                <View className="py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-[17px] left-0 z-20"
                    >
                        <Ionicons name="chevron-back-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white font-geistmono-bold text-2xl text-center">
                        Confirm
                    </Text>
                </View>

                <View className="mt-6">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Image
                                source={
                                    META?.asset_type === '0x1::aptos_coin::AptosCoin'
                                        ? Images.aptos
                                        : Images.loading
                                }
                                resizeMode="contain"
                                className="h-12 w-12"
                            />
                            <Text className="font-inter-regular text-gray-300 text-lg">
                                {META?.metadata?.name}
                            </Text>
                        </View>

                        <Text className="font-geistmono-semi-bold text-white">
                            {amount} {META?.metadata?.symbol}
                        </Text>
                    </View>

                    <View className="h-12 w-12 items-center justify-center my-4">
                        <Ionicons name="arrow-down-outline" size={24} color="#fff" />
                    </View>

                    <View className="flex-row items-center gap-3">
                        <Image
                            source={{
                                uri: `https://api.dicebear.com/9.x/shapes/png?seed=${address}`,
                            }}
                            resizeMode="contain"
                            className="h-12 w-12 rounded-full"
                        />
                        <Text className="font-geistmono-semi-bold text-white text-lg">
                            {truncateAddress(address as string)}
                        </Text>
                    </View>

                    <View className="mt-8 pt-8 border-t border-gray-500 gap-5">
                        <View className="flex-row items-center justify-between">
                            <Text className="font-inter-regular text-gray-300">Address Used</Text>
                            <Text className="font-geistmono-semi-bold text-white">
                                {truncateAddress(myAddress!)}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className="font-inter-regular text-gray-300">Network</Text>
                            <Text className="font-geistmono-semi-bold text-white">
                                {network === 'testnet'
                                    ? 'Testnet'
                                    : network === 'mainnet'
                                    ? 'Mainnet'
                                    : 'Devnet'}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className="font-inter-regular text-gray-300">Network Fee</Text>
                            <Text className="font-geistmono-semi-bold text-white">{'--'} APT</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View>
                <TouchableOpacity
                    onPress={send}
                    className={`bg-secondary w-full py-5 rounded-full items-center justify-center ${
                        isSending ? 'opacity-50' : 'opacity-100'
                    }`}
                    disabled={isSending}
                >
                    <Text className="font-geistmono-semi-bold text-lg">Confirm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Page;
