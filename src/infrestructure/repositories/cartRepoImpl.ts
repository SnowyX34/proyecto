import connect from '../../config/connection';
import { QueryTypes } from 'sequelize';

export class CartRepository {
  static create(arg0: { cart_id: any; user_id: any; product_id: any; model: any; height: any; width: any; quantity: any; precio_total: any; }) {
    throw new Error('Method not implemented.');
  }
  async addToCart(cart_id:number, user_id: number, product_id: number, quantity: number, model: string, height: string, width: string, precio_total: number) {
    const sql = `
      INSERT INTO cart (quote_id, user_id, product_id, model, height, width, quantity, precio_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;

    await connect.query(sql, {
      replacements: [user_id, product_id, quantity, quantity],
      type: QueryTypes.INSERT,
    });
  }
}
