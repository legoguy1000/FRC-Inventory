import { Sequelize } from "sequelize";

const driver = process.env.DB_DRIVER || "postgres";
const user = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "postgres";
const host = process.env.DB_HOST || "db";
const port = process.env.DB_PORT || 5432;
const dbname = process.env.DB_NAME || "postgres";

let sequelize: Sequelize = new Sequelize(`${driver}://${user}:${password}@${host}:${port}/${dbname}`) // Example for postgres
const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
initDB();

export { initDB, sequelize }

