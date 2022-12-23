const { Router } = require('express');
const shopconn = require('../controllers/controller');

const shopRouter = Router();

shopRouter.post('/shop/add', shopconn.postTicket);
shopRouter.get('/shop/:matchNumber', shopconn.getTicket);
shopRouter.get('/shop', shopconn.getAllTickets);
shopRouter.post('/update/Cancel/:matchNumber', shopconn.updateTicket);
shopRouter.post('/update/Pending/:matchNumber', shopconn.updatePending);
shopRouter.post('/update/Reserved/:matchNumber', shopconn.updateReserved);
shopRouter.delete('/:matchNumber', shopconn.deleteTicket);

module.exports = shopRouter;