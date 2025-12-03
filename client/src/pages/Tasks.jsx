import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, Card, CardContent, Chip, IconButton, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Tooltip } from '@mui/material';
import { Plus, Trash2, Calendar, User, Clock, AlertCircle, Pencil } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, getUsers } from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        assigned_to: '',
        estimated_time: 30
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksRes, usersRes] = await Promise.all([getTasks(), getUsers()]);
            setTasks(tasksRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const handleOpenDialog = (task = null) => {
        if (task) {
            setEditingTask(task);
            setNewTask({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                assigned_to: task.assigned_to || '',
                estimated_time: task.estimated_time || 0
            });
        } else {
            setEditingTask(null);
            setNewTask({ title: '', description: '', status: 'Pending', priority: 'Medium', assigned_to: '', estimated_time: 30 });
        }
        setOpen(true);
    };

    const handleSaveTask = async () => {
        if (!newTask.title.trim()) return;
        try {
            if (editingTask) {
                const { data } = await updateTask(editingTask.id, newTask);
                setTasks(tasks.map(t => t.id === editingTask.id ? data : t));
            } else {
                const { data } = await createTask(newTask);
                setTasks([...tasks, data]);
            }
            setOpen(false);
            setEditingTask(null);
            setNewTask({ title: '', description: '', status: 'Pending', priority: 'Medium', assigned_to: '', estimated_time: 30 });
        } catch (error) {
            console.error('Failed to save task', error);
            alert('Failed to save task');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteTask(id);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            const { data } = await updateTask(task.id, { status: newStatus });
            setTasks(tasks.map(t => t.id === task.id ? data : t));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'In Progress': return 'info';
            case 'Pending': return 'secondary';
            case 'Waiting': return 'warning';
            case 'Closed': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'error';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Task Board 📋
                </Typography>
                <Button variant="contained" startIcon={<Plus />} onClick={() => handleOpenDialog()}>
                    New Task ✨
                </Button>
            </Box>

            {tasks.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No tasks found. Create one to get started! 🚀
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 2,
                    width: '100%'
                }}>
                    {tasks.map((task) => (
                        <Card key={task.id} sx={{
                            width: '100%',
                            aspectRatio: '1 / 1', // Enforce square shape
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            borderTop: `4px solid ${task.priority === 'High' ? '#ef4444' :
                                task.priority === 'Medium' ? '#f59e0b' : '#22c55e'
                                }`,
                            boxShadow: 2,
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
                        }}>
                            <CardContent sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                height: '100%',
                                p: 1.5,
                                '&:last-child': { pb: 1.5 }
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Chip
                                        label={task.status}
                                        color={getStatusColor(task.status)}
                                        size="small"
                                        onClick={() => {
                                            const statusOrder = ['Pending', 'In Progress', 'Waiting', 'Completed', 'Closed'];
                                            const currentIndex = statusOrder.indexOf(task.status);
                                            const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                                            handleStatusChange(task, nextStatus);
                                        }}
                                        sx={{ cursor: 'pointer', fontWeight: 'bold', height: 20, fontSize: '0.7rem' }}
                                    />
                                    <Box>
                                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(task)} sx={{ p: 0.5, mr: 0.5 }}>
                                            <Pencil size={14} />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)} sx={{ p: 0.5 }}>
                                            <Trash2 size={14} />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ mb: 0.5, fontSize: '0.95rem' }}>
                                    {task.title}
                                </Typography>

                                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1, pr: 0.5 }}>
                                    {task.description && (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                                            {task.description}
                                        </Typography>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f0f0f0', mt: 'auto' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title={`Assigned to: ${task.assignee ? task.assignee.username : 'Unassigned'}`}>
                                            <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: task.assignee ? 'primary.main' : 'grey.400' }}>
                                                {task.assignee?.username?.[0]?.toUpperCase() || '?'}
                                            </Avatar>
                                        </Tooltip>
                                        <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ fontSize: '0.7rem' }}>
                                            {task.assignee ? task.assignee.username : 'Unassigned'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Chip
                                            icon={<AlertCircle size={10} />}
                                            label={task.priority}
                                            size="small"
                                            color={getPriorityColor(task.priority)}
                                            sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-icon': { width: 12, height: 12 } }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Task Title"
                            fullWidth
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Status"
                                    fullWidth
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Waiting">Waiting</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Closed">Closed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Priority"
                                    fullWidth
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Assign To"
                                    fullWidth
                                    value={newTask.assigned_to}
                                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                                >
                                    <MenuItem value=""><em>Unassigned</em></MenuItem>
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.username} ({user.email})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Est. Time (mins)"
                                    type="number"
                                    fullWidth
                                    value={newTask.estimated_time}
                                    onChange={(e) => setNewTask({ ...newTask, estimated_time: parseInt(e.target.value) || 0 })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveTask}>
                        {editingTask ? 'Save Changes' : 'Create Task'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tasks;
