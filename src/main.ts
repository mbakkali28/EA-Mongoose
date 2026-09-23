import { connectDatabase, disconnectDatabase } from './config/db.js';
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  listAllTasks
} from './services/task.service.js';
import { deleteAllOrganizations, seedOrganizations } from './services/organization.service.js';
import { deleteAllUsers, seedUsers } from './services/user.service.js';
import { buildUsersSeed, organizationsSeed } from './seed-data.js';

const cleanDatabase = async (): Promise<void> => {
  await Promise.all([deleteAllUsers(), deleteAllOrganizations()]);
  console.log('Base de datos limpia');
}

const main = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log('Conectado a MongoDB');

    await cleanDatabase();

    const organizations = await seedOrganizations(organizationsSeed);
    const users = await seedUsers(buildUsersSeed(organizations));
    console.log(`Insertadas ${organizations.length} organizaciones y ${users.length} usuarios`);

    const created = await createTask({
      title: 'Tasca de prova',
      description: 'Implementar backend amb Mongoose',
      completed: false,
      organization: organizations[0]._id as any
    });
    console.log('1. Creat:', created);

    const all = await listAllTasks();
    console.log('2. Llistat complet:', all);

    const found = await getTaskById(created._id.toString());
    console.log('3. Trobat per ID:', found);

    const updated = await updateTask(created._id.toString(), { completed: true });
    console.log('4. Actualitzat:', updated);

    const deleted = await deleteTask(created._id.toString());
    console.log('5. Eliminat:', deleted);

  } catch (error) {
    console.error('Error en el ejemplo:', error);
  } finally {
    await disconnectDatabase();
    console.log('Desconectado de MongoDB');
  }
}

main();
