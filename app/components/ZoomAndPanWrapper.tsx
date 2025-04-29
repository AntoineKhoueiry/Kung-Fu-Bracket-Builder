import React, { forwardRef, useImperativeHandle } from 'react';
import { ViewStyle } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDecay } from 'react-native-reanimated';

interface ZoomAndPanWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentWidth?: number;
}

const ZoomAndPanWrapper = forwardRef(({ children, style, contentWidth }: ZoomAndPanWrapperProps, ref) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-20); // Start bracket a little higher

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((event) => {
      translateX.value += event.translationX;
      translateY.value += event.translationY;
    })
    .onEnd((event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [-(contentWidth || 1000), 0],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [-200, 200], // Limit vertical movement
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    flexDirection: 'row',
    width: contentWidth || 1000,
    alignItems: 'center',
    padding: 20,
  }));

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (scale.value < 2.5) {
        scale.value = withTiming(scale.value + 0.2);
      }
    },
    zoomOut: () => {
      if (scale.value > 0.5) {
        scale.value = withTiming(scale.value - 0.2);
      }
    },
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle, style]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
});

export default ZoomAndPanWrapper;
