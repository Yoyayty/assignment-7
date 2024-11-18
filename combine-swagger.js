import fs from 'fs'
import swaggerCombine from 'swagger-combine'

const config = {
    swagger: '2.0',
    info: { title: 'Combined API', version: '1.0.0' },
    apis: [
        './api/build/swagger.json',
        './warehouse/build/swagger.json'
    ]
}

swaggerCombine(config).then((combinedSwagger) => {
    fs.writeFileSync('./swagger.json', JSON.stringify(combinedSwagger, null, 2));
    console.log('Combined Swagger written to swagger.json');
})
