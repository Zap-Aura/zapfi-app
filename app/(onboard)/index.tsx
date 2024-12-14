import { View, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import Storage from '@/shared/adapters/storage';
import { router } from 'expo-router';
import { useStorageValues } from '@/hooks';

const Page = () => {
    const [code, setCode] = useState<number[]>([]);
    const [confirming, setConfirming] = useState(false);
    const [firstPIN, setFirstPIN] = useState<string | null>(null);
    const length = Array(4).fill(0);

    useEffect(() => {
        if (useStorageValues.getState().pin) return router.push('/(tabs)/home');
    }, []);

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    };

    const onBackspacePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    };

    useEffect(() => {
        async function handleFirstPIN(pin: string) {
            setFirstPIN(pin);
            setCode([]);
            setConfirming(true);
        }

        async function confirmPIN(pin: string) {
            if (pin === firstPIN) {
                await new Storage().setPair('pin', pin);
                setCode([]);
                router.push('/(tabs)/home');
            } else {
                setCode([]);
                setFirstPIN(null);
                setConfirming(false);
                Alert.alert('PINs do not match. Try again.');
            }
        }

        if (code.length === 4) {
            const pin = code.join('');

            if (!confirming) handleFirstPIN(pin);
            else confirmPIN(pin);
        }
    }, [code]);

    return (
        <SafeAreaView className="bg-background h-full py-10 px-5 flex-col justify-between">
            <Text className="text-white text-center font-geistmono-bold text-lg mt-10">
                {confirming ? 'Confirm 4-digit Passcode' : 'Setup 4-digit Passcode'}
            </Text>

            <View>
                <View className="flex-row items-center justify-center gap-4 mb-20">
                    {length.map((_, idx) => (
                        <View
                            className={`w-5 h-5 rounded-full ${
                                code[idx] ? 'bg-tertiary' : 'bg-gray-500'
                            }`}
                            key={idx}
                        />
                    ))}
                </View>

                <View className="w-full flex-col gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number, idx) =>
                        idx % 3 === 0 ? (
                            <View key={idx} className="flex-row items-center justify-around">
                                {[number, number + 1, number + 2].map((n) => (
                                    <TouchableOpacity
                                        className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                                        key={n}
                                        onPress={() => onNumberPress(n)}
                                    >
                                        <Text className="text-white font-inter-regular text-2xl">
                                            {n}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null
                    )}

                    <View className="flex-row items-center justify-around">
                        <View className="h-20 w-20" />
                        <TouchableOpacity
                            className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                            onPress={() => onNumberPress(0)}
                        >
                            <Text className="text-white font-inter-regular text-2xl">0</Text>
                        </TouchableOpacity>

                        <View className="h-20 w-20">
                            {code.length ? (
                                <TouchableOpacity
                                    className="border-gray-500 border h-20 w-20 rounded-full items-center justify-center"
                                    onPress={onBackspacePress}
                                >
                                    <Ionicons name="backspace-outline" size={28} color="#fff" />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Page;
