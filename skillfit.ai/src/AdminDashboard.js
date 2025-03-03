import React from 'react';
import { Box, CssBaseline, Typography, Grid, Card } from '@mui/material';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import AppTheme from './theme/AppTheme';
import AdminAppBar from './components/AdminAppBar';

const AdminDashboard = (props) => {
  // Define datasets for each chart
  const resumeScanDataset = [
    { x: 'Jan', y: 50 },
    { x: 'Feb', y: 70 },
    { x: 'Mar', y: 90 },
    { x: 'Apr', y: 60 },
    { x: 'May', y: 120 },
  ];

  const issueBreakdownDataset = [
    { x: 'Searchability', y: 40 },
    { x: 'Hard Skills', y: 60 },
    { x: 'Soft Skills', y: 50 },
    { x: 'Recruiter Tips', y: 30 },
    { x: 'Formatting', y: 20 },
    { x: 'Keywords', y: 90 },
  ];

  const hardSkillsDataset = [
    { label: 'Python', value: 40 },
    { label: 'SQL', value: 30 },
    { label: 'React', value: 20 },
    { label: 'Data Analysis', value: 10 },
  ];
  

  const studentEngagementDataset = [
    { x: 'Computer Science', y: 80 },
    { x: 'Mechanical', y: 50 },
    { x: 'Electronics', y: 40 },
    { x: 'Civil', y: 30 },
  ];

  const matchRateDataset = [
    { x: '50-60%', y: 20 },
    { x: '60-70%', y: 40 },
    { x: '70-80%', y: 30 },
    { x: '80-90%', y: 10 },
  ];

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AdminAppBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 4,
          mr: 8,
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
          Admin Dashboard
        </Typography>
        <Grid container spacing={4}>
          {/* Resumes Scanned Over Time */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Resumes Scanned Over Time
              </Typography>
              <LineChart
                dataset={resumeScanDataset}
                xAxis={[{ dataKey: 'x', scaleType: 'band' }]}
                series={[{ dataKey: 'y' }]}
                width={650}
                height={300}
              />
            </Card>
          </Grid>

          {/* Issues Breakdown */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Issues Breakdown
              </Typography>
              <BarChart
                dataset={issueBreakdownDataset}
                xAxis={[{ dataKey: 'x', scaleType: 'band' }]}
                series={[{ dataKey: 'y' }]}
                width={650}
                height={300}
              />
            </Card>
          </Grid>

          {/* Hard Skills Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Top Missing Hard Skills
              </Typography>
              <PieChart
                series={[
                  {
                    data: hardSkillsDataset,
                    valueKey: 'value',
                    idKey: 'id',
                    highlightScope: { fade: 'global', highlight: 'item' }, // Highlights the active arc
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'lightgray' }, // Styling for inactive arcs
                    label: {
                      formatter: (params) => `${params.value}`, // Combines key and value
                      position: 'inside', // Places the label outside the arc
                      style: { fontSize: 14, fontWeight: 'bold', fill: '#333' }, // Custom styling for the labels
                    },
                    innerRadius: 50, // Adjusts the size of the inner circle
                    outerRadius: 120, // Adjusts the size of the chart
                  },
                ]}
                height={300}
                width={600}
              />
            </Card>
          </Grid>


          {/* Student Engagement by Department */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Student Engagement by Department
              </Typography>
              <BarChart
                dataset={studentEngagementDataset}
                xAxis={[{ dataKey: 'x', scaleType: 'band' }]}
                series={[{ dataKey: 'y' }]}
                width={650}
                height={300}
              />
            </Card>
          </Grid>

                    {/* Match Rate Distribution */}
                    <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Match Rate Distribution
              </Typography>
              <BarChart
                dataset={matchRateDataset}
                xAxis={[{ dataKey: 'x', scaleType: 'band' }]}
                series={[{ dataKey: 'y' }]}
                width={1350}
                height={450}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppTheme>
  );
};

export default AdminDashboard;
