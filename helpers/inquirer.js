const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [{
            value: 1,
            name: `${'1.'.green} Buscar ciudad`,
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`,
        },
        {
            value: 0,
            name: `${'0.'.red} Salir`,
        }],
    }
];

const inquirerMenu = async () => {
    
    console.clear();
    console.log('========================'.green);
    console.log(' Seleccione una opción '.white);
    console.log('========================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

const pausa = async () => {
    const question = [{
        type: 'input',
        name: 'pausa',
        message: `Presiones ${'ENTER'.green} para continuar`,
    }];

    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async ( message ) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate( value ) {
            if ( value.length === 0) {
                return 'Por favor ingrese un valor';
            }
            return true;
        }
    }];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listadoLugares = async ( lugares = [] ) => {
    
    const choices = lugares.map((lugar, i) => {

        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`,
        }
    })

    choices.unshift({
        value: '',
        name: `${'0.'.red} Cancelar`
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: '¿De qué lugar desea conocer información?',
            choices
        }
    ];

    console.clear();
    console.log('========================'.green);
    console.log(' Seleccione un lugar '.white);
    console.log('========================\n'.green);

    const { id } = await inquirer.prompt(questions);

    return id;
}

module.exports = {
    inquirerMenu, 
    pausa,
    leerInput,
    listadoLugares,
};