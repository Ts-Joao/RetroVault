import api from '../axios';

export async function validateCoupon(code: string, orderTotal: number) {
  console.log(code, orderTotal);
  const data = await api.post('/coupon/validate', {
    code,
    orderTotal,
  });

  return { data };
}