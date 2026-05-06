import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  CircularProgress,
  Typography,
  Chip
} from '@mui/material';
import { setPage } from '../store/productSlice';

const ProductTable = () => {
  const dispatch = useDispatch();
  const { data, total, page, limit, loading } = useSelector((state) => state.products);

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Reviews</TableCell>
              <TableCell align="right">Discount</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  <Typography variant="body1">No products found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow 
                  hover 
                  role="checkbox" 
                  tabIndex={-1} 
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    {row.product_name}
                  </TableCell>
                  <TableCell>
                    <Chip label={row.category} size="small" variant="outlined" sx={{ borderColor: 'divider', color: 'text.secondary' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={row.rating} 
                      size="small" 
                      color={getRatingColor(row.rating)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>
                    {row.review_count.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'success.light', fontWeight: 500 }}>
                    {row.discount}%
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${row.price}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page - 1}
          onPageChange={handleChangePage}
          sx={{ color: 'text.secondary' }}
        />
      </Box>
    </Paper>
  );
};

export default ProductTable;
