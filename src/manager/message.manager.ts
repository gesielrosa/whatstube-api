import { Client, Message } from "whatsapp-web.js";

export class MessageManager {

    // @ts-ignore
    private client: Client;

    public start(client: Client) {
        this.client = client;
        this._onMessageReceived();
        console.log('[MessageManager] Started');
    }

    private _onMessageReceived() {
        this.client.on('message', (msg: Message) => {
            console.log(msg);
        });
    }

}
