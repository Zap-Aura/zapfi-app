import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { truncateAddress } from '@/shared/uitls';
import { useApp } from '@/hooks';
import { TextInput } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';

const Page = () => {
    const [amount, setAmount] = useState<number>(0);
    const [META, setMETA] = useState<any>();
    const { coin, address } = useLocalSearchParams();
    const coins = useApp((state) => state.coins);

    useEffect(() => {
        if (!coins || !coins) return;
        setMETA(coins.find((item) => item.asset_type === coin));
    }, [coins, coin]);

    return (
        <SafeAreaView className="bg-background h-full">
            <ScrollView className="px-5">
                <View className="py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-[17px] left-0 z-20"
                    >
                        <Ionicons name="chevron-back-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white font-geistmono-bold text-2xl text-center">
                        Enter Amount
                    </Text>
                </View>

                <View className="my-6">
                    <Text className="text-white font-geistmono-regular">
                        To: {truncateAddress(address as string)}
                    </Text>
                </View>

                <View>
                    <View className="w-full h-16 items-center px-6 border-[0.8px] border-tertiary bg-background rounded-full flex-row">
                        <TextInput
                            placeholder="Amount"
                            value={String(amount)}
                            className="flex-1 font-geistmono-medium text-[15px] text-white h-full text-center"
                            placeholderTextColor={'#aaa'}
                            onChangeText={(e) => setAmount(Number(e))}
                        />
                    </View>
                    <Text className="text-center mt-4 font-geistmono-bold text-lg text-white">
                        {META?.metadata.symbol}
                    </Text>
                </View>
            </ScrollView>

            <View>
                {META && amount > META.balance ? (
                    <View className="px-5 flex-row items-center justify-between py-1">
                        <Feather name="alert-octagon" size={24} color="#dc2626" />
                        <Text className="text-red-600 font-inter-semi-bold">
                            Insufficient balance, please try another
                        </Text>
                    </View>
                ) : null}

                <View className="p-5 flex-row items-center justify-between">
                    <View>
                        <Text className="font-inter-regular text-gray-300 mb-1.5">Balance:</Text>
                        <Text className="font-geistmono-semi-bold text-white">
                            {META?.balance} {META?.metadata?.symbol}
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="bg-[#283132] border border-gray-500 px-5 py-3 rounded-full"
                        onPress={() => setAmount(META?.balance || 0)}
                    >
                        <Text className="font-inter-regular text-white">Max</Text>
                    </TouchableOpacity>
                </View>
                <View className="p-5 border-t border-gray-600">
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/(send)/preview',
                                params: { coin, address, amount },
                            });
                        }}
                        className={`bg-secondary w-full py-5 rounded-full items-center justify-center ${
                            amount === 0 || (META && amount > META.balance)
                                ? 'opacity-50'
                                : 'opacity-100'
                        }`}
                        disabled={amount === 0 || (META && amount > META.balance)}
                    >
                        <Text className="font-geistmono-semi-bold text-lg">Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Page;
