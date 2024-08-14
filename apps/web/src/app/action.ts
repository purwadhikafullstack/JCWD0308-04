'use server';
import { cookies } from 'next/headers';

export async function createToken(token: string) {
  const oneDay = 24 * 60 * 60 * 1000 / 4;
  const expiredDate = new Date(Date.now() + oneDay);
  cookies().set('token', token, { expires: expiredDate});
}

export async function deleteToken(key: string) {
  cookies().delete(key);
}
