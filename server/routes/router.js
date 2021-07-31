const express = require('express');
const route = express.Router()
const services = require('../services/render');
const controller = require('../controller/controller');

route.post('/api/events', controller.create);
route.post('/api/events/addProduct', controller.productCreate);
route.post('/api/events/AddtoCart/:id', controller.AddtoCart);
// route.put('/api/events/:id', controller.update);
route.delete('/api/events/delete/:id', controller.removeCartItems);

module.exports = route;
