const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const dialect = process.env.DB_DIALECT || 'mssql';

let sequelizeConfig;

if (dialect === 'mssql') {
  const useTrustedConnection = process.env.DB_TRUSTED_CONNECTION === 'true';
  const ntlmUser = process.env.DB_NTLM_USER;
  const ntlmPassword = process.env.DB_NTLM_PASSWORD;
  const ntlmDomain = process.env.DB_DOMAIN || '';
  const hasNtlmCredentials = Boolean(ntlmUser && ntlmPassword);

  const config = {
    dialect: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || 'training_management',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: process.env.DB_INSTANCE || undefined,
        // Windows Authentication
        trustedConnection: useTrustedConnection,
      },
    },
    define: {
      timestamps: true,
      paranoid: true, // soft-delete
      underscored: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };

  // IMPORTANT: Khi trustedConnection=true, khong truyen username/password (tranh tedious/sequelize gui user rong).
  if (!useTrustedConnection) {
    config.username = process.env.DB_USER || 'sa';
    config.password = process.env.DB_PASSWORD || '';
  }

  // Truyen NTLM credentials chi khi user/pass duoc cung cap.
  if (useTrustedConnection && hasNtlmCredentials) {
    config.dialectOptions.authentication = {
      type: 'ntlm',
      options: {
        domain: ntlmDomain,
        userName: ntlmUser,
        password: ntlmPassword,
      },
    };
  }

  sequelizeConfig = config;
} else {
  // Fallback SQLite for testing
  sequelizeConfig = {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '..', '..', 'database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  };
}

const sequelize = new Sequelize(sequelizeConfig);

module.exports = sequelize;
