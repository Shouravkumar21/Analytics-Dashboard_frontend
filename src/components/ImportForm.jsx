import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchProducts, fetchStats } from '../store/productSlice';
import toast from 'react-hot-toast';

const ImportForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    const toastId = toast.loading('Uploading and processing data...');
    try {
      await axios.post('https://analytics-dashboard-kk32.onrender.com/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Data imported successfully!', { id: toastId });
      dispatch(fetchProducts({ page: 1, limit: 10 }));
      dispatch(fetchStats());
    } catch (error) {
      console.error(error);
      toast.error('Import failed. Please check the file format and try again.', { id: toastId });
    } finally {
      setUploading(false);
      setFile(null);
      e.target.value = null;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <input
        accept=".csv, .xlsx, .xls"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button 
          variant="contained" 
          component="span" 
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          disabled={uploading}
          sx={{ borderRadius: '8px' }}
        >
          {uploading ? 'Processing...' : 'Import Data'}
        </Button>
      </label>
    </Box>
  );
};

export default ImportForm;
