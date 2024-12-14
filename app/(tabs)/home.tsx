import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useApp, useStorageValues } from '@/hooks';
import Storage from '@/shared/adapters/storage';
import { Images } from '@/constants';
import { truncateAddress } from '@/shared/uitls';

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
    const address = useStorageValues((state) => state.address);
    const portfolioBalance = useApp((state) => state.portfolioBalance);
    const coins = useApp((state) => state.coins);

    return (
        <SafeAreaView className="bg-background h-full px-5">
            <ScrollView>
                <View>
                    <View className="flex-row items-center justify-between py-4">
                        <View>
                            <Text className="text-white font-geistmono-regular text-base">
                                Main Wallet ({truncateAddress(address!)})
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
                                {isBalanceHidden
                                    ? isBalanceHidden === 'false'
                                        ? `$${(portfolioBalance || 0).toLocaleString()}`
                                        : '******'
                                    : `$${(portfolioBalance || 0).toLocaleString()}`}
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
                                            : 'true'
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
                        <ActionBtns text="Buy" onClick={() => router.push('/buy')} isFilled />
                        <ActionBtns
                            text="Send"
                            onClick={() => router.push('/(send)/select-coin')}
                        />
                        <ActionBtns text="Receive" onClick={() => router.push('/receive')} />
                    </View>
                </View>

                <View className="rounded-lg p-6 bg-[#283132] mb-4">
                    {coins?.map((item, idx) => (
                        <View
                            key={item.storage_id}
                            className={`flex-row items-center justify-between w-full ${
                                idx === coins.length - 1 ? 'mb-0' : 'mb-[34px]'
                            }`}
                        >
                            <View className="flex-row items-center gap-4">
                                <View>
                                    <Image
                                        source={
                                            item.asset_type === '0x1::aptos_coin::AptosCoin'
                                                ? Images.aptos
                                                : Images.loading
                                        }
                                        resizeMode="contain"
                                        className="h-12 w-12"
                                    />
                                </View>
                                <View>
                                    <Text className="font-inter-regular text-white mb-1.5">
                                        {item.metadata?.name || 'Unknown Token'}
                                    </Text>
                                    <View className="flex-row gap-2 items-center">
                                        <Text className="font-geistmono-semi-bold text-white">
                                            ${item.price.toFixed(2)}
                                        </Text>
                                        {item.change24h > 0 ? (
                                            <Text className="font-inter-medium text-green-400">
                                                {item.change24h.toFixed(2)}%
                                            </Text>
                                        ) : (
                                            <Text className="font-inter-medium text-red-400">
                                                {item.change24h.toFixed(2)}%
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text className="text-right text-gray-400 font-inter-regular mb-1.5">
                                    {item.balance.toLocaleString()}
                                    &nbsp;
                                    {item.metadata?.symbol}
                                </Text>
                                <Text className="text-right text-white font-geistmono-semi-bold">
                                    ${item.value.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
