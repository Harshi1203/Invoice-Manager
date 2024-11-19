import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
    name: 'products',
    initialState: [],
    reducers: {
        addProduct: (state, action) => {
            state.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.findIndex(prod => prod.id === action.payload.id);
            if (index >= 0) {
                state[index] = action.payload;
            }
        },
    },
});

export const { addProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
