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
  Paper,
  IconButton,
  Avatar,
} from '@mui/material';
import AppTheme from './theme/AppTheme';
import AdminAppBar from './components/AdminAppBar'; // Custom AppBar for Admin

const CourseRecommendation = (props) => {
  // State to store courses data
  const [coursesData, setCoursesData] = useState([
    {
      id: 1,
      courseName: 'Data Science with Python',
      skills: 'Python, Data Science, Machine Learning',
      level: 'Intermediate',
      duration: '3 months',
      platform: 'Coursera',
      thumbnail: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
    {
      id: 2,
      courseName: 'Machine Learning A-Z',
      skills: 'Python, Machine Learning, Deep Learning',
      level: 'Beginner',
      duration: '6 months',
      platform: 'Udemy',
      thumbnail: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
    {
      id: 3,
      courseName: 'AI for Robotics',
      skills: 'AI, Robotics, Python, Machine Learning',
      level: 'Advanced',
      duration: '4 months',
      platform: 'Udacity',
      thumbnail: 'https://via.placeholder.com/150', // Replace with actual image URL
    },
  ]);

  // State for dropdown filters
  const [skillsFilter, setSkillsFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  // Filtered data based on dropdown selections
  const filteredCourses = coursesData.filter((course) => {
    return (
      (skillsFilter === 'All' || course.skills.toLowerCase().includes(skillsFilter.toLowerCase())) &&
      (levelFilter === 'All' || course.level === levelFilter)
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
          Course Recommendations
        </Typography>

        {/* Dropdown Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Skills:
            </Typography>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <Select
                displayEmpty
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="AI">AI</MenuItem>
                <MenuItem value="Robotics">Robotics</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Level:
            </Typography>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                displayEmpty
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Course Cards Display */}
        <Grid container spacing={4} sx={{ justifyContent: 'center', px: 2 , pr: 10}}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                }}
              >
                {/* Thumbnail */}
                <Avatar
                  src={course.thumbnail}
                  alt={course.courseName}
                  sx={{ width: 150, height: 150, mb: 2, alignSelf: 'center' }}
                />

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {course.courseName}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Skills: {course.skills}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Level: {course.level}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Duration: {course.duration}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Platform: {course.platform}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppTheme>
  );
};

export default CourseRecommendation;
