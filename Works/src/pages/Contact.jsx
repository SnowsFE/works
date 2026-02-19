import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

// 1. 애니메이션 정의
const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// 2. 스타일 컴포넌트
const ContactSection = styled.section`
  padding: 150px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  letter-spacing: 4px;
`;

const MarqueeContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  padding: 1.5rem 0;
  cursor: pointer;
  white-space: nowrap;
  transform: rotate(-2deg); // 살짝 기울여서 더 힙하게 연출
  margin: 40px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(0deg) scale(1.02);
    background: #ffffff;
    & div span {
      color: #000;
      -webkit-text-stroke: 0;
    }
  }
`;

const MarqueeContent = styled.div`
  display: inline-block;
  animation: ${scroll} 30s linear infinite;
`;

const MarqueeText = styled.span`
  font-size: 5rem;
  font-weight: 900;
  color: #000;
  margin-right: 3rem;
  text-transform: uppercase;
  /* 테두리만 있는 텍스트 스타일 */
  -webkit-text-stroke: 1.5px #000;
  color: transparent;

  &:nth-child(even) {
    color: #000;
    -webkit-text-stroke: 0;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: #1a1a1a;
  width: 100%;
  max-width: 450px;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 40px;
  position: relative;
  text-align: center;
  animation: ${fadeIn} 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

const GithubName = styled.h3`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const GithubBio = styled.p`
  color: ${({ theme }) => theme.colors.textSub};
  margin-bottom: 30px;
  line-height: 1.5;
`;

const VisitButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 242, 96, 0.3);
  }
`;

// 3. 메인 컴포넌트
const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <ContactSection id="contact">
      <SectionTitle>GET IN TOUCH</SectionTitle>

      {/* 클릭하면 모달이 열리는 흐르는 텍스트 */}
      <MarqueeContainer onClick={toggleModal}>
        <MarqueeContent>
          <MarqueeText>Snoer GitHub</MarqueeText>
          <MarqueeText>Click to Preview</MarqueeText>
          <MarqueeText>Snoer GitHub</MarqueeText>
          <MarqueeText>Click to Preview</MarqueeText>
          <MarqueeText>Snoer GitHub</MarqueeText>
          <MarqueeText>Click to Preview</MarqueeText>
        </MarqueeContent>
      </MarqueeContainer>

      <p style={{ color: "#666", marginTop: "20px" }}>
        마키를 클릭하여 깃허브 프로필을 미리보세요.
      </p>

      {/* 모달 로직 */}
      {isModalOpen && (
        <ModalOverlay onClick={toggleModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={toggleModal}>
              <FaTimes />
            </CloseButton>

            <ProfileImg src="https://github.com/SnowsFE.png" alt="SnowsFE" />
            <GithubName>Snoer</GithubName>
            <GithubBio>
              프론트엔드 개발자로서의 <br />
              다양한 프로젝트와 코드를 확인해보세요.
            </GithubBio>

            <VisitButton
              href="https://github.com/SnowsFE"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub 방문하기 <FaExternalLinkAlt size={16} />
            </VisitButton>
          </ModalCard>
        </ModalOverlay>
      )}
    </ContactSection>
  );
};

export default Contact;
