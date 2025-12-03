import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { useColorMode } from '../context/ColorModeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Heart, Calendar, LayoutDashboard, CalendarCheck } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
            <Toolbar variant="dense" sx={{ justifyContent: 'space-between', minHeight: '48px' }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <CalendarCheck color="#3b82f6" size={28} />
                    <Typography variant="h6" component="div" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        Vishubh Smart Planner
                    </Typography>
                </Box>

                {/* Navigation Links */}
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 'bold' }}>
                        <Button color="inherit" startIcon={<LayoutDashboard size={18} />} onClick={() => navigate('/')}>
                            Dashboard
                        </Button>
                        <Button color="inherit" startIcon={<Calendar size={18} />} onClick={() => navigate('/tasks')}>
                            Tasks
                        </Button>
                        <Button color="inherit" startIcon={<Heart size={18} />} onClick={() => navigate('/mood')}>
                            Mood
                        </Button>
                        <Button color="inherit" startIcon={<LayoutDashboard size={18} />} onClick={() => navigate('/analytics')}>
                            Analytics
                        </Button>
                    </Box>
                )}

                {/* User & Theme Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </IconButton>

                    {user ? (
                        <>
                            <Button
                                onClick={handleMenu}
                                color="inherit"
                                startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>{user.username[0].toUpperCase()}</Avatar>}
                                endIcon={<User size={16} />}
                            >
                                {user.username}
                            </Button>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
