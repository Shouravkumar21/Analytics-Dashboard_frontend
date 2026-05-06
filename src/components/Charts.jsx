import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Grid, Paper, Typography, Box } from '@mui/material';

// Custom tooltip styling for premium feel
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid #334155', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="subtitle2" color="primary.main">
          Value: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

const Charts = () => {
  const { stats } = useSelector((state) => state.products);
  const loading = !stats || stats.productsPerCategory.length === 0;

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Typography color="text.secondary">Upload data to see visualizations</Typography>
      </Paper>
    );
  }

  // Pre-process average rating to limit decimals
  const avgRatingData = stats.avgRating?.map(item => ({
    ...item,
    average_rating: parseFloat(item.average_rating).toFixed(1)
  }));

  return (
    <Grid container spacing={3}>
      {/* Products per Category */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 350, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Products per Category</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.productsPerCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {stats.productsPerCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Top Reviewed Products */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 350, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Top Reviewed Products</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topReviewed} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="product_name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="review_count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Discount Distribution (Histogram) */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 350, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Discount Distribution</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.discountDist} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="discount" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} label={{ value: 'Discount %', position: 'insideBottom', offset: -15, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Category-wise Average Rating */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 350, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Average Rating by Category</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgRatingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="average_rating" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Charts;
