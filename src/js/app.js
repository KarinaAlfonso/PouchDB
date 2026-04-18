
console.log('Iniciando PouchDB...');

// PUNTO 4 - CREAR BASE DE DATOS
let db = new PouchDB('héroes');

// Verificar creación de la base de datos
db.info()
    .then(info => {
        console.log('Base de datos creada:', info);
        document.getElementById('status').textContent = 'Base de datos "héroes" creada correctamente';

    // PUNTO 5 - CLAVE PRIMARIA
    let heroId = {
        _id: 'heroe_001',
        nombre: 'Superman',
        poder: 'Superfuerza',
        ciudad: 'Metrópolis'
    };

    db.put(heroId)
        .then(response => {
            console.log('OK:', response);
        })
        .catch(error => {
            console.error('ERROR:', error);
        });

    // PUNTO 6 - ID AUTOMÁTICO
    // Documento
    db.post({
        nombre: 'Batman',
        poder: 'Dinero',
        ciudad: 'Gotham'
    }).then(res => {
        console.log('OK:', res);
    }).catch(error => {
        console.error('ERROR:', error);
    });

    // JSON
    db.post({
        "nombre": "Flash",
        "poder": "Velocidad",
        "ciudad": "Central City"
    }).then(res => {
        console.log('OK:', res);
    }).catch(error => {
        console.error('ERROR:', error);
    });

    // PUNTO 7 - BLOB 
    async function guardarBlob() {
        try {

            let respuesta = await fetch('https://upload.wikimedia.org/wikipedia/en/3/35/Supermanflying.png');
            let blob = await respuesta.blob();
            // evitar error si ya existe
            try {
                let existente = await db.get('heroe_imagen');
                await db.remove(existente);
            } catch (e) { }
            let doc = {
                _id: 'heroe_imagen',
                nombre: 'Superman',
                poder: 'Vuelo y superfuerza',
                _attachments: {
                    'superman.png': {
                        content_type: 'image/png',
                        data: blob
                    }
                }
            };
            let res = await db.put(doc);
            console.log('OK:', res);
            document.getElementById('status').textContent = 'Imagen guardada correctamente';
        } catch (error) {
            console.error('ERROR:', error);
        }
    }
    guardarBlob();

    // PUNTO 8 - Editar mediante documento (variable)
    /*db.get('heroe_001').then(doc => {
        doc.ciudad = 'Smallville'; // Cambia el valor
        return db.put(doc);
    }).then(res => {
        console.log('EDITADO (documento):', res);
    }).catch(error => {
        console.error('ERROR AL EDITAR (documento):', error);
    });*/

    // PUNTO 8 - Editar mediante documento (JSON)
    db.get('heroe_001').then(doc => {
        return db.put({
            _id: doc._id,
            _rev: doc._rev,
            nombre: 'Superman',
            poder: 'Superfuerza',
            ciudad: 'Nueva York' // Cambia el valor
        });
    }).then(res => {
        console.log('EDITADO (JSON):', res);
    }).catch(error => {
        console.error('ERROR AL EDITAR (JSON):', error)
    });

    // PUNTO 9 - Eliminar mediante documento (Variable)
    db.get('heroe_002').then(doc => {
        return db.remove(doc);
    }).then(res => {
        console.log('Eliminando (documento/variable):', res);
        document.getElementById('status').textContent = 'Registro eliminado correctamente';
    }).catch(error => {
        console.error('Error al eliminar (documento/variable):', error);
    });

    // PUNTO 9 - Eliminar mediante JSON
    /*db.get('heroe_002').then(doc => {
        return db.remove(doc._id, doc._rev);
    }).then(res => {
        console.log('Eliminando (JSON):', res);
        document.getElementById('status').textContent = 'Registro eliminado correctamente';
    }).catch(error => {
        console.error('Error al eliminar (JSON con _id y _rev):', error);
    });*/
})
    .catch(error => {
        console.error('Error al crear la BD:', error);
        document.getElementById('status').textContent = 'Error: ' + error;
    });

