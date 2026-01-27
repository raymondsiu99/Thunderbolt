'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'dispatcher', 'driver', 'customer'), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') }
    });

    // Assets
    await queryInterface.createTable('Assets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      geotab_id: { type: Sequelize.STRING },
      availability: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') }
    });

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
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approver_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') }
    });

    // Audits
    await queryInterface.createTable('Audits', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      action: { type: Sequelize.STRING, allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.fn('GETDATE') },
      details: { type: Sequelize.TEXT }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Audits');
    await queryInterface.dropTable('Jobs');
    await queryInterface.dropTable('Assets');
    await queryInterface.dropTable('Users');
  }
};
