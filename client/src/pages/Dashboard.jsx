import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, CircularProgress, Chip, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Smile, Sparkles, Clock, Calendar, CheckCircle } from 'lucide-react';
import { generateSchedule, getMoods, getTasks } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [moodStats, setMoodStats] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [moodRes, tasksRes] = await Promise.all([getMoods(), getTasks()]);
            if (moodRes.data.length > 0) {
                setMoodStats(moodRes.data[0]);
            }
            setTasks(tasksRes.data);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSchedule = async () => {
        setLoading(true);
        try {
            const { data } = await generateSchedule();
            setSchedule(data.schedule.schedule);
        } catch (error) {
            console.error('Failed to generate schedule', error);
            alert('Failed to generate schedule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', icon: '☀️' };
        if (hour < 18) return { text: 'Good Afternoon', icon: '🌤️' };
        return { text: 'Good Evening', icon: '🌙' };
    };

    const greeting = getGreeting();

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, mb: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
            <Box sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {greeting.text}, {user?.username}! {greeting.icon}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Let's make today productive and balanced.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ width: '100%', justifyContent: 'center' }}>
                {/* Quick Actions */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" align="center">
                            Quick Actions ⚡
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                startIcon={<Plus />}
                                onClick={() => navigate('/tasks')}
                            >
                                Add Task 📝
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Smile />}
                                onClick={() => navigate('/mood')}
                            >
                                Log Mood 🎭
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Sparkles />}
                                onClick={handleGenerateSchedule}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Smart Schedule ✨'}
                            </Button>
                        </Box>
                    </Paper>

                    {/* Smart Schedule */}
                    <Paper sx={{ p: 3, minHeight: 300 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                📅 Smart Schedule
                            </Typography>
                            {schedule && <Chip label="AI Optimized" color="success" size="small" icon={<Sparkles size={14} />} />}
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : schedule ? (
                            <List>
                                {schedule.map((item, index) => (
                                    <Paper key={index} sx={{ mb: 2, p: 1, bgcolor: 'background.default' }} elevation={0}>
                                        <ListItem>
                                            <ListItemIcon>
                                                {item.type === 'Break' ? <Smile color="#eab308" /> : <Clock color="#3b82f6" />}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography fontWeight="bold">{item.time}</Typography>
                                                        <Typography>{item.task}</Typography>
                                                        <Chip label={item.type} size="small" color={item.type === 'Break' ? 'warning' : 'default'} />
                                                    </Box>
                                                }
                                                secondary={item.reason}
                                            />
                                        </ListItem>
                                    </Paper>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ py: 2 }}>
                                <Typography variant="subtitle2" gutterBottom color="text.secondary">Pending Tasks ({tasks.length})</Typography>
                                {tasks.length > 0 ? (
                                    <List dense>
                                        {tasks.slice(0, 3).map(task => (
                                            <ListItem key={task.id}>
                                                <ListItemIcon><CheckCircle size={16} /></ListItemIcon>
                                                <ListItemText primary={task.title} secondary={`Priority: ${task.priority}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        No pending tasks.
                                    </Typography>
                                )}
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Click "Generate Smart Schedule" to let AI organize your day!
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Sidebar / Stats */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Current Vibe
                        </Typography>
                        {moodStats ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                                <Typography variant="h2">
                                    {moodStats.mood_score >= 8 ? '🤩' : moodStats.mood_score >= 5 ? '🙂' : '😐'}
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                                    {moodStats.mood_score}/10
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Mood Score
                                </Typography>
                                <Box sx={{ mt: 3, width: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Stress</Typography>
                                        <Typography variant="body2" fontWeight="bold">{moodStats.stress_level}/10</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Motivation</Typography>
                                        <Typography variant="body2" fontWeight="bold">{moodStats.motivation_level}/10</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No mood logged yet.</Typography>
                                <Button size="small" onClick={() => navigate('/mood')} sx={{ mt: 2 }}>Log Now</Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
