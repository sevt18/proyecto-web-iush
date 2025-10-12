import app from './app.js';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
async function startServer() {
    try{
        await Sequelize.authenticate();
        console.log('Database connected');

        await Sequelize.sync({ alter: true });
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(error){
        console.error('Unable to connect to the database:', error);
    }
}

startServer();