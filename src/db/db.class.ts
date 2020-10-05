import { Database } from 'sqlite3';

export class DataBase {

    // @ts-ignore
    private database: Database;

    start(filename: string = 'src/db/database.db'): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database = new Database(filename, (error: Error | null) => {
                if (error) {
                    console.error(`[DB] Database not started`);
                    reject(error.message);
                } else {
                    console.log(`[DB] Database started`);
                    resolve();
                }
            });
        });
    }

    run(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.run(sql, params, (error: Error | null) => {
                if (error) {
                    console.error(`[DB] SQL run error`);
                    console.error(error);
                    reject(error.message);
                } else {
                    resolve();
                }
            })
        })
    }

    get(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.get(sql, params, (error: Error | null, result) => {
                if (error) {
                    console.error(`[DB] SQL get error`);
                    console.error(error);
                    reject(error.message);
                } else {
                    resolve(result);
                }
            })
        })
    }

    all(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.all(sql, params, (error: Error | null, rows: any[]) => {
                if (error) {
                    console.error(`[DB] SQL get all error`);
                    console.error(error);
                    reject(error.message);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    stop(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.close((error: Error | null) => {
                if (error) {
                    console.error(`[DB] Database not stopped`);
                    reject(error.message);
                } else {
                    console.log(`[DB] Database stopped`);
                    resolve();
                }
            });
        });
    }

}
