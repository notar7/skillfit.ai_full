import * as React from 'react';
import { Box, Button, Checkbox, CssBaseline, FormControl, FormControlLabel, FormLabel, Link, TextField, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import AppTheme from './theme/AppTheme';
import ColorModeSelect from './theme/ColorModeSelect';
import ForgotPassword from './components/ForgotPassword';
import SkillfitIcon from './components/SkillfitIcon';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Adaptable performance',
    description:
      'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Built to last',
    description:
      'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Great user experience',
    description:
      'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function SignInSide(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const clearErrors = () => {
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');
  };

  const handleClickOpen = () => {
    clearErrors();
    setOpen(true);
  };

  const handleClose = () => {
    clearErrors();
    setOpen(false);
  };

  const validateInputs = () => {
    clearErrors();
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateInputs()) {
      return;
    }
  
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
  
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
  
      const response = await fetch('http://localhost:8000/token', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        clearErrors(); // Clear any existing errors on successful login
        localStorage.setItem('token', result.access_token);
  
        const payload = JSON.parse(atob(result.access_token.split('.')[1]));
        if (payload.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/upload-resume');
        }
      } else {
        setEmailError(true);
        setEmailErrorMessage(result.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setEmailError(true);
      setEmailErrorMessage('Something went wrong. Try again.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              ...theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
          }}
        >
          <Stack
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{
              justifyContent: 'center',
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: 'auto',
            }}
          >
            {/* Content Component */}
            <Stack
              sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
            >
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <SkillfitIcon />
              </Box>
              {items.map((item, index) => (
                <Stack key={index} direction="row" sx={{ gap: 2 }}>
                  {item.icon}
                  <div>
                    <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.description}
                    </Typography>
                  </div>
                </Stack>
              ))}
            </Stack>

            {/* SignInCard Component */}
            <Card variant="outlined">
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SkillfitIcon />
              </Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
              >
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@moderncoe.edu.in"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      component="button"
                      type="button"
                      onClick={handleClickOpen}
                      variant="body2"
                      sx={{ alignSelf: 'baseline' }}
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained">
                  Sign in
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                  Don&apos;t have an account?{' '}
                  <span>
                    <Link
                      href="/SignUp"
                      variant="body2"
                      sx={{ alignSelf: 'center' }}
                    >
                      Sign up
                    </Link>
                  </span>
                </Typography>
              </Box>
            </Card>
          </Stack>
        </Stack>
      </Stack>
    </AppTheme>
  );
}