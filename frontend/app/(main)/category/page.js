'use client';
import React, { useState } from 'react';
import {
  Typography, TextField, Button, Box, IconButton, Paper, Grid, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Categories() {
  const [categories, setCategories] = useState([
    'Housing',
    'Groceries',
    'Transportation',
    'Utilities'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');

  const handleAdd = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDelete = (index) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedValue(categories[index]);
  };

  const handleSaveEdit = (index) => {
    const updated = [...categories];
    updated[index] = editedValue;
    setCategories(updated);
    setEditingIndex(null);
    setEditedValue('');
  };

  return (
    <div sx={{ minWidth: 3000, m: 30}}>
      <Paper elevation={20} sx={{ p: 10 }}>
        <Typography variant="h5" gutterBottom>
          Categories Management
        </Typography>

        <Divider sx={{ m: 4 }} />

        {/* List of categories */}
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            {editingIndex === index ? (
              <>
                <TextField
                  size="small"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                />
                <Button onClick={() => handleSaveEdit(index)} variant="contained" size="small" sx={{ ml: 1 }}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography>{category}</Typography>
                <Box>
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        ))}

        <Divider sx={{ my: 4 }} />

        {/* Add new category */}
        <Typography variant="subtitle1" gutterBottom>
          Add New Category
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
