import { connectDB, sequelize } from './db.connect.js';
import './models.js';

const syncDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Synchronizing all models with MySQL database...');
    await sequelize.sync({ alter: true });

    console.log('Fetching all tables in unisphere...');
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('\n--- ALL TABLES IN DATABASE ---');
    tables.forEach((t, i) => {
      const tableName = Object.values(t)[0];
      console.log(`${i + 1}. ${tableName}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Database sync error:', error);
    process.exit(1);
  }
};

syncDatabase();
