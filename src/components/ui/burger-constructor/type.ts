import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any; // замените на точный тип
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  handleRemoveIngredient: (ingredientId: string) => void; // Добавляем пропс для удаления ингредиента
};
