import * as React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, CssBaseline, Typography, Grid, Card, CardContent, Button, Divider, LinearProgress, CircularProgress } from '@mui/material';
import AppTheme from './theme/AppTheme';
import UserAppBar from './components/UserAppBar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import HandymanIcon from '@mui/icons-material/Handyman';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import KeywordsIcon from '@mui/icons-material/EmojiObjects';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const AnalysisPage = (props) => {
  const location = useLocation();
  const [error, setError] = React.useState(null);
  const analysisData = location.state?.analysisData || {};

  React.useEffect(() => {
    // Validate that we have the required data
    if (!location.state?.analysisData) {
      setError("No analysis data available. Please try scanning your resume again.");
      return;
    }
  }, [location.state]);

  const matchPercentage = parseInt(analysisData["JD Match"]?.replace('%', '')) || 0;
  const matchRateColor = matchPercentage >= 75 ? 'green' : matchPercentage >= 35 ? 'yellow' : 'red';

  const getIssueColor = (count) => {
    if (count === 0) return 'green';
    if (count > 0 && count < 5) return 'yellow';
    return 'red';
  };


  const issues = {
    "Missing Skills": { count: Array.isArray(analysisData["Missing Skills"]) ? analysisData["Missing Skills"].length : 0, icon: <HandymanIcon /> },
    "Soft Skill Issues": { count: Array.isArray(analysisData["Soft Skill Issues"]) ? analysisData["Soft Skill Issues"].length : 0, icon: <TipsAndUpdatesIcon /> },
    "Formatting Issues": { count: Array.isArray(analysisData["Formatting Issues"]) ? analysisData["Formatting Issues"].length : 0, icon: <FormatAlignLeftIcon /> },
    "Keyword Issues": { count: Array.isArray(analysisData["Keyword Issues"]) ? analysisData["Keyword Issues"].length : 0, icon: <KeywordsIcon /> },
    "Recruiter Tips": { count: Array.isArray(analysisData["Recruiter Tips"]) ? analysisData["Recruiter Tips"].length : 0, icon: <TipsAndUpdatesIcon /> },
  };

  if (error) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <UserAppBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography color="error" variant="h6">{error}</Typography>
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <UserAppBar />
      <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', bgcolor: 'background.default', mt: '100px', p: 3, gap: 4 }}>
        {/* Left Panel */}
        <Box sx={{ width: '300px', minWidth: '250px', bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 3, mr: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>Match Rate</Typography>
          <Box sx={{ width: '150px', height: '150px', mx: 'auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress variant="determinate" value={100} size={150} thickness={6} sx={{ color: 'lightgray', position: 'absolute' }} />
            <CircularProgress variant="determinate" value={matchPercentage} size={150} thickness={6} sx={{ color: matchRateColor, position: 'absolute' }} />
            <Typography variant="h5" sx={{ color: matchRateColor, fontWeight: 'bold', position: 'absolute' }}>{matchPercentage}%</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={Link}
              to="/upload-resume"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ width: '100%' }}
            >
              Upload New & Rescan
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          {Object.entries(issues).map(([key, { count, icon }], index) => (
            <Box key={index} sx={{ mb: 4 }}> {/* Increased margin bottom for better spacing */}
              <Typography variant="body1" sx={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}> {/* Added margin bottom for spacing */}
                {icon} {key} ({count} Issues)
              </Typography>
              <LinearProgress variant="determinate" value={count === 0 ? 100 : count * 10} sx={{height: 8,borderRadius: 5,bgcolor: 'grey.300','& .MuiLinearProgress-bar': { bgcolor: getIssueColor(count) }}}
              />
            </Box>
          ))}
        </Box>

        {/* Center Panel - Single Column Layout */}
        <Box sx={{ flex: 1, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>Analysis Overview</Typography>
          <Grid container spacing={4} direction="column">
            {["Profile Summary", "STRENGTHS", "RECOMMENDATIONS",'Bias Detection', ...Object.keys(issues)].map((key, index) => (
              <Grid item xs={12} key={index} sx={{ mr: 7 }}>
                <Card sx={{ width: '100%', p: 3, borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {issues[key]?.icon || <ErrorOutlineIcon />} {key.replace(/_/g, ' ')}
                    </Typography>
                    {Array.isArray(analysisData[key]) ? (analysisData[key].length > 0 ? analysisData[key].map((desc, i) => (
                      <Typography key={i} variant="body2" sx={{ mt: 1 }}>- {desc}</Typography>
                    )) : <Typography variant="body2">No issues found</Typography>) : <Typography variant="body2">{analysisData[key] || 'N/A'}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default AnalysisPage;
