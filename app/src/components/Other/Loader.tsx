import {
    Box,
    CircularProgress,
    Container
  } from '@mui/material';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #202020;
  min-height: 100vh;
  color: white;
`;


const Loader = () => {
return <PageContainer>
    <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#FCD25E' }} />
        </Box>
    </Container>
    </PageContainer>
}

export default Loader;