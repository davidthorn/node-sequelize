import { MysqlError, FieldInfo } from 'mysql'
import { Request , Response } from 'express'
import { dbConnection$ } from '../dbConnection$';
import { checkRequestMethod } from '../checkRequestMethod';

/**
 * Validate the body contains the name property
 *
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} next
 */
const checkRequestBody = (request: Request , response: Response , next: () => void) => {
    if(request.body.name !== undefined && request.body.type !== undefined) {
        next()
    } else {
        response.status(422).send({
            errors: [
                request.body.name === undefined ? 'Name of field must be provided in the body' : undefined,
                request.body.type === undefined ? 'Type of field must be provided in the body' : undefined
            ]
        })
    }
}

/**
 * Run the create database query
 *
 * @param {Request} request
 * @param {Response} response
 */
const middleware = async (request: Request , response: Response) => {

    const { table , database } = request.params

    const { name, type, notNull } = request.body

    const conn = await dbConnection$

    let query = `alter table ${database}.${table} `
    query += `add column ${name} ${type} `
    query += `${notNull === undefined ? "NULL" : notNull}`

    conn.query(query, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) =>  {
        response.status(err === null ? 201 : 400).send({
            err,
            results,
            fields
        })
    })

}

export default {
    path: '/:database/:table/column/add',
    middleware: [checkRequestMethod('POST'),checkRequestBody,middleware]
}