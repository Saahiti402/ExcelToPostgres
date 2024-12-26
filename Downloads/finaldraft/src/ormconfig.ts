import { DataSource } from "typeorm"
import { User } from "src/entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: undefined,
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})
export const initializeDataSource = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("Data Source has been initialized!");
        }
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
        throw err;
    }
};
