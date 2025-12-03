import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }) => {
    const [mode, setMode] = useState('dark'); // Default to dark as per screenshot

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            // Light mode palette
                            primary: { main: '#6366f1' },
                            background: { default: '#f3f4f6', paper: '#ffffff' },
                            text: { primary: '#1f2937' },
                        }
                        : {
                            // Dark mode palette (matching screenshot)
                            primary: { main: '#3b82f6' }, // Blueish
                            background: { default: '#0f172a', paper: '#1e293b' }, // Slate 900/800
                            text: { primary: '#f8fafc' },
                        }),
                },
                typography: {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    h6: { fontWeight: 600 },
                    button: { textTransform: 'none', fontWeight: 500 },
                },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
                                color: mode === 'dark' ? '#f8fafc' : '#1f2937',
                                boxShadow: 'none',
                                borderBottom: '1px solid',
                                borderColor: mode === 'dark' ? '#334155' : '#e2e8f0',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: { borderRadius: 8 },
                        },
                    },
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
