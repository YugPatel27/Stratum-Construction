import React from 'react';
import LegalDocument from '@/components/legal/LegalDocument';
import { legal } from '@/data/legalData';

export default function PrivacyPage() {
  return <LegalDocument doc={legal.privacy} path="/privacy" />;
}
