import express from 'express';

const app = express();

app.get('/', (request, response) => {
    return response.json([
        {id: 1, name:'Lucas'},
    ])
});

app.listen(3030)