import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const App = () => {
    // Định nghĩa kiểu dữ liệu cho biometryType
    const [biometryType, setBiometryType] = useState<'Touch ID' | 'Face ID' | 'Thiết bị không hỗ trợ sinh trắc học' | null>(null);

    useEffect(() => {
        const checkBiometryType = async () => {
            // Kiểm tra loại sinh trắc học được hỗ trợ
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometryType('Touch ID');
            } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setBiometryType('Face ID');
            } else {
                setBiometryType('Thiết bị không hỗ trợ sinh trắc học');
            }
        };

        checkBiometryType();
    }, []);

    const handleBiometricAuth = async () => {
        // Kiểm tra xem thiết bị có hỗ trợ sinh trắc học và có dữ liệu sinh trắc học đã đăng ký không
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (!compatible || !enrolled) {
            Alert.alert('Thiết bị không hỗ trợ hoặc chưa đăng ký sinh trắc học');
            return;
        }

        // Thực hiện xác thực sinh trắc học (Touch ID hoặc Face ID)
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: `Xác thực bằng ${biometryType || 'sinh trắc học'}`,
            cancelLabel: 'Hủy bỏ',
            disableDeviceFallback: true,
        });

        if (result.success) {
            Alert.alert('Xác thực thành công!');
        } else {
            Alert.alert('Xác thực không thành công');
        }
    };

    const handleFaceIDAuth = async () => {
        // Thực hiện xác thực Face ID cụ thể
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Xác thực bằng Face ID',
            cancelLabel: 'Hủy bỏ',
            disableDeviceFallback: true,
        });

        if (result.success) {
            Alert.alert('Xác thực Face ID thành công!');
        } else {
            Alert.alert('Xác thực Face ID không thành công');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{`Thiết bị hỗ trợ: ${biometryType || 'Đang kiểm tra...'}`}</Text>

            {/* Nút xác thực chung cho cả Touch ID và Face ID */}
            <Button title="Xác thực sinh trắc học" onPress={handleBiometricAuth} />

            {/* Nút xác thực Face ID riêng biệt, chỉ hiển thị khi Face ID được hỗ trợ */}
            {biometryType === 'Face ID' && (
                <View style={{ marginTop: 10 }}>
                    <Button title="Xác thực bằng Face ID" onPress={handleFaceIDAuth} />
                </View>
            )}
        </View>
    );
};

export default App;
