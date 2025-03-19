import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, textAlign: 'center' }}>
      {'© '}
      {new Date().getFullYear()} SkillFit.AI. All rights reserved.
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        bgcolor: 'grey.900',
        color: 'white',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        {/* Navigation Links */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
          <Link href="#features" color="inherit" underline="hover">
            Features
          </Link>
          <Link href="#faq" color="inherit" underline="hover">
            FAQs
          </Link>
          <Link href="#aboutus" color="inherit" underline="hover">
            About Us
          </Link>
        </Box>

        {/* Copyright */}
        <Copyright />
      </Container>
    </Box>
  );
}
