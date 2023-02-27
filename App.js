import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.Pressable``;
//TouchableOpacity에 바로 애니메이션을 주면 버벅이므로 View에 애니메이션을 주고 감싸는게 더 나음
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  //Y = new Animated.Value(0); 로 두게 되면 스테이트가 변경될 때 마다 재렌더링 되서 Y값이 0으로 초기화됨
  //useRef로 감싸고 안에 초기값을 주면 재렌더링 되도 현재 값이 유지됨
  const POSITION = useRef(
    new Animated.ValueXY({
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    })
  ).current;
  const toggleUp = () => {
    setUp((prev) => !prev);
  };
  const borderRadius = POSITION.y.interpolate({
    //inputRange의 값들을 outputRange의 값으로 자동 치환
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const rotation = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["-360deg", "360deg"],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
  });

  const topLeft = Animated.timing(POSITION, {
    toValue: { x: -SCREEN_WIDTH / 2 + 100, y: -SCREEN_HEIGHT / 2 + 100 },
    useNativeDriver: false,
  });
  const bottomLeft = Animated.timing(POSITION, {
    toValue: { x: -SCREEN_WIDTH / 2 + 100, y: SCREEN_HEIGHT / 2 - 100 },
    useNativeDriver: false,
  });
  const topRight = Animated.timing(POSITION, {
    toValue: { x: SCREEN_WIDTH / 2 - 100, y: -SCREEN_HEIGHT / 2 + 100 },
    useNativeDriver: false,
  });
  const bottomRight = Animated.timing(POSITION, {
    toValue: { x: SCREEN_WIDTH / 2 - 100, y: SCREEN_HEIGHT / 2 - 100 },
    useNativeDriver: false,
  });
  const moveUp = () => {
    Animated.loop(
      Animated.sequence([bottomLeft, bottomRight, topRight, topLeft])
    ).start();
  };
  return (
    <Container>
      <Wrapper onPress={moveUp}>
        <AnimatedBox
          style={{
            borderRadius,
            backgroundColor: bgColor,
            transform: [
              ...POSITION.getTranslateTransform(),
              // == [{ translateX: POSITION.x },{ translateY: POSITION.y }]
              //{ rotate: rotation },
            ],
          }}
        />
      </Wrapper>
    </Container>
  );
  //styled 자동완성
  //npm install @types/styled-components @types/styled-components-react-native
}
