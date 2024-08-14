'use server';
import { NextResponse, NextRequest } from 'next/server';
import { getRole } from './lib/fetch';
import Cookies from 'js-cookie';

const protectPage = [
  '/admin/cashierManagements',
  '/admin/productManagements',
  '/admin/recentShift',
  '/activity',
  '/orders',
];

const protectAdmin = [
  '/admin/cashierManagements',
  '/admin/productManagements',
  '/admin/recentShift',
];

const protectCashier = [
  '/activity',
  '/orders',
];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value

  const url = req.nextUrl.pathname;
  if (protectPage.includes(url)) {
    if (!token) {
      return NextResponse.redirect(new URL(`/?redirect=${url}`, req.url));
    }
    try {
      const user = await getRole(token);
      
      if (!user) {
        return NextResponse.redirect(new URL(`/?redirect=${url}`, req.url));
      }

      if (protectCashier.includes(url) && user !== 'cashier') {
        return NextResponse.redirect(new URL(`/?redirect=${url}`, req.url));
      }

      if (protectAdmin.includes(url) && user !== 'admin') {
        return NextResponse.redirect(new URL(`/?redirect=${url}`, req.url));
      }
    } catch (error) {
      console.error('Error in middleware:', error);
      return NextResponse.redirect(new URL(`/?redirect=${url}`, req.url));
    }
  }
  return NextResponse.next();
}
