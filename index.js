require('dotenv').config();

const { inquirerMenu, pausa, leerInput, listadoLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1: // Buscar ciudad
                // Mostar mensaje
                const inputLugar = await leerInput('Ciudad: ');
                // Buscar los lugares
                const lugares = await busquedas.buscarCiudad(inputLugar);
                // Seleccionar el lugar
                const id = await listadoLugares(lugares);

                if (id === '') continue;

                const { nombre, lat, long } = lugares.find(l => l.id === id);
                // Clima
                const { temp, min, max, desc} = await busquedas.climaLugar(lat, long);

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', nombre.green );
                console.log('Lat:', lat);
                console.log('Long:', long);
                console.log('Temperatura:', temp);
                console.log('Mínima:', min);
                console.log('Máxima:', max);
                console.log('Descripción del clima:', desc.green);

                busquedas.agregarHistorial(nombre);

                break;
            case 2: // Mostrar historial
                busquedas.historialCapitalizado.forEach( (lugar , i )=> {
                    const idx = `${ i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        };

        if (opt !== 0) await pausa();

    } while(opt !== 0);
}

main();