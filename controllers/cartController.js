const User = require("../models/user register")

const jwt = require("jsonwebtoken");




const loadCart = async (req, res) => {
    try {
        res.render("cart/shoppingcart");

    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {loadCart};