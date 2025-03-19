import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Typography, Grid, Card, CircularProgress } from '@mui/material';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import AppTheme from './theme/AppTheme';
import AdminAppBar from './components/AdminAppBar';
import axios from 'axios';

const AdminDashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/admin/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <AdminAppBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }

  if (error) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <AdminAppBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </AppTheme>
    );
  }

  // KPI Cards
  const kpiCards = [
    { title: 'Total Users', value: dashboardData.kpi.total_users },
    { title: 'Total Resumes Scanned', value: dashboardData.kpi.total_resumes },
    { title: 'Total Jobs Analyzed', value: dashboardData.kpi.total_jobs },
    { title: 'Average Match Rate', value: `${dashboardData.kpi.avg_match_rate.toFixed(2)}%` },
    { title: 'Top Department', value: dashboardData.kpi.top_department },
    { title: 'Total Departments', value: dashboardData.charts.students_by_department.length }
  ];

  // Transform data for charts
  const resumeScanDataset = dashboardData.charts.resume_scans.map(scan => ({
    x: new Date(scan.month).toLocaleString('default', { month: 'short' }),
    y: parseInt(scan.count)
  }));

  const studentsByDepartmentDataset = dashboardData.charts.students_by_department
    .filter(dept => dept.department !== 'N/A') // Exclude 'N/A' department
    .map(dept => ({
      x: dept.department,
      y: dept.students.split(', ').filter(name => name !== 'Admin User').length // Count students
    }));

  const topStudentsDataset = dashboardData.charts.top_students.map(student => ({
    x: student.full_name,
    y: parseInt(student.highest_match_score)
  }));

  const resumesByDepartmentDataset = dashboardData.charts.resumes_by_department.map(dept => ({
    x: dept.department,
    y: parseInt(dept.resume_count)
  }));

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
            ml: 10,
          }}
        >
          Admin Dashboard
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {kpiCards.map((kpi, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{kpi.title}</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>{kpi.value}</Typography>
              </Card>
            </Grid>
          ))}

          {/* Resumes Scanned by Month */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Resumes Scanned by Month
              </Typography>
              <LineChart
                dataset={resumeScanDataset}
                xAxis={[{ 
                  dataKey: 'x',
                  scaleType: 'band',
                  tickLabelStyle: { angle: 0, textAnchor: 'middle' }
                }]}
                series={[{ 
                  dataKey: 'y',
                  label: 'Scans',
                  color: '#2196f3',
                  area: true,
                }]}
                width={650}
                height={300}
              />
            </Card>
          </Grid>

          {/* Students by Department */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Students by Department
              </Typography>
              <BarChart
                dataset={studentsByDepartmentDataset}
                xAxis={[{ 
                  dataKey: 'x',
                  scaleType: 'band',
                  tickLabelStyle: { angle: 0, textAnchor: 'middle' }
                }]}
                series={[{ 
                  dataKey: 'y',
                  label: 'Number of Students',
                  color: '#3f51b5'
                }]}
                width={650}
                height={300}
              />
            </Card>
          </Grid>

          {/* Top 5 Students by Match Rate */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Top 5 Students by Highest Match Rate
              </Typography>
              <BarChart
                dataset={topStudentsDataset}
                xAxis={[{ 
                  dataKey: 'x',
                  scaleType: 'band',
                  tickLabelStyle: { angle: 0, textAnchor: 'middle' }
                }]}
                series={[{ 
                  dataKey: 'y',
                  label: 'Highest Match Rate',
                  color: '#4caf50'
                }]}
                layout="vertical"
                width={650}
                height={300}
              />
            </Card>
          </Grid>

          {/* Resumes Scanned by Department */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Resumes Scanned by Department
              </Typography>
              <BarChart
                dataset={resumesByDepartmentDataset}
                xAxis={[{ 
                  dataKey: 'x',
                  scaleType: 'band',
                  tickLabelStyle: { angle: 0, textAnchor: 'middle' }
                }]}
                series={[{ 
                  dataKey: 'y',
                  label: 'Resumes',
                  color: '#ff9800'
                }]}
                width={650}
                height={300}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppTheme>
  );
};

export default AdminDashboard;
