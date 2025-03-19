import React from 'react';
import { Button } from '@mui/material';

const SignInPage = () => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleForgotPasswordOpen = () => {
    setError(''); // Clear any existing error messages
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  return (
    <Button
      onClick={handleForgotPasswordOpen}
      variant="text"
      sx={{ textTransform: 'none', color: 'text.secondary' }}
    >
      Forgot your password?
    </Button>
  );
};

export default SignInPage; 