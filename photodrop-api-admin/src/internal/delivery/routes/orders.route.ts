import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IOrdersService } from '../../service/service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import validateSchema from './joi-schemas/schema';
import { orderSchema } from './joi-schemas/order.schema';

class OrdersRoute {
  constructor(private ordersService: IOrdersService, private authMiddleware: AuthMiddleware) {
    this.ordersService = ordersService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .post('/', this.createOrder.bind(this));
  }

  private async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const cameristId = this.authMiddleware.getCameristId(req);
      const body = validateSchema(orderSchema, req.body);
      await this.ordersService.createOrder(cameristId, body.albumId, body.orders);
      res.status(200).json({ message: 'Photos successfully uploaded!' });
    } catch (error) {
      next(error);
    }
  }
}

export default OrdersRoute;
