import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/login', request.url));

  const supabase = supabaseServer();
  // Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?error=1', request.url));

  // success → send to admin
  return NextResponse.redirect(new URL('/admin', request.url));
}
