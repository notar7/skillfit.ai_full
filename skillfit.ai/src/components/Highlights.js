import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded'; // Personalized Feedback
import BalanceRoundedIcon from '@mui/icons-material/BalanceRounded'; // Inclusive and Fair Analysis
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'; // Data-Driven Insights
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded'; // Easy Integration
import FreeBreakfastRoundedIcon from '@mui/icons-material/FreeBreakfastRounded'; // Free to Use
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded'; // Advanced AI Technology

const items = [
  {
    icon: <FeedbackRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Personalized Feedback',
    description:
      'Get real-time feedback on resume formatting, keyword optimization, and job relevance.',
  },
  {
    icon: <BalanceRoundedIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
    title: 'Inclusive and Fair Analysis',
    description:
      'Promote diversity with advanced bias detection algorithms that suggest inclusive language.',
  },
  {
    icon: <BarChartRoundedIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    title: 'Data-Driven Insights for Institutions',
    description:
      'Empower universities and career services with dashboards that highlight student performance trends and skill gaps.',
  },
  {
    icon: <SyncAltRoundedIcon sx={{ fontSize: 48, color: 'info.main' }} />,
    title: 'Easy Integration',
    description:
      'Seamlessly connect with job descriptions provided by students for tailored resume matching.',
  },
  {
    icon: <FreeBreakfastRoundedIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
    title: 'Free to Use',
    description:
      'Unlike costly existing tools, SkillFit.AI provides its services at no cost, making it accessible to everyone.',
  },
  {
    icon: <MemoryRoundedIcon sx={{ fontSize: 48, color: 'error.main' }} />,
    title: 'Advanced AI-Powered Technology',
    description:
      'Powered by state-of-the-art AI models, including Google Gemini API, for precise and intelligent resume analysis.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Discover why SkillFit.AI excels: intelligent adaptability, robust performance, user-centric design, and cutting-edge innovation. Benefit from unparalleled support and precision in every feature.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
