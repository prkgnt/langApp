import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
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

export default function App() {
  const [up, setUp] = useState(false);
  //Y = new Animated.Value(0); 로 두게 되면 스테이트가 변경될 때 마다 재렌더링 되서 Y값이 0으로 초기화됨
  //useRef로 감싸고 안에 초기값을 주면 재렌더링 되도 현재 값이 유지됨
  const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 300 })).current;
  const toggleUp = () => {
    setUp((prev) => !prev);
  };
  const opacityValue = POSITION.y.interpolate({
    //inputRange의 값들을 outputRange의 값으로 자동 치환
    inputRange: [-300, -100, 100, 300],
    outputRange: [1, 0.1, 0.1, 1],
  });
  const borderRadius = POSITION.y.interpolate({
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
  const moveUp = () => {
    Animated.timing(POSITION, {
      toValue: up ? { x: 0, y: 300 } : { x: 0, y: -300 },
      useNativeDriver: false,
      duration: 1000,
    }).start(toggleUp);
    //start(함수) 하면 애니메이션이 끝나고 함수가 실행됨
  };
  return (
    <Container>
      <Wrapper onPress={moveUp}>
        <AnimatedBox
          style={{
            borderRadius,
            backgroundColor: bgColor,
            transform: [{ translateY: POSITION.y }, { rotate: rotation }],
            opacity: opacityValue,
          }}
        />
      </Wrapper>
    </Container>
  );
  //styled 자동완성
  //npm install @types/styled-components @types/styled-components-react-native
}
