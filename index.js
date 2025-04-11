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
    const { nombre, apellido1, apellido2, dni } = req.body;
    const query = `
        INSERT INTO persona (nombre, apellido1, apellido2, dni)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    try {
        const result = await pool.query(query, [nombre, apellido1, apellido2, dni]);
        res.status(201).json({
            success: true,
            message: "Persona creada correctamente",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'ERROR CREANDO LA PERSONA',
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
//Para crear un coche
app.post('/api/coche', async (req, res) => {
    const { matricula, marca, modelo, caballos, persona_id } = req.body;
    const query = 'INSERT INTO coche (matricula, marca, modelo, caballos, persona_id) VALUES ($1, $2, $3, $4, $5)';

    try {
        await pool.query(query, [matricula, marca, modelo, caballos, persona_id]);
        res.status(201).json({ matricula, marca, modelo, caballos, persona_id });
    } catch (error) {
        res.status(500).json({
            message: 'ERROR CREANDO EL COCHE',
            details: error.message
        });
    }
});
//Para obtener todos los coches
app.get('/api/coche', async (req, res) => {
    const query = 'SELECT * FROM coche';

    try {
        const result = await pool.query(query);
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al recuperar los coches',
            details: error.message
        });
    }
});
//Para actualizar un coche por matricula
app.put('/api/coche/:matricula', async (req, res) => {
    const matricula = req.params.matricula.trim();
    const { marca, modelo, caballos, persona_id } = req.body;
    const query = `
        UPDATE coche
        SET marca = $1, modelo = $2, caballos = $3, persona_id = $4
        WHERE matricula = $5
    `;

    try {
        const result = await pool.query(query, [marca, modelo, caballos, persona_id, matricula]);

        if (result.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: `Coche con matrícula ${matricula} actualizado correctamente`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se encontró un coche con matrícula ${matricula}`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error actualizando el coche',
            details: error.message
        });
    }
});
//Para eliminar un coche por matricula
app.delete('/api/coche/:matricula', async (req, res) => {
    const matricula = req.params.matricula.trim();
    const query = 'DELETE FROM coche WHERE TRIM(matricula) = $1';

    try {
        const result = await pool.query(query, [matricula]);

        if (result.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: `Coche con matrícula ${matricula} eliminado correctamente`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se encontró un coche con matrícula ${matricula}`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error eliminando el coche',
            details: error.message
        });
    }
});
   