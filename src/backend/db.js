import PouchDB from 'pouchdb';

const db = new PouchDB('mydb');

export async function saveData(date, data) {
  await db.put({ _id: date, ...data });
}

export async function loadData(date) {
  const data = await db.get(date);
  return data;
}

export async function updateData(date, data) {
  const doc = await db.get(date);
  await db.put({ ...doc, ...data });
}

export async function deleteData(date) {
  const doc = await db.get(date);
  await db.remove(doc);
}

export async function loadAllData() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}