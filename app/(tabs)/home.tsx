import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useStorageValues } from '@/hooks';
import Storage from '@/shared/adapters/storage';
import { Images } from '@/constants';

type ActionBtnsProps = {
    text: string;
    isFilled?: boolean;
    onClick: () => void;
};

const ActionBtns = ({ text, isFilled, onClick }: ActionBtnsProps) => {
    return (
        <TouchableOpacity
            className={`${
                isFilled ? 'bg-tertiary' : 'bg-transparent'
            } w-[31%] border border-tertiary rounded-full py-4`}
            onPress={onClick}
        >
            <Text
                className={`text-center font-geistmono-bold ${
                    isFilled ? 'text-background' : 'text-white'
                }`}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const Page = () => {
    const isBalanceHidden = useStorageValues((state) => state.isBalanceHidden);

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <ScrollView>
                <View className="flex-row items-center justify-between py-4">
                    <View>
                        <Text className="text-white font-geistmono-regular text-base">
                            Main Wallet (0x24...34454)
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-5 border-l border-white pl-5 py-1">
                        <TouchableOpacity onPress={() => router.push('/receive')}>
                            <Ionicons name="qr-code-outline" size={20} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/settings')}>
                            <AntDesign name="setting" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-start justify-between py-7">
                    <View className="w-[90%]">
                        <Text className="uppercase text-gray-300 font-inter-regular mb-4">
                            Total Balance
                        </Text>
                        <Text className="text-white text-4xl font-geistmono-bold">
                            {isBalanceHidden && isBalanceHidden === 'true' ? '$1,350.53' : '******'}
                        </Text>
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={async () => {
                                await new Storage().setPair(
                                    'isBalanceHidden',
                                    isBalanceHidden
                                        ? isBalanceHidden === 'true'
                                            ? 'false'
                                            : 'true'
                                        : 'false'
                                );
                            }}
                        >
                            {isBalanceHidden && isBalanceHidden === 'true' ? (
                                <Feather name="eye" size={22} color="#d1d5db" />
                            ) : (
                                <Feather name="eye-off" size={22} color="#d1d5db" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center gap-2 justify-between mb-10">
                    <ActionBtns text="Buy" onClick={() => {}} isFilled />
                    <ActionBtns text="Send" onClick={() => {}} />
                    <ActionBtns text="Receive" onClick={() => router.push('/receive')} />
                </View>

                <View className="rounded-lg p-6" style={{ backgroundColor: '#283132' }}>
                    <View className="flex-row items-center justify-between w-full">
                        <View className="flex-row items-center gap-4">
                            <View>
                                <Image
                                    source={Images.aptos}
                                    resizeMode="contain"
                                    className="h-12 w-12"
                                />
                            </View>
                            <View>
                                <Text className="font-inter-regular text-white mb-1.5">
                                    Aptos Coin
                                </Text>
                                <View className="flex-row gap-1.5 items-center">
                                    <Text className="font-geistmono-semi-bold text-white">
                                        $12.05
                                    </Text>
                                    <Text className="font-inter-medium text-green-400">4.83%</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text className="text-right text-gray-400 font-inter-regular mb-1.5">
                                1,000
                            </Text>
                            <Text className="text-right text-white font-geistmono-semi-bold">
                                $12,000.54
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
