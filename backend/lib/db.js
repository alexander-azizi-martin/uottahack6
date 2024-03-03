import mysql from "mysql2/promise"

export async function query({ query, values = [] }) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL)

  try {
    const [results] = await connection.execute(query, values)

    connection.end()

    return results
  } catch (error) {
    return { error }
  }
}