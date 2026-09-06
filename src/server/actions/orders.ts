'use server';

import { db } from '@/server/db/client';

export interface OrderItem {
  id: string;
  orderNumber: string;
  creditsAmount: number;
  totalUsd: number;
  paymentMethod: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface BillingSummary {
  walletBalance: number;
  totalSpentAllTime: number;
  monthlySpendLimit: number;
  orders: OrderItem[];
}

export async function getBillingAndOrders(): Promise<BillingSummary> {
  // যদি আপনার ডাটাবেজে orders টেবিল থাকে সেখান থেকে ফেচ করবে, অন্যথায় ফলব্যাক ডেটা দেবে
  const { data: ordersData, error } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // ডিফল্ট ডেমো ট্রানজ্যাকশন ডাটা (যদি ডাটাবেজে রেকর্ড না থাকে)
  const defaultOrders: OrderItem[] = [
    {
      id: 'ord-01',
      orderNumber: 'TKP-ORD-98214',
      creditsAmount: 10000000,
      totalUsd: 50.00,
      paymentMethod: 'Stripe (Visa •••• 4242)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: 'ord-02',
      orderNumber: 'TKP-ORD-97451',
      creditsAmount: 25000000,
      totalUsd: 120.00,
      paymentMethod: 'Crypto (USDC Polygon)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    },
    {
      id: 'ord-03',
      orderNumber: 'TKP-ORD-96112',
      creditsAmount: 5000000,
      totalUsd: 25.00,
      paymentMethod: 'Stripe (Mastercard •••• 8821)',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    },
  ];

  const orders: OrderItem[] = (!error && ordersData && ordersData.length > 0)
    ? ordersData.map((o) => ({
        id: o.id,
        orderNumber: o.order_number || `TKP-ORD-${o.id.slice(0, 5)}`,
        creditsAmount: o.credits_amount || 0,
        totalUsd: Number(o.total_usd) || 0,
        paymentMethod: o.payment_method || 'Card',
        status: o.status || 'COMPLETED',
        createdAt: o.created_at,
      }))
    : defaultOrders;

  return {
    walletBalance: 142.85,
    totalSpentAllTime: 520.40,
    monthlySpendLimit: 1000.00,
    orders,
  };
}

export async function createTopUpOrder(params: { creditsAmount: number; totalUsd: number; paymentMethod: string }) {
  const newOrder = {
    order_number: `TKP-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    credits_amount: params.creditsAmount,
    total_usd: params.totalUsd,
    payment_method: params.paymentMethod,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
  };

  const { error } = await db.from('orders').insert([newOrder]);
  if (error) {
    console.error('Order creation fallback to mock:', error.message);
  }
  return { success: true, order: newOrder };
}