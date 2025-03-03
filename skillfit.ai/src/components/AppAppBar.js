import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SkillfitIcon from './SkillfitIcon';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { Link as ScrollLink } from 'react-scroll';  // Import Link from react-scroll
import { Link } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: { xs: 2, md: 'calc(var(--template-frame-height, 0px) + 28px)' },
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Left Section - Logo */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <SkillfitIcon />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {/* Desktop Navigation Links */}
              <Button
                component={ScrollLink}
                to="features"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                Features
              </Button>
              <Button
                component={ScrollLink}
                to="highlights"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                Highlights
              </Button>
              <Button
                component={ScrollLink}
                to="aboutus"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                About Us
              </Button>
              <Button
                component={ScrollLink}
                to="faq"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                FAQ
              </Button>
            </Box>
          </Box>

          {/* Right Section - Sign In/Sign Up */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button component={Link} to="/signin" color="primary" variant="text" size="small">
              Sign in
            </Button>
            <Button component={Link} to="/signup" color="primary" variant="contained" size="small">
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* Mobile Drawer Menu Links */}
                <MenuItem component={ScrollLink} to="features" smooth={true} duration={500}>
                  Features
                </MenuItem>
                <MenuItem component={ScrollLink} to="testimonials" smooth={true} duration={500}>
                  Testimonials
                </MenuItem>
                <MenuItem component={ScrollLink} to="aboutus" smooth={true} duration={500}>
                  aboutus
                </MenuItem>
                <MenuItem component={ScrollLink} to="faq" smooth={true} duration={500}>
                  FAQ
                </MenuItem>
                <MenuItem component={ScrollLink} to="blog" smooth={true} duration={500}>
                  Blog
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button component={Link} to="/signup" color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button component={Link} to="/signin" color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
