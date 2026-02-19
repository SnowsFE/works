import React from "react";
import styled from "styled-components";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

// ========== 스타일 컴포넌트 ==========
const Container = styled.section`
  padding: 100px 2rem;
  max-width: 1300px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: 5rem;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding-left: 1.5rem;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -2px;
  color: ${({ theme }) => theme.colors.textMain};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-8px);

    img {
      transform: scale(1.1);
      filter: grayscale(0%) brightness(0.5);
    }

    .overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
  background: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) brightness(0.7); // 기본 상태는 차분하게 흑백톤
    transition: all 0.6s ease;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.primary};
    font-family: monospace;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  pointer-events: none; // 카드 클릭 방해 금지

  p {
    color: #fff;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 2px;
`;

const IconLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;

  a {
    color: ${({ theme }) => theme.colors.textMain};
    font-size: 1.2rem;
    pointer-events: auto; // 링크는 클릭 가능하게
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

// ========== 데이터 & 컴포넌트 ==========
const projectData = [
  {
    id: 1,
    title: "VIBE DASHBOARD",
    desc: "데이터 시각화를 통해 한눈에 파악하는 관리자 대시보드입니다. 사용자의 UX를 고려한 인터랙티브한 차트를 제공합니다.",
    stack: ["React", "Recoil", "Chart.js"],
    img: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "SNOW SHOP",
    desc: "겨울 무드의 미니멀 쇼핑몰입니다. Next.js의 SSR을 활용하여 빠른 로딩 속도와 SEO 최적화를 구현했습니다.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
  },
];

const Projects = () => {
  return (
    <Container id="projects">
      <SectionHeader>
        <Title>PROJECTS</Title>
      </SectionHeader>
      <Grid>
        {projectData.map((p) => (
          <Card key={p.id}>
            <ImageWrapper>
              <img src={p.img} alt={p.title} />
              <Overlay className="overlay">
                <p>{p.desc}</p>
                <TagContainer>
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </TagContainer>
                <IconLinks>
                  <a href="#">
                    <FaGithub />
                  </a>
                  <a href="#">
                    <FaExternalLinkAlt />
                  </a>
                </IconLinks>
              </Overlay>
            </ImageWrapper>
            <Content>
              <ProjectTitle>{p.title}</ProjectTitle>
            </Content>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
