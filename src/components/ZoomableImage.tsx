import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
} from "react-native";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function pinchDistance(touches: { pageX: number; pageY: number }[]) {
  const [first, second] = touches;
  return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
}

interface ZoomableImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

export function ZoomableImage({ uri, style }: ZoomableImageProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const values = useRef({
    scale: 1,
    x: 0,
    y: 0,
    startDist: 1,
    startScale: 1,
    startX: 0,
    startY: 0,
    panStartDx: 0,
    panStartDy: 0,
    mode: "none" as "none" | "pinch" | "pan",
  }).current;

  const setScale = (next: number) => {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    if (!Number.isFinite(clamped)) return;
    values.scale = clamped;
    scale.setValue(clamped);
    if (clamped <= 1) {
      values.x = 0;
      values.y = 0;
      translateX.setValue(0);
      translateY.setValue(0);
    }
  };

  const startPinch = (touches: { pageX: number; pageY: number }[]) => {
    values.mode = "pinch";
    values.startDist = Math.max(pinchDistance(touches), 16);
    values.startScale = values.scale;
  };

  const startPan = (dx: number, dy: number) => {
    values.mode = "pan";
    values.startX = values.x;
    values.startY = values.y;
    values.panStartDx = dx;
    values.panStartDy = dy;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: (evt) =>
        evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponderCapture: (evt) =>
        evt.nativeEvent.touches.length >= 2,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          startPinch(touches);
          return;
        }
        if (values.scale > 1) {
          startPan(0, 0);
        } else {
          values.mode = "none";
        }
      },
      onPanResponderMove: (evt, gesture) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          if (values.mode !== "pinch") {
            startPinch(touches);
          }
          setScale(values.startScale * (pinchDistance(touches) / values.startDist));
          return;
        }

        if (values.mode === "pinch") {
          if (values.scale > 1) {
            startPan(gesture.dx, gesture.dy);
          } else {
            values.mode = "none";
          }
          return;
        }

        if (values.scale > 1) {
          if (values.mode !== "pan") {
            startPan(gesture.dx, gesture.dy);
          }
          values.x = values.startX + (gesture.dx - values.panStartDx);
          values.y = values.startY + (gesture.dy - values.panStartDy);
          translateX.setValue(values.x);
          translateY.setValue(values.y);
        }
      },
      onPanResponderRelease: () => {
        if (values.scale <= 1.08) {
          values.scale = 1;
          values.x = 0;
          values.y = 0;
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }),
          ]).start();
        }
        values.mode = "none";
      },
    })
  ).current;

  return (
    <View style={styles.fill} {...panResponder.panHandlers}>
      <Animated.Image
        source={{ uri }}
        resizeMode="contain"
        style={[
          styles.fill,
          style,
          {
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    width: "100%",
    height: "100%",
  },
});
