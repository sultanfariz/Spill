import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#6200EE',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: ['Poppins', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontSize: '36px',
            fontWeight: 'bold',
        },
        h2: {
            fontSize: '28px',
            fontWeight: 'bold',
        },
        subtitle1: {
            fontSize: '20px',
            fontWeight: 600,
        },
        subtitle2: {
            fontSize: '16px',
            fontWeight: 400,
        },
        body1: {
            fontSize: '16px',
            fontWeight: 400,
        },
        body2: {
            fontSize: '14px',
            fontWeight: 400,
        },
    },
});

export default theme;
