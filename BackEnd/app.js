import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { supabase } from './config/supabase.js';

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import materiaRoutes from "./routes/materiasRoutes.js";
import calificacionRoutes from "./routes/calificacionesRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '..', 'Frontend');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(frontendPath, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));

app.set('views', path.join(frontendPath, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath,'views', 'index.html'));
});
app.get('/perfil_alumno', (req, res) => {
    res.render('perfil_alumno/perfil_alumno');
});
app.get('/calificaciones', (req, res) => {
    res.render('calificaciones/calificaciones');
});
app.get('/registro', (req, res) => {
    res.render('Registro/registro');
});

app.get('/login', (req, res) => {
    res.render('Login/login');
});
app.get('/api/grupos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select('id_grupo, nombre')
            .order('id_grupo', { ascending: true });

        if (error) throw error;

        res.json(data); 
    } catch (err) {
        console.error("Error en /api/grupos:", err.message);
        res.status(500).json({ error: 'No se pudieron cargar los grupos' });
    }
});
app.use('/api/usuarios', userRoutes);
app.use('/api/tareas', taskRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/calificaciones", calificacionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en: http://localhost:${PORT}`);
});
