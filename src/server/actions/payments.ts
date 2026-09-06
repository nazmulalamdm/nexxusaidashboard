'use server';

import { db } from '@/server/db/client';

export interface PaymentMethodItem {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'usdc';
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string;
  isDefault: boolean;
  network?: string;
}

export interface BillingSettings {
  autoRechargeEnabled: boolean;
  rechargeThresholdUsd: number;
  rechargeAmountUsd: number;
  billingEmail: string;
  taxId: string;
  currency: string;
}

export interface PaymentsPageData {
  methods: PaymentMethodItem[];
  settings: BillingSettings;
}

export async function getPaymentsData(): Promise<PaymentsPageData> {
  // ফলব্যাক ডাটা
  const methods: PaymentMethodItem[] = [
    {
      id: 'pm-01',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2028,
      holderName: 'TechknowPointAI Admin',
      isDefault: true,
    },
    {
      id: 'pm-02',
      brand: 'mastercard',
      last4: '8821',
      expMonth: 8,
      expYear: 2027,
      holderName: 'Lead Architect',
      isDefault: false,
    },
    {
      id: 'pm-03',
      brand: 'usdc',
      last4: '7e4b',
      expMonth: 0,
      expYear: 0,
      holderName: '0x9a8f...7e4b',
      network: 'Polygon PoS',
      isDefault: false,
    },
  ];

  const settings: BillingSettings = {
    autoRechargeEnabled: true,
    rechargeThresholdUsd: 15.00,
    rechargeAmountUsd: 100.00,
    billingEmail: 'billing@techknowpoint.ai',
    taxId: 'US-EIN-9821441',
    currency: 'USD ($)',
  };

  return { methods, settings };
}

export async function updateAutoRecharge(params: {
  enabled: boolean;
  threshold: number;
  amount: number;
}) {
  // ডাটাবেজ আপডেট কল (এখানে সিমুলেশন)
  return { success: true, updated: params };
}

export async function setDefaultPaymentMethod(methodId: string) {
  return { success: true, methodId };
}

export async function removePaymentMethod(methodId: string) {
  return { success: true, methodId };
}