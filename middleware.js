import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get('auth_token')?.value;
  const url = req.nextUrl.clone();

  // Allow access to login page
  if (url.pathname.startsWith('/login')) return NextResponse.next();

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (err) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'], // protect all except _next, favicon, api
};
