'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create TBS schema
    await queryInterface.sequelize.query('IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = \'tbs\') BEGIN EXEC(\'CREATE SCHEMA tbs\') END');

    // Users
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'dispatcher', 'driver', 'customer'), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') }
    }, { schema: 'tbs' });

    // Assets
    await queryInterface.createTable('Assets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      geotab_id: { type: Sequelize.STRING },
      availability: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') }
    }, { schema: 'tbs' });

    // Jobs
    await queryInterface.createTable('Jobs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      status: { type: Sequelize.STRING, allowNull: false },
      truck_type: { type: Sequelize.STRING, allowNull: false },
      material: { type: Sequelize.STRING },
      quantity: { type: Sequelize.FLOAT },
      location_lat: { type: Sequelize.FLOAT },
      location_long: { type: Sequelize.FLOAT },
      timing_start: { type: Sequelize.DATE },
      timing_end: { type: Sequelize.DATE },
      photos_json: { type: Sequelize.TEXT },
      signature: { type: Sequelize.TEXT },
      ticket_pdf_url: { type: Sequelize.STRING },
      driver_id: {
        type: Sequelize.INTEGER,
        references: { model: { tableName: 'Users', schema: 'tbs' }, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approver_id: {
        type: Sequelize.INTEGER,
        references: { model: { tableName: 'Users', schema: 'tbs' }, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') }
    }, { schema: 'tbs' });

    // Audits
    await queryInterface.createTable('Audits', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      action: { type: Sequelize.STRING, allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: { tableName: 'Users', schema: 'tbs' }, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      details: { type: Sequelize.TEXT }
    }, { schema: 'tbs' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({ tableName: 'Audits', schema: 'tbs' });
    await queryInterface.dropTable({ tableName: 'Jobs', schema: 'tbs' });
    await queryInterface.dropTable({ tableName: 'Assets', schema: 'tbs' });
    await queryInterface.dropTable({ tableName: 'Users', schema: 'tbs' });
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS tbs');
  }
};
