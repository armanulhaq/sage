import { Logger, NotFoundException } from '@nestjs/common';
import {
  LoadStrategy,
  TextType,
  Type,
  defineConfig,
  Platform,
} from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import 'dotenv/config';

const logger = new Logger('MikroORM');

const config = defineConfig({
  entities: ['dist/**/*.entity.js'], // used during production
  entitiesTs: ['src/**/*.entity.ts'], //used during development
  driver: PostgreSqlDriver, //The database driver to use.
  loadStrategy: LoadStrategy.JOINED, // Either we can run two separate SQL queries or use JOIN
  clientUrl: process.env.DATABASE_URL as string, //The URL to connect to the database.
  highlighter: new SqlHighlighter(), // It highlights the SQL queries in terminal.
  discovery: {
    getMappedType(type: string, platform: Platform) {
      // converts string to TEXT data type instead of VARCHAR(255) 
      if (type === 'string') {
        return Type.getType(TextType);
      }
      return platform.getDefaultMappedType(type);
    },
  },
  driverOptions: {
    connection: {
      keepAlive: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  debug: true,
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider,
  allowGlobalContext: true,
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: false,
    safe: true,
    emit: 'ts', // migration generation mode
  },
  pool: {
    min: 2,
    max: 15,
    idleTimeoutMillis: 10000,
    acquireTimeoutMillis: 30000,
  },
  extensions: [Migrator],
  findOneOrFailHandler: (entityName) => {
    throw new NotFoundException(`${entityName} not found`);
  },
});

export default config;
