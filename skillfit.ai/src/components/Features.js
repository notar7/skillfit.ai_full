import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'; // ATS-Friendly Resume Analysis
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded'; // Bias Detection
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'; // Institutional Insights

import atsImage from '../assets/ats.png';
import courseImage from '../assets/course.png';
import dashboardImage from '../assets/dashboard.png';

const items = [
  {
    icon: <DescriptionRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'ATS-Friendly Resume Analysis',
    description:
      'Ensure your resume is optimized for Applicant Tracking Systems (ATS) with advanced keyword matching and formatting analysis.',
    image: atsImage, // Replace with your image URL
  },
  {
    icon: <Diversity3RoundedIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
    title: 'Course Recommendations',
    description:
      'Receive personalized course recommendations tailored to address individual skill gaps, empowering students to enhance their employability and career prospects.',
    image: courseImage, // Replace with your image URL
  },
  {
    icon: <InsightsRoundedIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    title: 'Institutional Insights',
    description:
      'Enable institutions to leverage data-driven insights for tracking student performance, identifying skill gaps, and providing actionable advice to improve employability outcomes.',
    image: dashboardImage, // Replace with your image URL
  },
];


const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={{
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 280,
            backgroundImage: `url(${selectedFeature.image})`, // Use the single image
          }}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    image: PropTypes.string.isRequired, // Updated prop type
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Key Features
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Explore the standout features of SkillFit.AI, designed to enhance resumes, promote inclusivity, and provide actionable insights for institutions.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description, image }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}

                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                m: 'auto',
                mt: 7,
                width: '100%', // Adjust for responsiveness
                height: 400, // Set fixed height
                backgroundSize: 'contain', // Make the image fit nicely
                backgroundRepeat: 'no-repeat', // Stop repetition
                backgroundPosition: 'center center', // Center the image
                backgroundImage: `url(${selectedFeature.image})`, // Load the image
              }}
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}