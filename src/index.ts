import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const server = express();

import { WPClient } from "./client/client.class";
import { DataBase } from "./db/db.class";
import { ClientRouter } from "./routes/client";
import { QrCodeRepository } from "./repositories/qr-code.repo";
import { SessionRepository } from "./repositories/session.repo";
import { MessageManager } from "./manager/message.manager";

server.use(cors());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

async function main() {

    const database = new DataBase();
    const qrCodeRepo = new QrCodeRepository();
    const sessionRepo = new SessionRepository();

    await database.start()
        .then(() => qrCodeRepo.start(database))
        .then(() => sessionRepo.start(database))
        .catch((error) => {
            console.error(error);
        });

    const wpClient = new WPClient();
    await wpClient.start(qrCodeRepo, sessionRepo);

    const messageManager = new MessageManager();
    await messageManager.start(wpClient.getClient());

    server.use('/client', new ClientRouter(wpClient, qrCodeRepo).router);

    server.listen(3000, () => {
        console.log(`[SERVER] Running at http://localhost:3000`);
    });

}

main();
