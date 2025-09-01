import { TOrder } from '@utils-types';

export type ProfileOrdersUIProps = {
  orders: TOrder[];
  onOrderClick?: (orderNumber: string) => void;
};
