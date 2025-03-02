import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseInformation = "Carregando...";

  if (!isLoading && data) {
    databaseInformation = (
      <>
        <div>Versão do PostgreSQL: {data.dependencies.database.version}</div>
        <div>
          Máximo de conexões: {data.dependencies.database.max_connections}
        </div>
        <div>Conexões abertas: {data.dependencies.database.used_conn}</div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <div>{databaseInformation}</div>
    </>
  );
}
