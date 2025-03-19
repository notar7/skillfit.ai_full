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
  Button,
  Pagination,
  PaginationItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LaunchIcon from '@mui/icons-material/Launch';
import AppTheme from './theme/AppTheme';
import UserAppBar from './components/UserAppBar';
import axios from 'axios';

const CourseRecommendation = (props) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleVisitCourse = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <UserAppBar />

      <Box sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Recommended Courses
        </Typography>

        <Box sx={{ display: 'flex', mb: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography variant="subtitle2" sx={{ mr: 2 }}>Select Category</Typography>
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
                <TableCell align="center">Action</TableCell>
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
                    <TableCell align="center">{course.course_name}</TableCell>
                    <TableCell align="center">{course.course_source}</TableCell>
                    <TableCell align="center">{course.course_category}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<LaunchIcon />}
                        onClick={() => handleVisitCourse(course.course_link)}
                      >
                        Visit Course
                      </Button>
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
      </Box>
    </AppTheme>
  );
};

export default CourseRecommendation; 