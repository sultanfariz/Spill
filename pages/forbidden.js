import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { Button } from "@mui/material";
import forbidden from '../public/forbidden.webp';
import { signIn } from 'next-auth/client';
import router from 'next/router';

const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        // height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.primary,
    },
    text: {
        margin: '5px auto',
    }
}));

export default function Forbidden() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Image src={forbidden} alt='forbidden' />
            <h1 style={{ margin: '5px auto' }}>403 Forbidden</h1>
            <p className={classes.text}>You are not authorized to access this page</p>
            <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '15px' }}
                // redirect to homepage
                onClick={() => router.push('/')}
            >
                Back to Homepage
            </Button>
        </div >
    );
}