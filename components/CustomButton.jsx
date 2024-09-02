import * as LocalAuthentication from 'expo-local-authentication';
import { TouchableOpacity, Text, Alert } from 'react-native';
import React, { useState } from 'react';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticateUser = async () => {
    try {
      // Verifica si el dispositivo tiene hardware biométrico y si está configurado
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Not Supported', 'This feature is only supported on devices with biometric hardware.');
        return;
      }

      // Verifica el tipo de biometría disponible
      const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        // Si Face ID está disponible, realiza la autenticación
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with Face ID',
          // Puedes quitar la opción de fallback si deseas que solo utilice Face ID
          fallbackLabel: undefined, 
        });

        if (result.success) {
          setIsAuthenticated(true);
          handlePress();
        } else {
          Alert.alert('Authentication Failed', 'You must authenticate to proceed.');
        }
      } else {
        Alert.alert('Face ID Not Available', 'Face ID is not available on this device.');
      }
    } catch (error) {
      Alert.alert('Authentication Error', `An error occurred: ${error.message}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={authenticateUser}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] 
      justify-center items-center ${containerStyles} 
      ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
