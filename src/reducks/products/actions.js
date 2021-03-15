export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const deleteProductAction = (products) => {
    return {
        type: "DELETE_PRODUCT",
        payload: products
    }
};

export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const fetchProductsAction = (products) => {
    return {
        type: "FETCH_PRODUCTS",
        payload: products
    }
};

export const SEARCH_RESULT = "SEARCH_RESULT";
export const searchResultAction = (results) => {
    return {
        type: "SEARCH_RESULT",
        payload: results
    }
};