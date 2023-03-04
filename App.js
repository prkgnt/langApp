import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import icons from "./icons";

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
  position: absolute;
`;
const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;
const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotate = position.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: ["-20deg", "0deg", "20deg"],
    //input 최대치에 도달했을 경우 output도 최대치로 고정
    extrapolate: "clamp",
  });
  const secondScale = position.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  const opacity = position.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: [0.7, 1, 0.7],
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
    tension: 5,
    useNativeDriver: true,
    //애니메이션이 특정속도로 움직이거나 특정 위치가 되면 애니메이션 끝내기
    restDisplacementThreshold: 200,
    restSpeedThreshold: 200,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 200,
    restSpeedThreshold: 200,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        if (dx < -250 || vx < -2) {
          goLeft.start(dismiss);
        } else if (dx > 250 || vx > 2) {
          goRight.start(dismiss);
        } else {
          //연속된 애니메이션 한번에 실행
          Animated.parallel([onPressOut, goBack]).start();
        }
      },
    })
  ).current;

  const checkPress = () => {
    goRight.start(dismiss);
  };
  const closePress = () => {
    goLeft.start(dismiss);
  };

  const [index, setIndex] = useState(0);
  const dismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    //Animated.timing(position, { toValue: 0, useNativeDriver: true });
    setIndex((prev) => prev + 1);
  };

  return (
    <Container>
      <CardContainer>
        <AnimatedCard
          {...panResponder.panHandlers}
          style={{
            transform: [{ scale: secondScale }],
          }}
        >
          <Ionicons name={icons[index + 1]} color="#192a56" size={98} />
        </AnimatedCard>
        <AnimatedCard
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotate },
            ],
            opacity,
          }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={98} />
        </AnimatedCard>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="close-circle" size={60} color="white" />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" size={60} color="white" />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
