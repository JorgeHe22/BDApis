const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto', PORT);
});


app.get('/api/prueba', (req, res) => {
    res.send('Api funcionando de manera correcta');
});

app.get('/api/prueba1', (req, res) => {
    res.status(200).json({
        message: 'LA API RESPONDE CORRECTAMENTE',
        PORT: PORT,
        status: 'success'
    });
});


app.post('/api/guardar', async (req, res) => {
    const { cedula, nombre, edad, profesion } = req.body;
    const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';

    try {
        await pool.query(query, [cedula, nombre, edad, profesion]);
        res.status(201).json({ cedula, nombre, edad, profesion });
    } catch (error) {
        res.status(500).json({
            message: 'ERROR CREANDO EL USUARIO',
            details: error.message
        });
    }
});

app.get('/api/obtener', async (req, res) => {
    const query = 'SELECT * FROM persona';

    try {
        const result = await pool.query(query);
        res.status(200).json({
            success: true,
            message: "Datos de la tabla",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al recuperar los datos",
            details: error.message
        });
    }
});

app.delete('/api/eliminar/:cedula', async (req, res) => {
    const cedula = req.params.cedula.trim();
    const query = 'DELETE FROM persona WHERE TRIM(cedula) = $1';

    try {
        const result = await pool.query(query, [cedula]);

        if (result.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: `Usuario con cédula ${cedula} eliminado correctamente`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se encontró un usuario con cédula ${cedula}`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error eliminando el usuario',
            details: error.message
        });
    }
});

app.put('/api/actualizar/:cedula', async (req, res) => {
    const cedula = req.params.cedula.trim();
    const { nombre, edad, profesion } = req.body;

    const query = `
        UPDATE persona 
        SET nombre = $1, edad = $2, profesion = $3 
        WHERE cedula = $4
    `;

    try {
        const result = await pool.query(query, [nombre, edad, profesion, cedula]);

        if (result.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: `Usuario con cédula ${cedula} actualizado correctamente`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se encontró un usuario con cédula ${cedula}`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error actualizando el usuario',
            details: error.message
        });
    }
});    