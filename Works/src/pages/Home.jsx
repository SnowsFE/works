import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSub};
  max-width: 600px;
  margin-bottom: 2rem;
`;

const Button = styled(Link)`
  padding: 0.8rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #000;
  font-weight: 700;
  border-radius: 50px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 242, 96, 0.2);
  }
`;

const Home = () => {
  return (
    <Container>
      <Title>
        Front-end Developer
        <br />
        PortFolio
      </Title>
      <Subtitle>
        사용자 경험을 중요하게 생각하는 개발자 000입니다.
        <br />
        문제를 해결하고 가치를 만드는 과정을 기록합니다.
      </Subtitle>
      <Button to="/projects">작업물 보러가기</Button>
    </Container>
  );
};

export default Home;
