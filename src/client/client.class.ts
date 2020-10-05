import { Client, ClientSession, WAState } from 'whatsapp-web.js';

import { QrCodeRepository } from "../repositories/qr-code.repo";
import { SessionRepository } from "../repositories/session.repo";

export class WPClient {

    // @ts-ignore
    private client: Client;
    // @ts-ignore
    private _qrCodeRepo: QrCodeRepository;
    // @ts-ignore
    private _sessionRepo: SessionRepository;

    private _session: ClientSession | undefined;

    // @ts-ignore
    private _state: WAState | 'UNKNOWN';
    private _isAuthenticated: boolean = false;
    // @ts-ignore
    private _isReady: boolean = false;

    public async start(qrCodeRepo: QrCodeRepository, sessionRepo: SessionRepository) {
        this._qrCodeRepo = qrCodeRepo;
        this._sessionRepo = sessionRepo;

        await this._createClient();
    }

    public async restart() {
        if (!this._isAuthenticated) {
            await this._destroyClient();
            this._initializeClient();
            return Promise.resolve();
        }
        return Promise.reject();
    }

    public async getState(): Promise<WAState | 'UNKNOWN'> {
        this._state = await this.client.getState().catch(() => {
            return 'UNKNOWN';
        });
        return this._state;
    }

    public getClient(): Client {
        return this.client;
    }

    private async _getLastSession(): Promise<any> {
        await this._sessionRepo.getLast()
            .then(result => {
                if (result) {
                    this._session = JSON.parse(result.json);
                } else {
                    this._session = undefined;
                }
            }).catch((error: string) => {
                console.error(error);
                this._session = undefined;
            });
    }

    private async _createClient() {
        await this._getLastSession();

        this.client = new Client({puppeteer: {headless: false}, restartOnAuthFail: true, session: this._session});
        this._initializeClient();
        this._watchEvents();
    }

    private _initializeClient() {
        this.client.initialize();
    }

    private async _destroyClient() {
        await this.client.destroy();
    }

    private _watchEvents() {
        this.client.on('qr', this._qrCode.bind(this));
        this.client.on('authenticated', this._authenticated.bind(this));
        this.client.on('auth_failure', this._authFailure.bind(this));
        this.client.on('disconnected', this._disconnected.bind(this));
        this.client.on('change_state', this._changeState.bind(this));
        this.client.on('ready', this._ready.bind(this));
    }

    private _qrCode(qr: string) {
        this._qrCodeRepo.insert(JSON.stringify(qr))
            .catch((error: string) => console.error(error));
    }

    private _authenticated(session: ClientSession) {
        console.log('[WAClient] AUTHENTICATED');
        this._isAuthenticated = true;
        this._sessionRepo.insert(JSON.stringify(session))
            .catch((error: string) => console.error(error));
    }

    private _authFailure(msg: string) {
        console.error('[WAClient] AUTHENTICATION FAILURE', msg);
        this._isAuthenticated = false;
        this._isReady = false;
        this._destroyClient();
    }

    private _disconnected(reason: WAState) {
        console.log('[WAClient] LOGGED OUT', reason);
        this._isAuthenticated = false;
        this._isReady = false;
    }

    private _changeState(state: WAState) {
        console.log('[WAClient] CHANGE STATE', state);
        this._state = state;
    }

    private _ready() {
        console.log('[WAClient] READY');
        this._isReady = true;
    }

}

