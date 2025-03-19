import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { Link as ScrollLink } from 'react-scroll'; // Import Link from react-scroll
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import User Icon
import SkillfitIcon from './SkillfitIcon';
import { useNavigate } from 'react-router-dom';

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

export default function AdminAppBar() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fullName, setFullName] = React.useState('User');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const response = await fetch('http://localhost:8000/get-user-details', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setFullName(data.full_name);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
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
                component={Link}
                to="/admin-dashboard"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                Admin Dashboard
              </Button>
              <Button
                component={Link}
                to="/student-details"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                Student Details
              </Button>
              <Button
                component={Link}
                to="/courses"
                smooth={true}
                duration={500}
                variant="text"
                color="info"
                size="small"
              >
                Courses
              </Button>
            </Box>
          </Box>

           {/* User Dropdown Menu */}
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleMenuOpen}>
              <AccountCircleIcon fontSize="medium" color="info" />
              <Typography 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1rem',
                  textShadow: '0px 0px 1px rgba(0, 0, 0, 0.2)'
                }} 
                color="info"
              >
                {fullName}
              </Typography>
            </Box>
            <ColorModeIconDropdown />
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

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
                <MenuItem component={Link} to="/admin-dashboard" smooth={true} duration={500}>
                  Admin Dashboard
                </MenuItem>
                <MenuItem component={Link} to="/student-details" smooth={true} duration={500}>
                  Student Details
                </MenuItem>
                <MenuItem component={Link} to="/courses" smooth={true} duration={500}>
                  Course
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

