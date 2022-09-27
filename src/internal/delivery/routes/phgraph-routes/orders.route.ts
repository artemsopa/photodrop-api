import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IOrdersService } from '../../../services/services';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { insertOrdersSchema } from '../joi-schemas/order.schema';
import validateSchema from '../joi-schemas/schema';

class OrdersRoute {
  constructor(private ordersService: IOrdersService, private authMiddleware: AuthMiddleware) {
    this.ordersService = ordersService;
    this.authMiddleware = authMiddleware;
  }

  initRoutes() {
    return Router()
      .post('/', this.createOrders.bind(this));
  }

  private async createOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const phgraphId = this.authMiddleware.getId(req);
      const body = validateSchema(insertOrdersSchema, req.body);
      await this.ordersService.createMany(phgraphId, body.albumId, body.orders);
      res.status(200).json({ message: 'Orders successfully created!' });
    } catch (error) {
      next(error);
    }
  }
}

export default OrdersRoute;
