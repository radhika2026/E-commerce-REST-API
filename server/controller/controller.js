var Userdb = require('../model/model');
var Productdb = require('../model/product');
var Cartdb = require('../model/cart');
// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

    // new user
    const event = new Userdb({
        name : req.body.name,
        email : req.body.email
    })

    // save user in the database
    event
        .save(event)
        .then(data => {
            res.send(data)
            //res.redirect('/add-event');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}


exports.productCreate = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

    // new user
    const product = new Productdb({
          name : req.body.name,
          price : req.body.price,
          description : req.body.description
    });


    // save user in the database
    product
        .save(product)
        .then(data => {
            res.send(data)
            //res.redirect('/add-event');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

function runUpdate(condition, action){
  return new Promise((resolve, reject)=>{
      Cartdb.findOneAndUpdate(condition, action,{ upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}


//add item to cart
exports.AddtoCart = (req,res)=>{
  if(!req.body){
      res.status(400).send({ message : "Content can not be empty!"});
      return;
  }

  const id = req.params.id;
  Cartdb.findOne({userId: id}).exec((error, cart)=>{
    if (error) return res.status(400).json({error});
    if(cart){
      //if cart already exists update cart
      //const product = req.body.cartItems;
      let promiseArray = [];
      const allItems = req.body.cartItems;
      allItems.forEach((cartItem)=>{
        const product = cartItem.product;
        const item =  cart.cartItems.find((c) => c.product == product);
        let  condition, action;
        if(item){
          condition = {"userId" : id, "cartItems.product": req.body.cartItems.product};
          action = {
                    "$set": {
                      "cartItems" : {
                        "cartItems.$": cartItem,
                      }
                    }
                  }
        }
        else{
          condition = {userId : id};
          action = {
            "$push": {
              "cartItems" : cartItem
            }
          }
         };
         promiseArray.push(runUpdate(condition, action));
      });
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    }else{
      //create new cart
        const cart = new Cartdb({
              userId: id,
              cartItems: req.body.cartItems
        });

        // save cart in the database
        cart
            .save(cart)
            .then(data => {
                res.send(data)
                //res.redirect('/add-event');
            })
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
    }
  });

}


exports.removeCartItems = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Cart.update(
      { userId: req.params.id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};

// retrieve and return all users/ retrive and return a single user
// exports.find = (req, res)=>{
//
//     if(req.query.id){
//         const id = req.query.id;
//
//         Eventdb.findById(id)
//             .then(data =>{
//                 if(!data){
//                     res.status(404).send({ message : "Not found user with id "+ id})
//                 }else{
//                     res.send(data)
//                 }
//             })
//             .catch(err =>{
//                 res.status(500).send({ message: "Erro retrieving user with id " + id})
//             })
//
//     }else{
//         Eventdb.find()
//             .then(user => {
//                 res.send(user)
//             })
//             .catch(err => {
//                 res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
//             })
//     }
//
//
// }
//
// // Update a new idetified user by user id
// exports.update = (req, res)=>{
//     if(!req.body){
//         return res
//             .status(400)
//             .send({ message : "Data to update can not be empty"})
//     }
//
//     const id = req.params.id;
//     Eventdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
//         .then(data => {
//             if(!data){
//                 res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
//             }else{
//                 res.send(data)
//             }
//         })
//         .catch(err =>{
//             res.status(500).send({ message : "Error Update user information"})
//         })
// }
//
// // Delete a user with specified user id in the request
// exports.delete = (req, res)=>{
//     const id = req.params.id;
//
//     Eventdb.findByIdAndDelete(id)
//         .then(data => {
//             if(!data){
//                 res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
//             }else{
//                 res.send({
//                     message : "User was deleted successfully!"
//                 })
//             }
//         })
//         .catch(err =>{
//             res.status(500).send({
//                 message: "Could not delete User with id=" + id
//             });
//         });
// }
