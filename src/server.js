import app from './app.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verificar variables de entorno requeridas
    const requiredEnvs = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'JWT_SECRET'];
    for (const env of requiredEnvs) {
      if (!process.env[env]) {
        throw new Error(`Variable de entorno ${env} no está definida`);
      }
    }

    // Intentar conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida con éxito.');

    // Sincronizar modelos
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📚 Modelos sincronizados con la base de datos (modo alter).');
    } else {
      await sequelize.sync();
      console.log('📚 Modelos sincronizados con la base de datos (modo seguro).');
    }

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV}`);
    });
  }
  catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();