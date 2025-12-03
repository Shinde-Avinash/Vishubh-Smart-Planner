import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                    <Avatar
                        sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem' }}
                    >
                        {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            {user?.username}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {user?.email}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Account Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Member Since:</strong> {new Date().toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Plan:</strong> Free Tier
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Preferences
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Theme:</strong> Custom
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Notifications:</strong> Enabled
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Profile;
