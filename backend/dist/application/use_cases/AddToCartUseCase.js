"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCartUseCase = void 0;
class AddToCartUseCase {
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(request) {
        const { userId, productId, quantity } = request;
        // Validate product exists
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        // Check if item already exists in cart
        const existingItem = await this.cartRepository.findByUserIdAndProductId(userId, productId);
        if (existingItem) {
            // Update quantity
            const updatedItem = await this.cartRepository.update(existingItem.id, existingItem.quantity + quantity);
            if (!updatedItem) {
                throw new Error('Failed to update cart item');
            }
            return updatedItem;
        }
        else {
            // Create new cart item
            return await this.cartRepository.create({
                userId,
                productId,
                product,
                quantity
            });
        }
    }
}
exports.AddToCartUseCase = AddToCartUseCase;
