import { TAX_RATE, SERVICE_FEE_RATE } from '../config/constants';
import { IBillCalculation } from '../types';

/**
 * Calculate bill breakdown with taxes and fees
 * @param {number} subtotal - Subtotal amount before taxes and fees
 * @returns {IBillCalculation} Bill breakdown
 */
export const calculateBill = (subtotal: number): IBillCalculation => {
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const serviceFee = parseFloat((subtotal * SERVICE_FEE_RATE).toFixed(2));
  const total = parseFloat((subtotal + tax + serviceFee).toFixed(2));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax,
    taxRate: TAX_RATE,
    serviceFee,
    serviceFeeRate: SERVICE_FEE_RATE,
    total
  };
};
