import React from 'react';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // Ajustar si la Navbar tiene otra altura
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        textAlign: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: '#2B2B2B' }}>
          M-Lifting
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#2B2B2B', opacity: 0.9 }}>
          Tu Asistente Personal de Gimnasio con IA
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4, color: '#2B2B2B', opacity: 0.7 }}>
          Transforma tu entrenamiento con análisis de IA, planes personalizados y seguimiento inteligente.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" size="large" component={Link} to="/register">
              ¡Empieza tu prueba gratis de 15 días!
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" size="large" component={Link} to="/login">
              Ya tengo cuenta
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 