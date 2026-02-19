import styled from "styled-components";

// 가상의 데이터 (나중에 별도 파일로 분리 추천)
const projectData = [
  {
    id: 1,
    title: "Project A",
    desc: "React를 활용한 대시보드",
    stack: ["React", "Recoil"],
  },
  {
    id: 2,
    title: "Project B",
    desc: "쇼핑몰 클론 코딩",
    stack: ["Next.js", "TypeScript"],
  },
  // ... 더 추가
];

const Container = styled.div`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ProjectDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSub};
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.textMain};
`;

const Projects = () => {
  return (
    <Container>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>My Works</h2>
      <Grid>
        {projectData.map((project) => (
          <Card key={project.id}>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDesc>{project.desc}</ProjectDesc>
            <TagContainer>
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </TagContainer>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
