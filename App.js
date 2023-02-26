import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.TouchableOpacity`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

export default function App() {
  const [y, setY] = useState(0);
  const [intervalID, setIntervalID] = useState(null);

  const moveUp = () => {
    //setY(prev=>prev+1)
    // 자동으로 인자에는 전 값이 들어감
    //const x = setInterval(함수,시간) -> x에 해당 인터벌 아이디를 저장, 밀리초 단위로 함수 실행
    const id = setInterval(() => setY((prev) => prev + 1), 10);
    setIntervalID(id);
  };

  useEffect(() => {
    if (y === 200) {
      clearInterval(intervalID);
    }
  }, [y, intervalID]);

  return (
    <Container>
      <Box
        onPress={moveUp}
        style={{
          transform: [{ translateY: y }],
        }}
      />
    </Container>
  );
  //styled 자동완성
  //npm install @types/styled-components @types/styled-components-react-native
}
