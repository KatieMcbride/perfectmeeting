import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import LandingAppBar from '../../components/LandingAppBar';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Perfect Meeting
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));



export default function Landing() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
   <LandingAppBar />
    <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="lg">
            <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
            Profile Page
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={1} justify="center">
                  <Button variant="contained" color="secondary" size="large" href="/createmeeting">
                    Create Meeting
                  </Button>
              </Grid>
            </div>
          </Container>

          <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Perfect Meeting
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Login in to a better workplace.
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}