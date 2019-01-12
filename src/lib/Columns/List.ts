import mysql, { MysqlError, FieldInfo } from 'mysql';
import { promise } from '../promise';
import { dbConnection$ } from '../dbConnection$';
export const showColumns$ = async (dbName: string, tableName: string, connection?: mysql.Connection): Promise<{
    results?: any;
    fields?: FieldInfo[];
}> => {
    return promise<{
        results?: any;
        fields?: FieldInfo[];
    }>( async (resolve, reject) => {

        const con = connection || await dbConnection$

        con.query(`show columns in ${dbName}.${tableName}`, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ results: results, fields: fields });
            }
        });
    });
};
