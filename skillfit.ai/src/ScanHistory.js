import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import AppTheme from './theme/AppTheme';
import UserAppBar from './components/UserAppBar';
import axios from 'axios';

const ScanHistory = (props) => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/scan-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setScanHistory(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching scan history:', error);
      setError('Failed to fetch scan history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <UserAppBar />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 4,
            textAlign: 'center',
            mt: 10,
          }}
        >
          Scan History
        </Typography>

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Scan History Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Sr No</TableCell>
                <TableCell align="center">Resume Name</TableCell>
                <TableCell align="center">Job Description</TableCell>
                <TableCell align="center">Match Rate</TableCell>
                <TableCell align="center">Scanned Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : scanHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No scan history found</TableCell>
                </TableRow>
              ) : (
                scanHistory.map((scan, index) => (
                  <TableRow key={scan.resume_id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{scan.resume_name}</TableCell>
                    <TableCell align="center">
                      {scan.job_description.length > 100
                        ? `${scan.job_description.substring(0, 100)}...`
                        : scan.job_description}
                    </TableCell>
                    <TableCell align="center">{scan.match_score}%</TableCell>
                    <TableCell align="center">
                      {new Date(scan.scanned_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AppTheme>
  );
};

export default ScanHistory;
