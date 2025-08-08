"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsUseCase = void 0;
class GetProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(filters) {
        return await this.productRepository.findAll(filters);
    }
}
exports.GetProductsUseCase = GetProductsUseCase;
