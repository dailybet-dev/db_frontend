import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ service: 'dailybet-frontend', status: 'ok', sportsbook: 'not-connected', mode: 'ui-prototype' }); }
