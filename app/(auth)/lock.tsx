import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStorageValues } from '@/hooks';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

const Page = () => {
    const [code, setCode] = useState<number[]>([]);
    const length = Array(4).fill(0);
    const router = useRouter();

    useEffect(() => {
        const pin = useStorageValues.getState().pin;
        if (!pin) return;

        if (code.length === 4) {
            // TODO: logic here
        }
    }, [code]);

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    };

    const onBackspacePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    };

    return (
        <SafeAreaView className="bg-background h-full">
            <Text className="text-white">Enter PIN</Text>

            <View>
                {length.map((_, idx) => (
                    <View key={idx} />
                ))}
            </View>

            <View>
                <View className="flex-row">
                    {[1, 2, 3].map((number) => (
                        <TouchableOpacity key={number} onPress={() => onNumberPress(number)}>
                            <Text className="text-white">{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row">
                    {[4, 5, 6].map((number) => (
                        <TouchableOpacity key={number} onPress={() => onNumberPress(number)}>
                            <Text className="text-white">{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row">
                    {[7, 8, 9].map((number) => (
                        <TouchableOpacity key={number} onPress={() => onNumberPress(number)}>
                            <Text className="text-white">{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row">
                    <Entypo name="fingerprint" size={24} color="black" />

                    <TouchableOpacity onPress={() => onNumberPress(0)}>
                        <Text>0</Text>
                    </TouchableOpacity>

                    <Ionicons name="backspace-outline" size={24} color="black" />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Page;
