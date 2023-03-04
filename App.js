import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const AnimatedCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotate = position.interpolate({
    inputRange: [-240, 0, 240],
    outputRange: ["-20deg", "0deg", "20deg"],
    //input 최대치에 도달했을 경우 output도 최대치로 고정
    extrapolate: "clamp",
  });

  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goBack = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -250) {
          goLeft.start();
        } else if (dx > 250) {
          goRight.start();
        } else {
          //연속된 애니메이션 한번에 실행
          Animated.parallel([onPressOut, goBack]).start();
        }
      },
    })
  ).current;

  return (
    <Container>
      <AnimatedCard
        {...panResponder.panHandlers}
        style={{
          transform: [{ scale }, { translateX: position }, { rotateZ: rotate }],
        }}
      >
        <Ionicons name="pizza" color="#192a56" size={98} />
      </AnimatedCard>
    </Container>
  );
}
