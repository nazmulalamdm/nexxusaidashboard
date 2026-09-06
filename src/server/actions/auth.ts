// src/server/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function registerAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim() || 'Operator';
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { error: 'Please fill in all required credentials.' };
  }

  // সফল রেজিস্ট্রেশন রেসপন্স
  return { success: true };
}

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();
  const callbackUrl = (formData.get('callbackUrl') as string)?.trim() || '/overview';

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const cookieStore = await cookies();

  // ১. সেশন টোকেন সেট
  cookieStore.set('tp_auth_token', 'mock_secure_token_abc123', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // ৭ দিন
  });

  // ২. ইউজার প্রোফাইল ডাটা সেট
  cookieStore.set(
    'tp_user_profile',
    encodeURIComponent(
      JSON.stringify({
        name: email.split('@')[0],
        email: email,
      })
    ),
    {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  // ৩. সরাসরি কাঙ্ক্ষিত পেজে রিডাইরেক্ট
  redirect(callbackUrl);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('tp_auth_token');
  cookieStore.delete('tp_user_profile');
  redirect('/login');
}