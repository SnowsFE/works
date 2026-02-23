import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

import Navbar from "./components/common/Navbar";
import Projects from "./pages/Projects";
import ContactModal from "./components/common/ContactModal";

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Navbar onContactClick={() => setIsContactOpen(true)} />
        <Routes>
          <Route path="/" element={<Projects />} />
        </Routes>

        {isContactOpen && (
          <ContactModal onClose={() => setIsContactOpen(false)} />
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
