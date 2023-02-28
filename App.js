import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";
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
  //Y = new Animated.Value(0); 로 두게 되면 스테이트가 변경될 때 마다 재렌더링 되서 Y값이 0으로 초기화됨
  //useRef로 감싸고 안에 초기값을 주면 재렌더링 되도 현재 값이 유지됨
  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      //터치를 했을 때 PanResponder를 Active 해야 될까요?
      // Should we become active when user press down circle(View)?
      onStartShouldSetPanResponder: () => true,
      //터치가 시작될 때
      onPanResponderGrant: () => {
        console.log("offset: ", POSITION.y._value);
        POSITION.setOffset({
          //POSITON.x -> 이건 숫자가 아니라 오브젝트임
          //POSITION.x._value -> 이게 숫자임
          x: POSITION.x._value,
          y: POSITION.y._value,
        });
      },
      //터치하며 움직일 때
      onPanResponderMove: (_, { dx, dy }) => {
        console.log(dy);
        POSITION.setValue({
          x: dx,
          y: dy,
        });
      },
      //터치가 끝났을 때
      onPanResponderRelease: () => {
        POSITION.flattenOffset();
      },
    })
  ).current;

  const borderRadius = POSITION.y.interpolate({
    //inputRange의 값들을 outputRange의 값으로 자동 치환
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
  });

  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers}
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
    </Container>
  );
  //styled 자동완성
  //npm install @types/styled-components @types/styled-components-react-native
}
