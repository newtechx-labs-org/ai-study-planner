'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Select, MenuItem, Button
} from '@mui/material';

export default function AddTransaction({ open, handleClose }) {
  const [date, setDate] = useState('');
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const handleSave = () => {
    const newTransaction = { date, type, category, description };
    console.log('Submitting transaction:', newTransaction);

    // Optional: POST to backend
    // fetch('/api/transactions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newTransaction)
    // });

    handleClose(); // Close dialog after saving
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Transaction</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={e => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl margin="normal">
          <FormLabel>Type</FormLabel>
          <RadioGroup
            row
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <FormControlLabel value="Income" control={<Radio />} label="Income" />
            <FormControlLabel value="Expense" control={<Radio />} label="Expense" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Select
            displayEmpty
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <MenuItem value="" disabled>Select category</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained">Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
