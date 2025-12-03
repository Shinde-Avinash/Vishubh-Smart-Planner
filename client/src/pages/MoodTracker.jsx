import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Slider, Button, Grid, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Smile, Frown, Meh, Pencil, Trash2 } from 'lucide-react';
import { logMood, getMoods, updateMood, deleteMood } from '../services/api';

const MoodTracker = () => {
    const [moodScore, setMoodScore] = useState(5);
    const [stressLevel, setStressLevel] = useState(5);
    const [motivationLevel, setMotivationLevel] = useState(5);
    const [note, setNote] = useState('');
    const [history, setHistory] = useState([]);

    // Edit State
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editScore, setEditScore] = useState(5);
    const [editStress, setEditStress] = useState(5);
    const [editMotivation, setEditMotivation] = useState(5);
    const [editNote, setEditNote] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const { data } = await getMoods();
            setHistory(data);
        } catch (error) {
            console.error('Failed to load mood history', error);
        }
    };

    const handleSubmit = async () => {
        try {
            await logMood({ mood_score: moodScore, stress_level: stressLevel, motivation_level: motivationLevel, note });
            setNote('');
            await loadHistory();
            alert('Mood logged successfully!');
        } catch (error) {
            console.error('Failed to log mood', error);
            alert('Failed to log mood. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mood log?')) {
            try {
                await deleteMood(id);
                loadHistory();
            } catch (error) {
                console.error('Failed to delete mood', error);
                alert('Failed to delete mood.');
            }
        }
    };

    const handleEditClick = (entry) => {
        setEditId(entry.id);
        setEditScore(entry.mood_score);
        setEditStress(entry.stress_level);
        setEditMotivation(entry.motivation_level);
        setEditNote(entry.note || '');
        setEditOpen(true);
    };

    const handleUpdateSubmit = async () => {
        try {
            await updateMood(editId, {
                mood_score: editScore,
                stress_level: editStress,
                motivation_level: editMotivation,
                note: editNote
            });
            setEditOpen(false);
            loadHistory();
        } catch (error) {
            console.error('Failed to update mood', error);
            alert('Failed to update mood.');
        }
    };

    const getMoodIcon = (score) => {
        if (score >= 8) return <Smile color="#22c55e" size={32} />;
        if (score >= 4) return <Meh color="#eab308" size={32} />;
        return <Frown color="#ef4444" size={32} />;
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Mood Tracker 🧠
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom>How are you feeling?</Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Mood (1-10)</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {getMoodIcon(moodScore)}
                                <Slider
                                    value={moodScore}
                                    onChange={(_, v) => setMoodScore(v)}
                                    min={1}
                                    max={10}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Stress Level (1-10)</Typography>
                            <Slider
                                value={stressLevel}
                                onChange={(_, v) => setStressLevel(v)}
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="error"
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Motivation (1-10)</Typography>
                            <Slider
                                value={motivationLevel}
                                onChange={(_, v) => setMotivationLevel(v)}
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="secondary"
                            />
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Any thoughts?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Button variant="contained" fullWidth onClick={handleSubmit}>
                            Log Mood
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Recent History</Typography>
                    {history.map((entry) => (
                        <Paper key={entry.id} sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                {getMoodIcon(entry.mood_score)}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2">
                                        {new Date(entry.createdAt).toLocaleDateString()} - {new Date(entry.createdAt).toLocaleTimeString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Stress: {entry.stress_level} | Motivation: {entry.motivation_level}
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton size="small" onClick={() => handleEditClick(entry)} color="primary">
                                        <Pencil size={18} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(entry.id)} color="error">
                                        <Trash2 size={18} />
                                    </IconButton>
                                </Box>
                            </Box>
                            {entry.note && <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>"{entry.note}"</Typography>}
                        </Paper>
                    ))}
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Mood Log</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography gutterBottom>Mood (1-10)</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            {getMoodIcon(editScore)}
                            <Slider value={editScore} onChange={(_, v) => setEditScore(v)} min={1} max={10} valueLabelDisplay="auto" />
                        </Box>

                        <Typography gutterBottom>Stress Level (1-10)</Typography>
                        <Slider value={editStress} onChange={(_, v) => setEditStress(v)} min={1} max={10} valueLabelDisplay="auto" color="error" sx={{ mb: 3 }} />

                        <Typography gutterBottom>Motivation (1-10)</Typography>
                        <Slider value={editMotivation} onChange={(_, v) => setEditMotivation(v)} min={1} max={10} valueLabelDisplay="auto" color="secondary" sx={{ mb: 3 }} />

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Note"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MoodTracker;
