import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';

interface CameraButtonProps {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: keyof typeof Entypo.glyphMap;
  icon2?: keyof typeof FontAwesome.glyphMap;
  color?: string;
}

const CameraButton: React.FC<CameraButtonProps> = ({ title, onPress, icon, icon2, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {icon && <Entypo name={icon} size={35} color={color ?? '#f1f1f1'} />}
      {icon2 && <FontAwesome name={icon2} size={75} color="#f1f1f1" />}
      {title && <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default CameraButton;

const styles = StyleSheet.create({
  button: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f1f1f1',
    marginLeft: 10,
  },
});