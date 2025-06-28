'use client';
import { useState } from 'react';
import {
  Box, Button, TextField, Typography, MenuItem, Avatar,
} from '@mui/material';

export default function Profile() {
  const [form, setForm] = useState({
    name: 'Shilpa',
    email: 'shilpa@example.com',
    password: '',
    currency: 'USD – US Dollar',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    alert(result.status || result.detail);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" mb={2}>Profile Settings</Typography>
      <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 2 }} />

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Currency"
        name="currency"
        value={form.currency}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="USD – US Dollar">USD – US Dollar</MenuItem>
        <MenuItem value="INR – Indian Rupee">INR – Indian Rupee</MenuItem>
        <MenuItem value="EUR – Euro">EUR – Euro</MenuItem>
      </TextField>
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, bgcolor: '#2563eb' }}
        onClick={handleSubmit}
      >
        Save Changes
      </Button>
    </Box>
  );
}
