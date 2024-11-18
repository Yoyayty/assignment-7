import express from 'express'
import path from 'path'

const app = express()
const port = 3001

app.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.json'));
})

app.use('/docs', express.static(path.join(__dirname, 'swagger-ui')))

app.listen(port, () => {
    console.log(`Swagger host is running at http://localhost:${port}`)
})
