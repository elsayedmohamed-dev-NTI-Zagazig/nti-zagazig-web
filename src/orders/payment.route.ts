import {Router} from 'express';
import ordersService from "./orders.service";

const paymentRouter: Router = Router();

paymentRouter.post('/', ordersService.createOnlineOrder);

export default paymentRouter;