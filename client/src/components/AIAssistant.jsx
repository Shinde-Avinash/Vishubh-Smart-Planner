import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Fab, Collapse, CircularProgress } from '@mui/material';
import { Send, Bot, X, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/api';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I\'m Vishubh. How can I help you today? 😊' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (context = null) => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const { data } = await chatWithAI(currentInput, context);
            setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
            setMessages(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error: ${errorMessage}. Please try again.` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 5, right: 5, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Collapse in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        width: 320,
                        height: 400,
                        mb: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: 4
                    }}
                >
                    {/* Header */}
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">🤖</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">Vishubh AI</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                            <X size={18} />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'action.hover' }}>
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '80%',
                                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.role === 'user' ? 'white' : 'text.primary',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                <Paper sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2 }}>
                                    <CircularProgress size={16} />
                                </Paper>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ p: 1, display: 'flex', gap: 1, overflowX: 'auto', bgcolor: 'background.default' }}>
                        <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
                            <Fab variant="extended" size="small" color="primary" onClick={() => { setInput("I'm feeling unmotivated. Help me get started!"); handleSend("motivation"); }}>
                                <Sparkles size={14} style={{ marginRight: 8 }} /> Motivate Me
                            </Fab>
                            <Fab variant="extended" size="small" color="secondary" onClick={() => { setInput("Help me plan my day based on my tasks."); handleSend("breakdown"); }}>
                                <Bot size={14} style={{ marginRight: 8 }} /> Plan My Day
                            </Fab>
                        </Box>
                    </Box>

                    {/* Input */}
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                        />
                        <IconButton color="primary" onClick={() => handleSend()} disabled={loading || !input.trim()}>
                            <Send size={20} />
                        </IconButton>
                    </Box>
                </Paper>
            </Collapse>

            <Fab
                color="primary"
                aria-label="chat"
                onClick={() => setIsOpen(!isOpen)}
                sx={{ width: 60, height: 60 }}
            >
                {isOpen ? <X size={24} /> : <Typography variant="h4">🤖</Typography>}
            </Fab>
        </Box>
    );
};

export default AIAssistant;
