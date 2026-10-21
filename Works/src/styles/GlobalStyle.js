import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textMain};
    line-height: 1.6;
    overflow-x: hidden;
    /* 한글은 단어 단위로 줄바꿈 ("등/급" 같은 음절 쪼개짐 방지),
       공백 없는 긴 단어는 넘칠 때만 끊어서 박스 밖으로 새지 않게 */
    word-break: keep-all;
    overflow-wrap: break-word;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
  
  ul {
    list-style: none;
  }
`;

export default GlobalStyle;
