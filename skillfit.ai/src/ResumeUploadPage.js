import * as React from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CssBaseline,
  TextField,
  CircularProgress,
  Chip,
} from '@mui/material';
import { CloudUpload, Work, Assessment } from '@mui/icons-material';
import AppTheme from './theme/AppTheme';
import UserHero from './components/Userhero';
import UserAppBar from './components/UserAppBar';
import { useNavigate } from 'react-router-dom';

const ResumeUploader = (props) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [jobDescription, setJobDescription] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisData, setAnalysisData] = React.useState(null);
  const navigate = useNavigate();

  const steps = [
    { label: 'Upload Resume', icon: <CloudUpload /> },
    { label: 'Add Job', icon: <Work /> },
    { label: 'View Results', icon: <Assessment /> },
  ];

  const predefinedJobs = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Business Analyst',
    'Marketing Specialist',
    'Machine Learning Engineer',
    'Web Developer',
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
      setCurrentStep(1);
    }
  };

  const handleJobSelection = (job) => {
    setJobDescription(job);
  };

  const token = localStorage.getItem('token'); // Get token from localStorage

  const handleAnalysis = async () => {
    if (!uploadedFile || !jobDescription) {
      alert('Please upload a resume and enter a job description.');
      return;
    }
    
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('job_description', jobDescription);
    
    try {
      const response = await axios.post('http://localhost:8000/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      console.log("Response:", response.data);
      
      if (response.data.message) {
        console.log(response.data.message);
      }

      // The backend now sends the already parsed analysis
      const analysisData = response.data.analysis;
      
      if (!analysisData || typeof analysisData !== 'object') {
        throw new Error('Invalid analysis data received');
      }

      setAnalysisData(analysisData);
      navigate('/analysis', { state: { analysisData } });

    } catch (error) {
      console.error('Error analyzing resume:', error);
      let errorMessage = 'Error analyzing resume. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <UserAppBar/>
      <UserHero/>
      <Box id="resume-section" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 2, pt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4, textAlign: 'center', mt: 10 }}>Scan the Resume</Typography>
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4, width: '100%' }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={() => React.cloneElement(step.icon, { fontSize: 'large', color: 'primary' })}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {currentStep === 0 && (
          <Paper elevation={3} sx={{ p: 4, maxWidth: '600px', width: '100%', textAlign: 'center', border: '1px dashed', borderColor: 'primary.light', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Upload Your Resume</Typography>
            <Button variant="contained" color="primary" startIcon={<CloudUpload />} component="label" sx={{ my: 2 }}>
              Upload Your Resume
              <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileUpload} />
            </Button>
            {uploadedFile && <Typography variant="body2" sx={{ mt: 1 }}>Uploaded File: {uploadedFile.name}</Typography>}
          </Paper>
        )}
        {currentStep === 1 && (
          <Box sx={{ p: 4, maxWidth: '800px', width: '100%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.main', display: 'flex', gap: 6 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>Add Job Description</Typography>
              <TextField multiline rows={6} variant="filled" fullWidth placeholder="Type the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} sx={{ mt: 5, mb: 5 }} />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setCurrentStep(2)} // Move to View Results step
              >
                Proceed
              </Button>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Select a Predefined Job
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                {predefinedJobs.map((job, index) => (
                  <Chip
                    key={index}
                    label={job}
                    onClick={() => handleJobSelection(job)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.main' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {currentStep === 2 && (
          <Box
            sx={{
              p: 4,
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          >
            {isAnalyzing ? (
              <Box sx={{ p: 4, maxWidth: '600px', width: '100%', textAlign: 'center', bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.main' }}>
                <CircularProgress size={50} sx={{ mb: 2 }} />
                <Typography variant="h6">Analyzing your resume...</Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalysis}
              >
                Start Analysis
              </Button>
            )}
          </Box>
        )}
      </Box>
    </AppTheme>
  );
};

export default ResumeUploader;