const express = require('express');
const mongoose = require('mongoose');
const Patient = require('./models/patient');

const { logRequest } = require('./utils/utils');  

console.log("logRequest function:", logRequest);

const app = express();

// Conexión a la base de datos con Mongoose (nueva sintaxis)
mongoose.connect('mongodb+srv://sololectura:sololectura@cluster0.c8tq0vp.mongodb.net/catsalut')
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Middleware integrado para manejar formularios
app.use(express.json()); // Middleware integrado para manejar JSON

// Nueva ruta: Página de inicio
app.get('/', async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        res.render('home', { totalPatients });
    } catch (err) {
        res.status(500).send('Error al cargar la página de inicio');
    }
});

// Endpoint 1: Obtener todos los pacientes en formato JSON en la ruta /api/patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json({
            message: "Query executed successfully",
            results: patients
        });
    } catch (err) {
        res.status(500).send('Error al obtener los pacientes');
    }
});

// Endpoint 2: Renderizar el formulario de búsqueda
app.get('/form', (req, res) => {
    res.render('form');
});

// Endpoint 3: Verificar si el paciente existe y mostrar información
app.get('/check', async (req, res) => {
    try {
        const { ssn } = req.query;

        if (!ssn) {
            logRequest(`Petición fallida: Número de la seguridad social no proporcionado`);
            return res.render('patient-info', { patient: null, message: 'Número de la seguridad social no proporcionado' });
        }

        
        logRequest(`Se ha realizado una consulta sobre el paciente con SSN: ${ssn}`);

        const patient = await Patient.findOne({ ssn: ssn });

        if (patient) {
            res.render('patient-info', { patient });
        } else {
            res.render('patient-info', { patient: null, message: 'El paciente no existe en la base de datos' });
        }
    } catch (err) {
        logRequest(`Error al realizar la consulta sobre el paciente con SSN: ${req.query.ssn}`);
        console.error('Error al verificar el paciente:', err);
        res.status(500).send('Error al verificar el paciente');
    }
});



// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
