import fs from 'fs';
import { GraphQLSchema, lexicographicSortSchema, printSchema } from 'graphql';
import path from 'path';

export function writeSchema(schema: GraphQLSchema) {
  const schemaAsString = printSchema(lexicographicSortSchema(schema));
  const schemaPath = path.join(process.cwd(), 'schema.graphql');

  const existingSchema =
    fs.existsSync(schemaPath) && fs.readFileSync(schemaPath, 'utf-8');

  if (existingSchema !== schemaAsString) {
    fs.writeFileSync(schemaPath, schemaAsString);
  }
}
