import database from "infra/database.js";
import { version } from "react";

async function status(request, response) {
  //controller
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnResult = await database.query("SHOW max_connections;");
  const databaseMaxConnections = databaseMaxConnResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const usedConnResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  const databaseOpenedConnValue = usedConnResult.rows[0].count;

  //retorna pra view
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnections),
        used_conn: databaseOpenedConnValue,
      },
    },
  });
}

export default status;
