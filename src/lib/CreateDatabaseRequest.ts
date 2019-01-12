import { MysqlError, FieldInfo } from 'mysql'
import { Request , Response } from 'express'
import { dbConnection$ } from './dbConnection$';

/**
 * Check the Request is POST and application/json
 *
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} next
 */
const checkRequestMethod = (request: Request , response: Response , next: () => void) => {
    if(request.method === 'POST' && request.headers["content-type"] === 'application/json') {
        next()
    } else {
        response.status(405).send({
            message: 'Method Not Supported',
            host: request.host,
            hostname: request.hostname
        })
    }
}

/**
 * Validate the body contains the name property
 *
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} next
 */
const checkRequestBody = (request: Request , response: Response , next: () => void) => {
    if(request.body.name !== undefined) {
        next()
    } else {
        response.status(400).send({
            message: 'Bad Request - Name of database must be provided in the body'
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

    const conn = await dbConnection$
    conn.query(`create database ${request.body.name}`, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) =>  {
        response.status(err === null ? 201 : 400).send({
            err,
            results,
            fields
        })
    })

}

export default {
    path: '/database',
    middleware: [checkRequestMethod,checkRequestBody,middleware]
}