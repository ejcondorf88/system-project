import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de inicio de sesión
    console.log('Datos de inicio de sesión:', formData);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <CardContent>
            <Box textAlign="center" mb={3}>
              <LockOpenIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 1, color: '#2B2B2B' }}>
                Bienvenido de Nuevo
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre de usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
              >
                Iniciar Sesión
              </Button>
              <Typography variant="body2" textAlign="center">
                ¿No tienes cuenta? <Link to="/register" style={{ textDecoration: 'none', color: '#FF4B2B' }}>Regístrate aquí</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login; 