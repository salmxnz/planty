import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, useColorScheme } from 'react-native';

interface TypingProps {
  dotColor?: string;
  backgroundColor?: string;
}

const Typing: React.FC<TypingProps> = ({ 
  dotColor,
  backgroundColor
}) => {
  const colorScheme = useColorScheme();
  const defaultBgColor = colorScheme === 'dark' ? '#d1d5db' : '#e5e7eb'; // gray-300/gray-200
  const defaultDotColor = colorScheme === 'dark' ? '#1f2937' : '#111827'; // gray-800/gray-900
  
  // Animation values for each dot
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  
  // Animation values for dot scaling
  const dot1Scale = useRef(new Animated.Value(0.8)).current;
  const dot2Scale = useRef(new Animated.Value(0.8)).current;
  const dot3Scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Create animation sequence
    const animateDots = () => {
      // Reset all dots
      Animated.parallel([
        Animated.timing(dot1Opacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
        Animated.timing(dot2Opacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
        Animated.timing(dot3Opacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
        Animated.timing(dot1Scale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
        Animated.timing(dot2Scale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
        Animated.timing(dot3Scale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
      ]).start();
      
      // Animate first dot
      Animated.parallel([
        Animated.timing(dot1Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1Scale, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        // Animate second dot
        Animated.parallel([
          Animated.timing(dot2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Scale, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => {
          // Animate third dot
          Animated.parallel([
            Animated.timing(dot3Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(dot3Scale, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start(() => {
            // Small delay before restarting animation
            setTimeout(() => {
              animateDots();
            }, 700);
          });
        });
      });
    };

    // Start the animation
    animateDots();

    // Cleanup function
    return () => {
      dot1Opacity.stopAnimation();
      dot2Opacity.stopAnimation();
      dot3Opacity.stopAnimation();
      dot1Scale.stopAnimation();
      dot2Scale.stopAnimation();
      dot3Scale.stopAnimation();
    };
  }, [dot1Opacity, dot2Opacity, dot3Opacity, dot1Scale, dot2Scale, dot3Scale]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || defaultBgColor }]}>
      <Animated.View 
        style={[
          styles.dot, 
          { 
            backgroundColor: dotColor || defaultDotColor,
            opacity: dot1Opacity,
            transform: [{ scale: dot1Scale }]
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.dot, 
          { 
            backgroundColor: dotColor || defaultDotColor,
            opacity: dot2Opacity,
            transform: [{ scale: dot2Scale }]
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.dot, 
          { 
            backgroundColor: dotColor || defaultDotColor,
            opacity: dot3Opacity,
            transform: [{ scale: dot3Scale }]
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: 70,
    height: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  }
});

export default Typing;
