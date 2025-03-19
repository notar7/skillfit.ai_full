import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  Grid,
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the dustbin icon
import AppTheme from './theme/AppTheme';
import AdminAppBar from './components/AdminAppBar'; // Custom AppBar for Admin
import axios from 'axios';

const StudentDetails = (props) => {
  const [studentsData, setStudentsData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static department options
  const departments = [
    'CS',
    'IT',
    'MECH',
    'ELECT',
    'ENTC',
    'ECE',
    'AI&DS',
    'AI&ML'
  ];
  
  const years = ['FE', 'SE', 'TE', 'BE'];

  // Fetch students data
  useEffect(() => {
    fetchStudentsData();
  }, [departmentFilter, yearFilter]);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/admin/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          department: departmentFilter !== 'All' ? departmentFilter : undefined,
          year: yearFilter !== 'All' ? yearFilter : undefined
        }
      });
      
      setStudentsData(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching students data:', error);
      setError('Failed to fetch student data. Please try again.');
      setStudentsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/admin/delete-student/${selectedStudent.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh the data after deletion
      fetchStudentsData();
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AdminAppBar /> {/* Custom AppBar for Admin */}

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
            mt: 10, // Add margin-top to push it down
          }}
        >
          Student Details
        </Typography>

        {/* Dropdown Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Department:
            </Typography>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Year:
            </Typography>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Student Details Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Sr No</TableCell>
                <TableCell align="center">Student Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Department</TableCell>
                <TableCell align="center">Year</TableCell>
                <TableCell align="center">College Name</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : studentsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No students found</TableCell>
                </TableRow>
              ) : (
                studentsData.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{student.full_name}</TableCell>
                    <TableCell align="center">{student.email}</TableCell>
                    <TableCell align="center">{student.department}</TableCell>
                    <TableCell align="center">{student.year}</TableCell>
                    <TableCell align="center">{student.college_name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{
                          backgroundColor: 'red',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'darkred',
                          },
                        }}
                        onClick={() => handleDeleteClick(student)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the data of {selectedStudent?.full_name}? 
              This action will remove all associated data including user details, scanned resumes, and analysis results.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppTheme>
  );
};

export default StudentDetails;
