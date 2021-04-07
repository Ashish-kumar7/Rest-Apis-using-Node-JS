const express = require('express');
const router = express.Router();
const Ninja = require('../model/ninja');

//get request to get the ninja from db
router.get('/ninjas', (req, res, next) => {
    //    Ninja.find().then((ninja)=>{
    //        res.send(ninja);
    //    }).catch((err)=>{
    //        res.send(err);
    //    })

    Ninja.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                },
                spherical: true,
                maxDistance: 10000000,
                distanceField: "dist.calculated"
            }
        }])
        .then((ninja) => {
            res.send(ninja);
        });
    //this method to use geoNear directly is too old and gone hence go with above method to get the agggregate.
    // Ninja.geoNear(
    //     {type:'Point',coordinates:[parseFloat(req.query.lng),parseFloat(req.query.lat)]},
    //     {maxdistance:1000,spherical:true}
    // ).then((ninja)=>{
    //     res.send(ninja);
    // });
});

//post request to post the ninja into db
router.post('/ninjas', (req, res, next) => {
    //top create an object and save it 
    //this is shortcut method using mongoose.
    Ninja.create(req.body).then((ninja) => {
        res.send(ninja);
    }).catch(next);
});

//put request to update the ninja in db
router.put('/ninjas/:id', (req, res, next) => {
    //take the id into the id variable
    const id = req.params.id;
    //now wwe use the findbyid method to find and update the same.
    Ninja.findByIdAndUpdate({
            _id: id
        }, req.body)
        .then(() => {
            //since directly the value to sent stored in ninja is not updated by the value , but in the database it is updated hence we again
            //get the element by id and do it.
            Ninja.findOne({
                _id: id
            }).then((ninja) => {
                res.send(ninja);
            })
        })
        .catch(next);
});

//delete request to delete the ninja from db
router.delete('/ninjas/:id', (req, res, next) => {
    //take the id into the id variable
    const id = req.params.id;
    //using findby id and remove method find it and remove from db.
    Ninja.findByIdAndRemove({
            _id: id
        })
        .then((ninja) => {
            res.send({
                Removed_Object: ninja
            })
        }).catch(next);
});

module.exports = router;