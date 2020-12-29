export type SchemaPropertyType = 'integer' | 'boolean' | 'number' | 'string' | 'object' | 'array';
export type SchemaPropertyFormat = 'money' | 'date' | 'date-time' | 'email' | 'password';

export interface ISchemaDefinition {
    name?: string;
    type: SchemaPropertyType;
    properties?: {
        [key: string]: ISchemaProperties | ISchemaRef | ISchemaDefinition;
    };
}

export interface IArraySchema extends ISchemaDefinition {
    primaryKey: string;
}

export interface ISchemaRef  {
    reference: string;
}

export interface ISchemaProperties {
    type: SchemaPropertyType;
    title?: string;
    format?: SchemaPropertyFormat;
    items?: IArraySchema | ISchemaRef;
}

