import React, { useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the dustbin icon
import AppTheme from './theme/AppTheme';
import AdminAppBar from './components/AdminAppBar'; // Custom AppBar for Admin

const StudentDetails = (props) => {
  // State to store students' data
  const [studentsData, setStudentsData] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Computer Science',
      year: 'TE',
      resumesScanned: 5,
      suitableJob: 'Data Analyst',
      matchRate: '85%',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      department: 'Mechanical',
      year: 'BE',
      resumesScanned: 3,
      suitableJob: 'Design Engineer',
      matchRate: '75%',
    },
    {
      id: 3,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      department: 'Electronics',
      year: 'SE',
      resumesScanned: 4,
      suitableJob: 'Embedded Systems Engineer',
      matchRate: '80%',
    },
    {
      id: 4,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      department: 'Civil',
      year: 'FE',
      resumesScanned: 2,
      suitableJob: 'Site Engineer',
      matchRate: '70%',
    },
  ]);

  // State for dropdown filters
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  // Function to delete a student
  const handleDelete = (id) => {
    const updatedData = studentsData.filter((student) => student.id !== id);
    setStudentsData(updatedData);
  };

  // Filtered data based on dropdown selections
  const filteredData = studentsData.filter((student) => {
    return (
      (departmentFilter === 'All' || student.department === departmentFilter) &&
      (yearFilter === 'All' || student.year === yearFilter)
    );
  });

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
                displayEmpty
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Civil">Civil</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Year:
            </Typography>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                displayEmpty
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="FE">FE</MenuItem>
                <MenuItem value="SE">SE</MenuItem>
                <MenuItem value="TE">TE</MenuItem>
                <MenuItem value="BE">BE</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Student Details Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Resumes Scanned</TableCell>
                <TableCell>Suitable Job</TableCell>
                <TableCell>Match Rate</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.resumesScanned}</TableCell>
                  <TableCell>{student.suitableJob}</TableCell>
                  <TableCell>{student.matchRate}</TableCell>
                  <TableCell>
                    <IconButton
                        sx={{
                        backgroundColor: 'red', // Red background color
                        color: 'white',         // White icon color
                        '&:hover': {
                            backgroundColor: 'darkred', // Darker red for hover effect
                        },
                        }}
                        onClick={() => handleDelete(student.id)}
                    >
                    <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AppTheme>
  );
};

export default StudentDetails;
