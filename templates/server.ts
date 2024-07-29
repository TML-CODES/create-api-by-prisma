import app from './app';

app.listen(process.env.PORT_SERVER || 3001, () => {
    console.log(`[API][${String(process.env.NODE_ENV).toUpperCase()}] 🚪 porta ${process.env.PORT_SERVER || 3001}`);
});