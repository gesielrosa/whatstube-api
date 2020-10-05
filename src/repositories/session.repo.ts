import { DataBase } from "../db/db.class";

export class SessionRepository {

    // @ts-ignore
    private db: DataBase;

    private tableName = 'session';

    public start(db: DataBase): Promise<any> {
        this.db = db;
        return this._createTable().then(() => {
            console.log('[SessionRepository] TABLE CREATED')
        });
    }

    private _createTable(): Promise<any> {
        const sessionTable = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, json TEXT, dt_created BIGINT);`;
        return this.db.run(sessionTable);
    }

    public insert(session: string): Promise<any> {
        const sql = `INSERT INTO ${this.tableName} (json, dt_created) VALUES (?, ?);`;
        return this.db.run(sql, [session, Date.now()]);
    }

    public getLast(): Promise<any> {
        const sql = `SELECT * FROM ${this.tableName} ORDER BY ID DESC LIMIT 1;`;
        return this.db.get(sql);
    }

}
