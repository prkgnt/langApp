import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  useAnimatedValue,
  View,
} from "react-native";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import icons from "./icons";

const BLACK_COLOR = "#1e272e";
const GRAY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
  justify-content: center;
  align-items: center;
`;
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const WordContainer = styled(Animated.View)`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GRAY};
  border-radius: 50px;
`;
const Word = styled.Text`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
const IconCards = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 15px 15px;
  border-radius: 15px;
`;
const IconShow = styled(Animated.View)`
  position: absolute;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const checkOpacity = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const closeOpacity = useRef(new Animated.Value(1)).current;
  const closeScale = useRef(new Animated.Value(0)).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [1.5, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [80, 300],
    outputRange: [1, 1.5],
    extrapolate: "clamp",
  });

  const onPress = Animated.spring(scale, {
    toValue: 0.8,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const disapear = Animated.parallel([
    Animated.timing(scale, {
      toValue: 0,
      easing: Easing.linear,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0,
      easing: Easing.linear,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);

  const checkGrowUp = Animated.parallel([
    Animated.timing(checkOpacity, {
      toValue: 0,
      useNativeDriver: true,
    }),
    Animated.timing(checkScale, {
      toValue: 100,
      easing: Easing.linear,
      duration: 3000,
      useNativeDriver: true,
    }),
  ]);

  const closeGrowUp = Animated.parallel([
    Animated.timing(closeOpacity, {
      toValue: 0,
      useNativeDriver: true,
    }),
    Animated.timing(closeScale, {
      toValue: 100,
      easing: Easing.linear,
      duration: 3000,
      useNativeDriver: true,
    }),
  ]);

  const growBack = () => {
    checkScale.setValue(0);
    checkOpacity.setValue(1);
    closeScale.setValue(0);
    closeOpacity.setValue(1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPress.start();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -300) {
          checkGrowUp.start(growBack);
          Animated.sequence([disapear, goHome]).start(nextIcon);
        } else if (dy > 300) {
          closeGrowUp.start(growBack);
          Animated.sequence([disapear, goHome]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
    })
  ).current;

  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleOne }] }}>
          <Word color={GREEN}>아는거</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCards
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GRAY} size={76} />
        </IconCards>
      </Center>
      <IconShow
        style={{
          opacity: checkOpacity,
          transform: [{ scale: checkScale }],
        }}
      >
        <Ionicons
          style={{ position: "absolute" }}
          name="checkmark-circle"
          color={GREEN}
          size={76}
        />
      </IconShow>
      <IconShow
        style={{
          opacity: closeOpacity,
          transform: [{ scale: closeScale }],
        }}
      >
        <Ionicons
          style={{ position: "absolute" }}
          name="close-circle"
          color={RED}
          size={76}
        />
      </IconShow>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>모르는거</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
