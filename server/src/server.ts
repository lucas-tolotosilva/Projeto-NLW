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
import { PrismaClient } from '@prisma/client'

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

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
    const body = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays,
            hourStart: body.hourStart,
            hourEnd: body.hourEnd,
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.json(body);
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
            weekDays: ad.weekDays.split(',')
        }
    }))
});

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ads = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    return response.json({
        discord: ads.discord
    })
});

app.listen(3030)