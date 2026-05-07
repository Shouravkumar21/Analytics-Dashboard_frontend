import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, search, category, minReview }) => {
    const response = await axios.get(`${API_BASE}/products`, {
      params: { page, limit, search, category, minReview },
    });
    return response.data;
  }
);

export const fetchStats = createAsyncThunk(
  'products/fetchStats',
  async () => {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data;
  }
);

export const clearProducts = createAsyncThunk(
  'products/clearProducts',
  async () => {
    const response = await axios.delete(`${API_BASE}/products/clear`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    stats: {
      productsPerCategory: [],
      topReviewed: [],
      discountDist: [],
      avgRating: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setPage } = productSlice.actions;
export default productSlice.reducer;
