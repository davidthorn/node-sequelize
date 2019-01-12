import mysql from 'mysql';
import { promise } from './promise';
export const dbConnection$ = promise<mysql.Connection>((resolve, reject) => {
    const connection: mysql.Connection = mysql.createConnection({
        host: process.env.DB_HOST || '',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        port: parseInt(process.env.DB_PORT || '')
    });
    if (connection) {
        resolve(connection);
    }
    else {
        reject(connection);
    }
});
