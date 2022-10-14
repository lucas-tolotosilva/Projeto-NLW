// Prisma ORM
// Tipos de Parametros
/**
 * Query
 * Route
 * Body
 */
// Fazer migração npx prisma migration dev
// Instalar o cliente npm i @prisma/client
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'
import { convert1, convert2 } from './utils/convert';

const app = express();


const prisma = new PrismaClient({
    log: ['query']
});

app.use(express.json());
app.use(cors());


app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })

    return response.json(games);
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body: any = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convert1(body.hourStart),
            hourEnd: convert1(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json(body);
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convert2(ad.hourStart),
            hourEnd: convert2(ad.hourStart),
        }
    }))
});

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    return response.json({
        discord: ad.discord
    })
});

app.listen(3030)