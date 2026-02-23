import React, { useState, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ===============================================================
   🗂️  Projects Section — Accordion Flex Card Gallery (v4)
================================================================ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨  ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const lineGrow = keyframes`
  from { width: 0; }
  to   { width: 48px; }
`;

const titleGlitchTop = keyframes`
  0%, 88%, 100% {
    transform: translate(0);
    clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
    opacity: 0;
  }
  89% {
    opacity: 1;
    transform: translate(-4px, -1px);
    clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
  }
  91% {
    opacity: 1;
    transform: translate(4px, 0);
    clip-path: polygon(0 10%, 100% 10%, 100% 40%, 0 40%);
  }
  93% {
    opacity: 1;
    transform: translate(-2px, 1px);
    clip-path: polygon(0 20%, 100% 20%, 100% 48%, 0 48%);
  }
  95% {
    opacity: 0;
    transform: translate(0);
  }
`;

const titleGlitchBottom = keyframes`
  0%, 85%, 100% {
    transform: translate(0);
    clip-path: polygon(0 55%, 100% 55%, 100% 85%, 0 85%);
    opacity: 0;
  }
  86% {
    opacity: 1;
    transform: translate(5px, 1px);
    clip-path: polygon(0 55%, 100% 55%, 100% 85%, 0 85%);
  }
  88% {
    opacity: 1;
    transform: translate(-3px, 0);
    clip-path: polygon(0 60%, 100% 60%, 100% 90%, 0 90%);
  }
  90% {
    opacity: 1;
    transform: translate(2px, -1px);
    clip-path: polygon(0 52%, 100% 52%, 100% 82%, 0 82%);
  }
  92% {
    opacity: 0;
    transform: translate(0);
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📐  LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Container = styled.section`
  padding: 45px 2rem 50px;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;
  border-left: 5px solid ${({ theme }) => theme.colors?.primary ?? "#00f296"};
  padding-left: 2rem;
`;

const Title = styled.h2`
  position: relative;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -2px;
  color: ${({ theme }) => theme.colors?.textMain ?? "#fff"};
  text-transform: uppercase;
  display: inline-block;
  user-select: none;

  text-shadow:
    0 0 30px rgba(0, 242, 96, 0.15),
    0 0 60px rgba(0, 242, 96, 0.07);

  &::before {
    content: "Projects";
    position: absolute;
    top: 0;
    left: 0;
    color: ${({ theme }) => theme.colors?.textMain ?? "#fff"};
    text-shadow: -3px 0 ${({ theme }) => theme.colors?.primary ?? "#00f296"};
    opacity: 0;
    animation: ${titleGlitchTop} 8s infinite;
    pointer-events: none;
  }

  &::after {
    content: "Projects";
    position: absolute;
    top: 0;
    left: 0;
    color: ${({ theme }) => theme.colors?.textMain ?? "#fff"};
    text-shadow: 3px 0 #ff0044;
    opacity: 0;
    animation: ${titleGlitchBottom} 8s infinite;
    pointer-events: none;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 1rem;
  height: 600px;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🃏  CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Card = styled.div`
  flex: ${({ $isActive }) => ($isActive ? 5 : 1)};
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: #0d0d0d;

  transition:
    flex
      ${({ $isActive }) =>
        $isActive
          ? "0.7s cubic-bezier(0.25, 1, 0.3, 1)"
          : "0.5s cubic-bezier(0.4, 0, 0.2, 1)"},
    outline-color 0.4s ease;

  outline: 1px solid
    ${({ $isActive }) =>
      $isActive ? "rgba(0, 242, 96, 0.25)" : "rgba(255, 255, 255, 0.06)"};

  .default-title {
    opacity: ${({ $isActive }) => ($isActive ? 0 : 1)};
    transition: opacity 0.4s ease;
  }

  .hover-content {
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transition: opacity 0.35s ease
      ${({ $isActive }) => ($isActive ? "0.28s" : "0s")};
  }

  .card-number {
    opacity: ${({ $isActive }) => ($isActive ? 0 : 1)};
    transition: opacity 0.4s ease;
  }

  img {
    filter: ${({ $isActive }) =>
      $isActive
        ? "grayscale(0%) brightness(0.35)"
        : "grayscale(100%) brightness(0.45)"};
    transform: ${({ $isActive }) => ($isActive ? "scale(1.06)" : "scale(1)")};
    transition:
      filter 0.9s ease,
      transform 0.9s ease;
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🖼️  CARD INTERNALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultTitle = styled.h3`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  word-break: keep-all;
  z-index: 2;
  padding: 0 1.5rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
`;

const CardNumber = styled.span`
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.35);
  z-index: 2;
`;

const HoverContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem 3.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    transparent 100%
  );
  color: #fff;
  z-index: 3;
`;

const HoverInner = styled.div``;

const AccentLine = styled.div`
  width: 0;
  height: 3px;
  background: ${({ theme }) => theme.colors?.primary ?? "#00f296"};
  margin-bottom: 1.2rem;
  border-radius: 2px;

  .hover-content:not([style*="opacity: 0"]) & {
    animation: ${lineGrow} 0.4s cubic-bezier(0.25, 1, 0.3, 1) 0.55s forwards;
  }
`;

const HoverTitle = styled.h4`
  font-size: 2.6rem;
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -1.5px;
  line-height: 1.1;
`;

const HoverDesc = styled.p`
  max-width: 520px;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏷️  TAGS & LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.75);
`;

const IconLinks = styled.div`
  display: flex;
  gap: 1.2rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #fff;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);

    &:hover {
      background: ${({ theme }) => theme.colors?.primary ?? "#00f296"};
      border-color: ${({ theme }) => theme.colors?.primary ?? "#00f296"};
      color: #000;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 242, 96, 0.35);
    }
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦  PROJECT DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const projectData = [
  {
    id: 1,
    title: "한국교육평가원",
    desc: "4개 교육원 실서비스 운영. 레거시 환경에서 쿼리 최적화, SEO 개선, 관리자 시스템 설계까지 전반적인 개발을 담당했습니다.",
    stack: ["Classic ASP", "MSSQL", "JavaScript", "반응형 웹"],
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    github: null,
    live: null,
  },
  {
    id: 2,
    title: "STUDIO CORE",
    desc: "창의적인 아티스트들을 위한 포트폴리오 플랫폼입니다. 부드러운 스크롤 인터랙션과 3D 요소를 활용했습니다.",
    stack: ["Three.js", "GSAP", "React"],
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    github: "#",
    live: "#",
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  Projects — 메인 컴포넌트 (v4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Projects = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const leaveTimer = useRef(null);

  const handleEnter = useCallback((id) => {
    clearTimeout(leaveTimer.current);
    setActiveId(id);
  }, []);

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setActiveId(null);
    }, 100);
  }, []);

  // 링크 클릭 시 카드 navigate 방지
  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Container id="projects">
      <SectionHeader>
        <Title>Projects</Title>
      </SectionHeader>

      <FlexContainer>
        {projectData.map((p, idx) => {
          const isActive = activeId === p.id;

          return (
            <Card
              key={p.id}
              $isActive={isActive}
              onMouseEnter={() => handleEnter(p.id)}
              onMouseLeave={handleLeave}
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <ProjectImage src={p.img} alt={p.title} />

              <CardNumber className="card-number">
                {String(idx + 1).padStart(2, "0")}
              </CardNumber>

              <DefaultTitle className="default-title">{p.title}</DefaultTitle>

              <HoverContent className="hover-content">
                <AccentLine />
                <HoverInner>
                  <HoverTitle>{p.title}</HoverTitle>
                  <HoverDesc>{p.desc}</HoverDesc>
                  <TagContainer>
                    {p.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </TagContainer>
                  <IconLinks>
                    {p.github && (
                      <a
                        href={p.github}
                        aria-label="GitHub"
                        onClick={handleLinkClick}
                      >
                        <FaGithub />
                      </a>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        aria-label="외부 링크"
                        onClick={handleLinkClick}
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </IconLinks>
                </HoverInner>
              </HoverContent>
            </Card>
          );
        })}
      </FlexContainer>
    </Container>
  );
};

export default Projects;
