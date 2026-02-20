import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// ========== 애니메이션 ==========
const flicker = keyframes`
  0%, 95%, 100% { opacity: 1; }
  96%            { opacity: 0.6; }
  97%            { opacity: 1; }
  98%            { opacity: 0.3; }
  99%            { opacity: 1; }
`;

const glitchTop = keyframes`
  0%, 90%, 100% { transform: translate(0); }
  92%            { transform: translate(-3px, -1px); }
  94%            { transform: translate(3px, 0); }
  96%            { transform: translate(-2px, 1px); clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%); }
  98%            { transform: translate(2px, -1px); }
`;

const glitchBottom = keyframes`
  0%, 85%, 100% { transform: translate(0); }
  87%            { transform: translate(4px, 1px); }
  89%            { transform: translate(-2px, 0); }
  91%            { transform: translate(2px, -1px); clip-path: polygon(0 55%, 100% 55%, 100% 85%, 0 85%); }
  93%            { transform: translate(-3px, 1px); }
`;

// ========== 스타일 ==========
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const GlitchLogo = styled(Link)`
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;

  /* 메인 텍스트 */
  .glitch-text {
    font-family: "Arial Black", "Impact", sans-serif;
    font-size: 28px;
    font-weight: 900;
    font-style: italic;
    color: #00ff44;
    letter-spacing: 4px;
    text-shadow:
      0 0 8px #00ff44,
      0 0 20px #00cc33,
      0 0 40px #009922;
    animation: ${flicker} 4s infinite;
    position: relative;
    user-select: none;
  }

  /* 슬래시 라인 */
  .glitch-text::before {
    content: "";
    position: absolute;
    top: 48%;
    left: -8px;
    width: calc(100% + 16px);
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      #00ff44,
      #aaffcc,
      #00ff44,
      transparent
    );
    transform: rotate(-12deg);
    box-shadow:
      0 0 6px #00ff44,
      0 0 14px #00cc33;
    opacity: 0.75;
  }

  /* 글리치 레이어 1 (위) */
  .glitch-clone-top {
    content: attr(data-text);
    font-family: "Arial Black", "Impact", sans-serif;
    font-size: 28px;
    font-weight: 900;
    font-style: italic;
    letter-spacing: 4px;
    position: absolute;
    top: 0;
    left: 0;
    color: #00ff44;
    text-shadow: -2px 0 #ff0044;
    clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
    animation: ${glitchTop} 3s infinite;
    pointer-events: none;
    user-select: none;
  }

  /* 글리치 레이어 2 (아래) */
  .glitch-clone-bottom {
    font-family: "Arial Black", "Impact", sans-serif;
    font-size: 28px;
    font-weight: 900;
    font-style: italic;
    letter-spacing: 4px;
    position: absolute;
    top: 0;
    left: 0;
    color: #00ff44;
    text-shadow: 2px 0 #0044ff;
    clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
    animation: ${glitchBottom} 3s infinite;
    pointer-events: none;
    user-select: none;
  }

  &:hover .glitch-text {
    text-shadow:
      0 0 12px #00ff44,
      0 0 30px #00cc33,
      0 0 60px #009922;
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 2rem;

  a {
    font-weight: 500;
    transition: color 0.3s;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.primary};
      transition: width 0.3s ease;
    }

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const ContactBtn = styled.button`
  background: none;
  border: none;
  font-weight: 500;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  position: relative;
  padding: 0;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover::after {
    width: 100%;
  }
`;

// ========== 컴포넌트 ==========
const Navbar = ({ onContactClick }) => {
  return (
    <Nav>
      <GlitchLogo to="/">
        <span className="glitch-text">Snoer</span>
        <span className="glitch-clone-top" aria-hidden="true">
          Snoer
        </span>
        <span className="glitch-clone-bottom" aria-hidden="true">
          Snoer
        </span>
      </GlitchLogo>
      <Menu>
        <Link to="/projects">Projects</Link>
        {/* ↓ Link → button으로 교체 */}
        <ContactBtn onClick={onContactClick}>Contact</ContactBtn>
      </Menu>
    </Nav>
  );
};

export default Navbar;
