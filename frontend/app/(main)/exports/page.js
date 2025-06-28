'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';

export default function ExportPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions') // adjust port if needed
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Failed to fetch transactions:', err));
  }, []);

  const handleExport = () => {
    window.open('http://localhost:5000/api/export', '_blank');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">PERSONAL FINANCE TRACKER</Typography>
      <Typography variant="h5" gutterBottom textAlign="center">Export</Typography>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx, idx) => (
              <TableRow key={idx}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>${tx.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={handleExport}>Export</Button>
        <Button variant="contained" color="primary">View Full Report</Button>
      </Box>
    </Box>
  );
}
