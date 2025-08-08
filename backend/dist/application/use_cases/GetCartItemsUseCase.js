"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCartItemsUseCase = void 0;
class GetCartItemsUseCase {
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(userId) {
        const cartItems = await this.cartRepository.findByUserId(userId);
        // Populate with product data
        const cartItemsWithProducts = await Promise.all(cartItems.map(async (item) => {
            const product = await this.productRepository.findById(item.productId);
            return {
                ...item,
                product
            };
        }));
        return cartItemsWithProducts;
    }
}
exports.GetCartItemsUseCase = GetCartItemsUseCase;
