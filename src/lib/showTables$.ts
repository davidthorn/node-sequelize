import mysql, { MysqlError } from 'mysql';
import { dbConnection$ } from './dbConnection$';
import { promise } from './promise';

export interface ShowTablesResult {
    results?: any;
}

export const showTables$ = async (dbName: string, connection?: mysql.Connection): Promise<ShowTablesResult> => {

    const con = connection || await dbConnection$

    return promise<ShowTablesResult>((resolve, reject) => {
        con.query(`show tables in ${dbName}`, (err: MysqlError | null, results?: any) => {
            if (err) {
                reject(err);
            }
            else {
                const tables = results.map((i:any) => { return i[`Tables_in_${dbName}`] })
                resolve({ results: tables });
            }
        });
    });
};




