import express, { Router, Response, Request } from 'express';

import { WPClient } from "../client/client.class";
import { QrCodeRepository } from "../repositories/qr-code.repo";

export class ClientRouter {

    public router: Router;

    constructor(private wpClient: WPClient, private qrCodeRepo: QrCodeRepository) {
        this.router = express.Router();
        this._setRoutes();
    }

    private _setRoutes() {
        this.router.get("/qrcode", this._getQrCode.bind(this));
        this.router.get("/state", this._getState.bind(this));
        this.router.get("/restart", this._restartClient.bind(this));
    }

    private async _getQrCode(_req: Request, res: Response) {
        const state = await this.wpClient.getState();
        if (state === 'CONNECTED') {
            res.send('Client is connected!');
        } else if (state === 'UNKNOWN') {
            res.send('Client is not running!');
        } else {
            this.qrCodeRepo.getLast()
                .then((result) => {
                    res.send(result.qrcode);
                })
                .catch(() => {
                    res.status(500);
                    res.send('[ERROR] Could not generate qr code!')
                });
        }
    }

    private async _getState(_req: Request, res: Response) {
        const state = await this.wpClient.getState();
        res.send(state);
    }

    private async _restartClient(_req: Request, res: Response) {
        await this.wpClient.restart()
            .then(() => res.send('Restarted'))
            .catch(() => res.send('Client is running'));
    }

}
