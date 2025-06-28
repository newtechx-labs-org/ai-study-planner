'use client';
import React from 'react';
import {
  Grid, Box, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

import {
  Pie, Bar, Line
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement
} from 'chart.js';

import Link from 'next/link';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement
);

// Chart Data
const pieData = {
  labels: ['Rent', 'Groceries', 'Utilities'],
  datasets: [{
    data: [500, 700, 300],
    backgroundColor: ['#3f51b5', '#4caf50', '#00bcd4'],
    borderWidth: 0
  }]
};

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data: [5000, 4500, 4000, 4200, 4800, 5000],
      backgroundColor: '#3f51b5'
    },
    {
      label: 'Expenses',
      data: [3000, 2800, 2500, 2700, 3000, 3200],
      backgroundColor: '#4caf50'
    }
  ]
};

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Savings',
    data: [2000, 2200, 2400, 2700, 2900, 3200],
    borderColor: '#00bcd4',
    tension: 0.4,
    fill: false
  }]
};

export default function Dashboard() {
  return (
    <Grid container>
      {/* Sidebar */}
      

      {/* Main Dashboard */}
      <Grid item xs={10} sx={{ p: 3 }}>
        <Grid container spacing={6}>

          
          {/* Charts */}
          <Grid item xs={6}><Paper elevation={3} sx={{ p: 2 }}><Typography>Spending by Category</Typography><Pie data={pieData} /></Paper></Grid>
          <Grid item xs={6}><Paper elevation={3} sx={{ p: 2 }}><Typography>Monthly Income vs Expenses</Typography><Bar data={barData} /></Paper></Grid>
          <Grid item xs={6}><Paper elevation={3} sx={{ p: 2 }}><Typography>Savings Over Time</Typography><Line data={lineData} /></Paper></Grid>

          {/* Cards */}
          <Grid item xs={4}><Paper elevation={3} sx={{ p: 2 }}><Typography>Total Income</Typography><Typography variant="h5">$5,000.00</Typography></Paper></Grid>
          <Grid item xs={4}><Paper elevation={3} sx={{ p: 2 }}><Typography>Total Expenses</Typography><Typography variant="h5">$3,000.00</Typography></Paper></Grid>
          <Grid item xs={4}><Paper elevation={3} sx={{ p: 2 }}><Typography>Savings</Typography><Typography variant="h5" color="green">$2,000.00</Typography></Paper></Grid>


          {/* Buttons */}
          <Grid item xs={6} display="flex" alignItems="center" justifyContent="center">
            <Link href='/transactions'><Button variant="contained" color="success">Transaction</Button></Link>
            <Button variant="contained" color="success" sx={{ ml: 2 }}>View Full Report</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
