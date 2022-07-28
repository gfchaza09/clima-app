const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    
    constructor() {
        this.readDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
            'proximity': 'ip'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async buscarCiudad( lugar = '') {
        try {
            // Peticion HTTP
            const instance = axios.default.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const res = await instance.get();

            return res.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            return [];
        }
    }

    async climaLugar( lat, lon ) {
        try {
            const instance = axios.default.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    ...this.paramsOpenWeather,
                    lat,
                    lon,
                }
            });

            const res = await instance.get();

            const { main, weather } = res.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
        } catch (error) {
            console.log(error);
        }
    }

    async agregarHistorial( lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return
        }

        // Guarda una cantidad máxima de 6 lugares
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // Guardar DB
        this.saveDB();
    }
    
    async saveDB () {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }
    
    async readDB () {
    
        if (!fs.existsSync(this.dbPath)) {
            return;
        }
    
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf8'});
    
        const data = JSON.parse(info);

        this.historial = data.historial;
    };

    // async mostrarHistorial() {
        // Previamente se carga el historial sin utilizar una funcion, simplemente se usa busquedas.historial.push()
        // if (this.historial.length <= 5) {
        //     this.historial.forEach(h => {
        //         console.log(h);
        //     })
        // } else {
        //     this.historial.slice(this.historial.length - 5, this.historial.length).forEach(h => {
        //         console.log(h);
        //     })
        // }   
    // }
}

module.exports = Busquedas;