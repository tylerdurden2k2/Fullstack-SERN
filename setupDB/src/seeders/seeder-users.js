"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Users", [
            {
                email: "admin@gmail.com",
                password: "123456",
                firstName: "Quang Huy",
                lastName: "Pham",
                address: "Quang Ngai",
                gender: true,
                image: "123",
                createdAt: new Date(),
                updatedAt: new Date(),
                // phoneNumber: DataTypes.STRING,
                // gender: DataTypes.BOOLEAN,
                // image: DataTypes.STRING,
                // roleId: DataTypes.STRING,
                // positionId: DataTypes.STRING,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
