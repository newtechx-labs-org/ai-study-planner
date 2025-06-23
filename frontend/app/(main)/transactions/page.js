'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Typography, Box, TextField, MenuItem, Button, Table, TableHead,
  TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import axios from 'axios';
import AddTransaction from '../addtransaction/page';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [open, setOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredData = transactions.filter(t => {
    const typeMatch = typeFilter === 'All' || t.type === typeFilter;
    const categoryMatch = categoryFilter === 'All' || t.category === categoryFilter;
    return typeMatch && categoryMatch;
  });

  return (
    <Box p={2}>

       <Button variant="contained" color="success" onClick={() => setOpen(true)} p={8}>
        Add Transaction
      </Button>
      <AddTransaction open={open} handleClose={() => setOpen(false)} />
      
      <Typography variant="h4" gutterBottom>Transactions</Typography>

      {/* Filter Controls */}
      <Box display="flex" gap={5} m={3}>
        <TextField
         
          select
          placeholder={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
          <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
        </TextField>
        
        <TextField
          placeholder="Type"
          p='5'
          select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Income">Income</MenuItem>
          <MenuItem value="Expense">Expense</MenuItem>
        </TextField>

        <TextField
          placeholder="Category"
          select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Housing">Housing</MenuItem>
          <MenuItem value="Transportation">Transportation</MenuItem>
          <MenuItem value="Income">Income</MenuItem>
        </TextField>

        <Button variant="contained" onClick={fetchTransactions}>Apply Filters</Button>
      </Box>

      {/* Table */}
      <Paper>
        <Table sx={{ border: '1px solid #ccc' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ border: '1px solid #ccc' }}>Date</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Description</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Category</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Amount</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((t, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid #ccc' }}>{t.date}</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>{t.description}</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>{t.category}</TableCell>
                <TableCell
                  sx={{
                    border: '1px solid #ccc',
                    color: t.type === 'Income' ? 'green' : 'red'
                  }}
                >
                  {t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}
                </TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>
                  ✏️ 🗑️
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
