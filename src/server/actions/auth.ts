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

  cookieStore.set('tp_auth_token', 'mock_secure_token_abc123', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

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

  redirect(callbackUrl);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('tp_auth_token');
  cookieStore.delete('tp_user_profile');
  redirect('/login');
}

export async function changePasswordAction(formData: FormData) {
  const newPassword = (formData.get('newPassword') as string)?.trim();
  const confirmPassword = (formData.get('confirmPassword') as string)?.trim();

  if (!newPassword || newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters long.' };
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  return { success: true };
}

// ৫. ফরগট পাসওয়ার্ড অ্যাকশন (রিসেট লিংক ইস্যু)
export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();

  if (!email) {
    return { error: 'Please enter your registered email address.' };
  }

  // ইমেইল ফরম্যাট যাচাই
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Please provide a valid email format.' };
  }

  // বাস্তব Supabase কানেকশনে:
  // const supabase = await createClient();
  // await supabase.auth.resetPasswordForEmail(email, { redirectTo: '.../reset-password' });

  return { success: true };
}

// ৬. পাসওয়ার্ড রিসেট অ্যাকশন (নতুন পাসওয়ার্ড সেট)
export async function resetPasswordAction(formData: FormData) {
  const password = (formData.get('password') as string)?.trim();
  const confirmPassword = (formData.get('confirmPassword') as string)?.trim();

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  // বাস্তব Supabase কানেকশনে:
  // const supabase = await createClient();
  // await supabase.auth.updateUser({ password });

  return { success: true };
}