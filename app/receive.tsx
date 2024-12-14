import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Images } from '@/constants';
import * as Clipboard from 'expo-clipboard';
import { useStorageValues } from '@/hooks';

const width = Dimensions.get('window').width;

const Page = () => {
    const addr = useStorageValues((state) => state.address);

    const copyAddress = async () => {
        if (!addr) return;

        try {
            await Clipboard.setStringAsync(addr);
            Alert.alert('Address copied');
        } catch (e: any) {
            console.error(e);
            Alert.alert('Could not copy to clipboard');
        }
    };

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
                        Receive APT
                    </Text>
                </View>

                <View className="mt-7">
                    <View className="p-9 rounded-xl mb-6 border-gray-500 border items-center justify-center">
                        <QRCode
                            size={width - 100}
                            backgroundColor={Colors.Background}
                            color={'#6b7280'}
                            logo={Images.icon}
                            logoBorderRadius={99}
                            logoSize={80}
                            logoMargin={15}
                            value={addr!}
                        />
                    </View>

                    <View className="bg-primary flex-row items-center p-5 rounded-lg gap-4 mb-5">
                        <Ionicons name="information-circle-outline" size={24} color="#fff" />
                        <Text className="text-white text-base font-geistmono-regular w-[85%]">
                            Send only APTOS and APTOS tokens to this address
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={copyAddress}
                        className="flex-row items-center justify-center rounded-full py-5 gap-4"
                        style={{ backgroundColor: '#283132' }}
                    >
                        <Ionicons name="copy-outline" size={20} color="#fff" />
                        <Text className="text-white font-geistmono-semi-bold text-lg">
                            Copy Address
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
