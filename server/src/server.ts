// Prisma ORM
import express from 'express';
// Tipos de Parametros
    /**
     * Query
     * Route
     * Body
     */
const app = express();

app.get('/games', (request, response) => {
    return response.json([]);
})

app.post('/ads', (request, response) => {
    return response.json([]);
})

app.get('/games/:id/ads', (request, response) => {
    //const gameId = request.params.id;
    
    return response.json([
        {id: 1, name:'Lucas'},
    ])
});

app.get('/ads/:id/discord', (request, response) => {
    //const adsId = request.params.id;
    
    return response.json([])
});

app.listen(3030)