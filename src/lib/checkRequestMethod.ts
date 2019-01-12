import { Request, Response } from 'express';
/**
 * Check the Request is POST and application/json
 *
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} next
 */
export const checkRequestMethod = (method: 'POST' | 'PATCH' | 'DELETE' | 'GET' | 'PUT'): (request: Request, response: Response, next: () => void) => void => {
    return (request: Request, response: Response, next: () => void) => {
        if (request.method === method && request.headers["content-type"] === 'application/json') {
            next();
        }
        else {
            response.status(405).send({
                message: 'Method Not Supported',
                host: request.host,
                hostname: request.hostname
            });
        }
    };
};
