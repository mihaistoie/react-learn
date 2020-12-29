import React from 'react';
import ReactDOM from 'react-dom';
import './css/custom.scss';
import './css/authoring.scss';
import './index.css';
// import App from './App';
import { Layout } from './components/layout/Layout'
import * as serviceWorker from './serviceWorker';
import { FormManagerHelper } from './layout/form-manager';
import { ISchemaDefinition } from './tools/schema';
import { Customer } from './test';
import { registerEditStringControl } from './components/controls/StringControl';

const layout: any = {
    $title: { value: 'My Name is {{firstName}} {{lastName}}', size: 2 },
    $type: 'block',
    $items: [
        {
            $title: { value: 'Level 2', size: 3 },
            $type: 'block',
            $items: [
                {
                    $type: 'block',
                    options: {
                        bindVisibility: 'readOnly',
                        bindVisibilityValue: false
                    },
                    $title: { value: '{{firstName}} {{lastName}}', size: 4 },
                }]
        },
        {
            $type: 'block',
            $title: { value: 'Level 2', size: 3 },
            $fields: [
                { $bind: 'firstName', $widget: 'edit-string' },
                { $bind: 'lastName', $widget: 'edit-string' }
            ]
        }]
};

const schema: ISchemaDefinition = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        readOnly: {
            type: 'boolean'
        }

    }
};
const data = new Customer();
data.firstName = 'John';
data.lastName = 'DOE';
data.readOnly = false;
FormManagerHelper.createForm(layout, schema, data, { authoring: true });
registerEditStringControl();
ReactDOM.render(
    // <React.StrictMode>
    <Layout {...layout} />,
    // </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
