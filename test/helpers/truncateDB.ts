import { db } from "~/db.server";

export async function truncateDB() {
  const tablenames = await db.$queryRaw<
    Array<{ TABLE_NAME: string }>
  >`SELECT table_name FROM information_schema.tables WHERE table_schema = 'test'`;

  for (const { TABLE_NAME: tablename } of tablenames) {
    // console.log(tablename);
    if (tablename && tablename !== "_prisma_migrations") {
      try {
        await db.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
        await db.$executeRawUnsafe(`TRUNCATE TABLE ${tablename}`);
        await db.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
      } catch (error) {
        console.log({ error });
      }
    }
  }
}
