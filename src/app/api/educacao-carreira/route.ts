import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/json/educacao-carreira.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao carregar dados'
    }, { status: 500 });
  }
}