// app/api/export/route.ts
import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: Request) {
  const { clients, workers, tasks, rules, weights } = await request.json();

  const clientCsv = Papa.unparse(clients);
  const workerCsv = Papa.unparse(workers);
  const taskCsv = Papa.unparse(tasks);
  const rulesJson = JSON.stringify({ rules, weights }, null, 2);

  return NextResponse.json({
    clients: clientCsv,
    workers: workerCsv,
    tasks: taskCsv,
    rules: rulesJson,
  });
}