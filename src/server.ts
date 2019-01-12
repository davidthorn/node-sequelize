import express, { Request, Response } from 'express';
import CreateDatabaseRequest from './lib/CreateDatabaseRequest';
import { showColumns$ } from './lib/Columns/List';
import { showTables$ } from './lib/showTables$';
import bodyParser = require('body-parser');
import AlterTableColumn from './lib/Columns/Alter';
import AlterTableAddColumn from './lib/Columns/Add';
import AlterTableDropColumn from './lib/Columns/Drop';
const pretty = require('express-prettify')

const app = express()
app.use(pretty({query: 'json'}))
app.use(bodyParser.json({}))

app.use(CreateDatabaseRequest.path, CreateDatabaseRequest.middleware)
app.use(AlterTableColumn.path, AlterTableColumn.middleware)
app.use(AlterTableAddColumn.path, AlterTableAddColumn.middleware)
app.use(AlterTableDropColumn.path, AlterTableDropColumn.middleware)

app.get('/:database/:table/fields/:field' , async (request: Request , response: Response) => {

    const { database , table , field } = request.params
    try {
        const fields = await showColumns$(database , table)
        const _field = fields.results!.filter((i: any) => { return i.Field.toLowerCase() ===  field.toLowerCase() })
            response.status(200).json({ field: _field })
    } catch(err) {
        response.status(500).send({ err })
    }

})

app.get('/:database/:table/fields' , async (request: Request , response: Response) => {

    try {
        const columns = await showColumns$(request.params.database , request.params.table)
        response.status(200).send({ columns })
    } catch(err) {
        response.status(500).send({ err })
    }
    
})

app.get('/:dbName/tables' , async (request: Request , response: Response) => {

    try {
        const tables = await showTables$(request.params.dbName)
        response.status(200).json(tables)
    } catch(err) {
        response.status(500).json({ err })
    }
    
})

app.listen(3000 , '0.0.0.0',() => {
    console.log('working')
})