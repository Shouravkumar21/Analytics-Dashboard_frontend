import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, Grid, Typography, Box, Paper, TextField, 
  MenuItem, Select, FormControl, InputLabel, AppBar, Toolbar,
  Card, CardContent, IconButton, InputAdornment, Button
} from '@mui/material';
import { 
  Analytics as AnalyticsIcon, 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Inventory2 as InventoryIcon,
  Category as CategoryIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { fetchProducts, fetchStats, setPage, clearProducts } from '../store/productSlice';
import ProductTable from './ProductTable';
import Charts from './Charts';
import ImportForm from './ImportForm';
import toast from 'react-hot-toast';
import { Delete as DeleteIcon } from '@mui/icons-material';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { page, limit, total, stats } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minReview, setMinReview] = useState(0);

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        await dispatch(clearProducts()).unwrap();
        toast.success('All data cleared successfully');
        dispatch(fetchProducts({ page: 1, limit: 10 }));
        dispatch(fetchStats());
      } catch (err) {
        toast.error('Failed to clear data');
      }
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      dispatch(fetchProducts({ page, limit, search, category, minReview }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [dispatch, page, limit, search, category, minReview]);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const categories = ['Electronics', 'Home', 'Beauty', 'Toys', 'Sports', 'Clothing']; // Could also be derived from stats.productsPerCategory

  // Calculate some KPIs
  const totalCategories = stats.productsPerCategory?.length || 0;
  const avgOverallRating = useMemo(() => {
    if (!stats.avgRating || stats.avgRating.length === 0) return 0;
    const sum = stats.avgRating.reduce((acc, curr) => acc + parseFloat(curr.average_rating), 0);
    return (sum / stats.avgRating.length).toFixed(1);
  }, [stats.avgRating]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar / Header */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar>
          <AnalyticsIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            Analytics Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={handleDeleteAll}
              sx={{ borderRadius: '8px' }}
            >
              Reset Data
            </Button>
            <ImportForm />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        
        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Box sx={{ bgcolor: 'primary.dark', p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
                <InventoryIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Products</Typography>
                <Typography variant="h4">{total}</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Box sx={{ bgcolor: 'secondary.dark', p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
                <CategoryIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Active Categories</Typography>
                <Typography variant="h4">{totalCategories}</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Box sx={{ bgcolor: '#059669', p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
                <StarIcon sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Avg Category Rating</Typography>
                <Typography variant="h4">{avgOverallRating}</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Charts Section */}
          <Grid item xs={12}>
            <Charts />
          </Grid>

          {/* Filters Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
              <Typography variant="h5" sx={{ flexGrow: 1 }}>Product Directory</Typography>
              <TextField
                placeholder="Search products..."
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value=""><em>All Categories</em></MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Min Reviews"
                type="number"
                variant="outlined"
                size="small"
                value={minReview}
                onChange={(e) => setMinReview(e.target.value)}
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>

          {/* Table Section */}
          <Grid item xs={12}>
            <ProductTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
