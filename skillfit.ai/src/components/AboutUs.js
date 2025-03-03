import * as React from 'react';
import { Container, Grid, Typography, Card, Avatar, Box } from '@mui/material';
import { styled } from '@mui/system';
import arinImage from '../assets/arin.png';
import aryanImage from '../assets/aryan.png';
import ashishImage from '../assets/ashish.png';
import siddImage from '../assets/sidd.png';

// Styled components using MUI's `styled` API
const MemberCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  textAlign: 'center',
  boxShadow: theme.shadows[4],
}));

const MemberAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
}));

const MemberName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginTop: theme.spacing(1),
}));

const MemberDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.95rem',
  marginTop: theme.spacing(1),
}));

const MemberRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  marginTop: theme.spacing(1),
}));

// About Us Component
export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Arin Lale',
      image: arinImage,
      description: 'B.E. Artificial Intelligence and Data Science',
      role: 'AI and Backend Development'
    },
    {
      name: 'Ashish Ransing',
      image: ashishImage,
      description: 'B.E. Artificial Intelligence and Data Science',
      role: 'Frontend Development'
    },
    {
      name: 'Aryan Gole',
      image: aryanImage,
      description: 'B.E. Artificial Intelligence and Data Science',
      role: 'Integration and Backend'
    },
    {
      name: 'Siddheya Lohar',
      image: siddImage,
      description: 'B.E. Artificial Intelligence and Data Science',
      role: 'Database Management'
    },
  ];

  return (
    <Container
      id="aboutus"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography component="h2" variant="h4" gutterBottom>
        Meet Our Team
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MemberCard>
              <MemberAvatar alt={member.name} src={member.image} />
              <MemberName variant="h6">{member.name}</MemberName>
              <MemberRole variant="body2">{member.role}</MemberRole>
              <MemberDescription variant="body2">{member.description}</MemberDescription>
              
            </MemberCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
