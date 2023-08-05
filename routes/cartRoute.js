
const express = require("express");
const cart_route = express();
const User = require("../models/user register");

const cartController = require("../controllers/cartController");


cart_route.get("/shoppingcart",cartController.loadCart);

module.exports = cart_route;
