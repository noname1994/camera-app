'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    /**
     * method
     * 1. Change type column 
     *    queryInterface.changeColumn('table name', 'column', {type : 'INTEGER USING CAST ("column" as INTEGER)'})
     * 
     * 2. add column
     *    queryInterface.addColumn('table name', 'column name', 'type ex : Sequelize.INTEGER')
     * 
     * 3. remove column
     *    queryInterface.removeColumn('table name', 'column name')
     */

    return queryInterface.addColumn('user', 'column_test', Sequelize.INTEGER);




  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.removeColumn('user', 'column_test');
  }
};
