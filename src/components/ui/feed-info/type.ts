export interface FeedInfoUIProps {
  readyOrders: number[];
  pendingOrders: number[];
  feed?: any; // Сделаем feed необязательным
}

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
