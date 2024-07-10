import { createContext, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateCartItemt: () => {},
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const addedItems = [...state.items];

      const existingCartItemIndex = addedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = addedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        addedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload
        );
        addedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: addedItems,
      };
    case 'UPDATE_ITEM':
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    default:
      return state;
  }
};
export const CartContextProvider = ({ children }) => {
  const [shoppingCartState, dispatch] = useReducer(cartReducer, {
    items: [],
  });
  /*  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  }); */

  function handleAddItemToCart(id) {
    dispatch({
      type: 'ADD_ITEM',
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        productId: productId,
        amount: amount,
      },
    });
  }
  const value = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateCartItemt: handleUpdateCartItemQuantity,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
