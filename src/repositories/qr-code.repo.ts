import { DataBase } from "../db/db.class";

export class QrCodeRepository {

    // @ts-ignore
    private db: DataBase;

    private tableName = 'qrcode';

    public start(db: DataBase): Promise<any> {
        this.db = db;
        return this._createTable().then(() => {
            console.log('[QrCodeRepository] TABLE CREATED')
        });
    }

    private _createTable(): Promise<any> {
        const qrcodeTable = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, qrcode TEXT, dt_created BIGINT);`;
        return this.db.run(qrcodeTable);
    }

    public insert(qrCode: string): Promise<any> {
        const sql = `INSERT INTO ${this.tableName} (qrcode, dt_created) VALUES (?, ?);`;
        return this.db.run(sql, [qrCode, Date.now()]);
    }

    public getLast(): Promise<any> {
        const sql = `SELECT * FROM ${this.tableName} ORDER BY ID DESC LIMIT 1;`;
        return this.db.get(sql);
    }

}
