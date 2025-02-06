import { TouchableOpacity, Text, StyleProp, ViewStyle, TouchableOpacityProps } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
    title : string;
    containerStyles?: string;
    handlePress?: () => void;
    textStyles?: string;
    isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, containerStyles, handlePress, textStyles, isLoading, ...otherProps }) => {
    return (
        <TouchableOpacity className={` ${containerStyles} ${isLoading ? 'opacity-50' : ''} `} {...otherProps} onPress={handlePress} disabled={isLoading}>
            <Text className={textStyles}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
