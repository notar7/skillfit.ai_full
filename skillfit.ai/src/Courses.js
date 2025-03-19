import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  PaginationItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppTheme from './theme/AppTheme';
import AdminAppBar from './components/AdminAppBar';
import axios from 'axios';

const Courses = (props) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    course_name: '',
    course_source: '',
    course_category: '',
    course_link: ''
  });

  const ITEMS_PER_PAGE = 10;

  const categories = [
    "All",
    "Data Science",
    "Web Development",
    "Android Development",
    "iOS Development",
    "UI/UX",
    "Resume Tips",
    "Interview Tips",
    "Software Development",
    "DSA",
    "Competitive Programming",
    "Cloud & DevOps",
    "Cybersecurity"
  ];

  useEffect(() => {
    fetchCourses();
  }, [category, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          category: category === 'All' ? undefined : category,
          page: page,
          limit: ITEMS_PER_PAGE
        }
      });
      
      setCourses(response.data.courses);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/courses', newCourse, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOpenAddDialog(false);
      setNewCourse({
        course_name: '',
        course_source: '',
        course_category: '',
        course_link: ''
      });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/courses/${selectedCourse.course_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOpenDeleteDialog(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AdminAppBar />

      <Box sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Courses
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              size="small"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Course
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Sr No</TableCell>
                <TableCell align="center">Course Name</TableCell>
                <TableCell align="center">Source</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No courses found</TableCell>
                </TableRow>
              ) : (
                courses.map((course, index) => (
                  <TableRow key={course.course_id}>
                    <TableCell align="center">{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                    <TableCell align="center">
                      <a 
                        href={course.course_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {course.course_name}
                      </a>
                    </TableCell>
                    <TableCell align="center">{course.course_source}</TableCell>
                    <TableCell align="center">{course.course_category}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedCourse(course);
                          setOpenDeleteDialog(true);
                        }}
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

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Box>

        {/* Add Course Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogContent sx={{ pb: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '400px', mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Course Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter course name"
                  value={newCourse.course_name}
                  onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Source</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter source (e.g., Coursera, Udemy)"
                  value={newCourse.course_source}
                  onChange={(e) => setNewCourse({ ...newCourse, course_source: e.target.value })}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Category</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={newCourse.course_category}
                    onChange={(e) => setNewCourse({ ...newCourse, course_category: e.target.value })}
                    displayEmpty
                    placeholder="Select a category"
                  >
                    <MenuItem disabled value="">
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.filter(cat => cat !== 'All').map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Course Link</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter course URL"
                  value={newCourse.course_link}
                  onChange={(e) => setNewCourse({ ...newCourse, course_link: e.target.value })}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCourse} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Course Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {selectedCourse?.course_name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteCourse} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppTheme>
  );
};

export default Courses;
