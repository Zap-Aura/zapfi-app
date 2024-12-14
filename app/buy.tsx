import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { SvgXml } from 'react-native-svg';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const Page = () => {
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
                        Buy APTOS
                    </Text>
                </View>

                <View className="mt-10 border gap-5 px-5 py-8 border-gray-600 rounded-lg bg-[#283132] items-center justify-center">
                    <SvgXml
                        xml={`<svg width='86' height='22' viewBox='0 0 86 22' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_470_1619)'><path d='M2.40214 7.81851C2.40214 7.81851 4.29536 7.02521 9.23705 0.561523L31.3754 0.650909L18.9067 14.8464H14.1686L22.9527 4.2375H11.8835L8.48384 8.13136L2.39705 8.10901V7.81292L2.40214 7.81851ZM28.9784 13.7794L22.8916 13.7571L19.492 17.6509H8.42277L17.782 6.33806H13.0438L0 21.2487L22.1384 21.3381C27.0801 14.8744 28.9733 14.0755 28.9733 14.0755V13.7794H28.9784Z' fill='white'/><path d='M42.3582 0.5H47.417L34.6276 21.3045H29.5688L42.3582 0.5ZM48.445 2.38268L45.9156 6.5L50.2364 13.5279H41.5948L39.3606 17.1592H52.4706L55.0763 21.405H60.1351L48.4399 2.38268H48.445Z' fill='white'/><path d='M85.4998 6.03631V9.95251C85.4998 12.9358 83.2961 15.3492 80.5835 15.3492H71.6264L74.0438 11.4162H78.8328C78.9244 11.4162 79.0211 11.4162 79.1127 11.3994C80.2476 11.2486 81.123 10.1927 81.123 8.90223V7.08101C81.123 5.69553 80.1 4.56704 78.8328 4.56704H78.2475L78.2577 4.55028H69.1174V0.639665H80.5784C82.8228 0.639665 84.716 2.2933 85.3064 4.55028C85.4285 5.02514 85.4947 5.52235 85.4947 6.03631H85.4998ZM66.99 0.5H62.8066V21.5H66.99V0.5Z' fill='white'/></g><defs><clipPath id='clip0_470_1619'><rect width='85.5' height='21' fill='white' transform='translate(0 0.5)'/></clipPath></defs></svg>`}
                    />
                    <Text className="text-center font-inter-semi-bold text-base text-gray-300 mt-3">
                        Buy with credit card, or bank transfer
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://zap.africa');
                        }}
                        className="bg-secondary px-7 py-5 rounded-full flex-row items-center gap-1.5"
                    >
                        <Text className="font-geistmono-semi-bold text-black">Continue to Zap</Text>
                        <EvilIcons name="external-link" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;
