import { Button, Card, Container, TextField, Typography } from '@mui/material';
import httpClient from 'shared/httpClient';
import { useEventEmitter } from 'shared/utils/eventEmitter';
import { useMutation } from '@tanstack/react-query';
export const SignInPage = () => {
  const eventEmitter = useEventEmitter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient.post('/auth/login', data).then((res) => {
        return res.data;
      });
    },
    onSuccess: (data) => {
      localStorage.setItem('currentUser', JSON.stringify(data));
      eventEmitter.emit('common.router.navigate', {
        to: '/',
      });
      eventEmitter.emit('storage', null);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    mutate({
      username,
      password,
    });
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'flex-start',
      }}>
      <form onSubmit={handleSubmit}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            top: '200px',
            width: '500px',
            padding: '32px',
          }}>
          <Typography
            variant="h3"
            sx={{
              marginBottom: '48px',
              textAlign: 'center',
            }}>
            Sign In
          </Typography>
          <TextField
            required
            defaultValue="kminchelle"
            name="username"
            label="Username"
            variant="standard"
            sx={{
              marginBottom: '48px',
            }}
          />
          <TextField
            required
            defaultValue="0lelplR"
            type="password"
            name="password"
            label="Password"
            variant="standard"
            sx={{
              marginBottom: '48px',
            }}
          />
          <Button type="submit" variant="contained" disabled={isPending}>
            Sign In
          </Button>
        </Card>
      </form>
    </Container>
  );
};
