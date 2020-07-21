import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import AppBar from '../../components/app_bar';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
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
}));

export default function Meeting() {
    const classes = useStyles();

  return (
    <React.Fragment>
        <CssBaseline />
    <AppBar />
    <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="lg">
            <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
              Meeting Page
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={1} justify="center">
                  <Button variant="contained" color="primary" size="large" href="/profile">
                    End Meeting
                  </Button>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </React.Fragment>

  );
}