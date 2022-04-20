const Sauce = require('../models/sauce');
const fs = require('fs');

// ROUTE 1: Returns all sauces from the database
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {res.status(200).json(sauces);})
        .catch((error) => {res.status(400).json({error: error});});
};

// ROUTE 2: Returns the sauce with the provided _id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {res.status(200).json(sauce);})
        .catch((error) => {res.status(404).json({error: error});});
};

//QUESTION: TODO weird image file name, url scheme
// ROUTE 3: Creates a new sauce in the database
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => {res.status(201).json({message: 'Sauce saved successfully.'});})
        .catch((error) => {res.status(400).json({error: error});});
};

//QUESTION: TODO to delete the old picture!
// ROUTE 4: Updates the sauce with the provided _id
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({_id: req.params.id});
    //QUESTION: how do we know the req.params??
    //let sauce = new Sauce({_id: req.params._id});
    if (req.file) {
        req.body.sauce = JSON.parse(req.body.sauce);
        const url = req.protocol + '://' + req.get('host');
        // const filename = sauce.imageUrl.split('/images/')[1];
        // fs.unlink('images/' + filename, (sauce) => {
            sauce = {
                //_id: req.params.id,
                userId: req.body.sauce.userId,
                name: req.body.sauce.name,
                manufacturer: req.body.sauce.manufacturer,
                description: req.body.sauce.description,
                mainPepper: req.body.sauce.mainPepper,
                imageUrl: url + '/images/' + req.file.filename,
                heat: req.body.sauce.heat,
                //likes: 0,
                //dislikes: 0,
                //usersLiked: [],
                //usersDisliked: []
            };
        // });
        
    } else {
        sauce = {
           // _id: req.params.id, //QUESTION: is this necessary?
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat
            //likes: 0,
            //dislikes: 0,
            //usersLiked: [],
            //usersDisliked: []
        };
    }
    Sauce.updateOne({_id: req.params.id}, sauce)
        .then(() => {res.status(201).json({message: 'Sauce updated successfully!'});})
        .catch((error) => {res.status(400).json({error: error});});
};

// ROUTE 5: Deletes the sauce with the provided _id
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            if (!sauce) {
                return res.status(404).json({error: new Error('No such thing!')});
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({error: new Error('Unauthorized request!')});
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            // To delete the file
            fs.unlink('images/' + filename, () => {
               // Deleting once we know it exists and it belongs to the user
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => {res.status(200).json({message: 'Deleted!'});})
                    .catch((error) => {res.status(400).json({error: error});});
            });
        }
    );
    //QUESTION: should I add a findOne catch block?
};

// ROUTE 6: Updates the sauce (dis)like with the provided _id
exports.likeSauce = (req, res, next) => {
    let status = req.body.like;
    let userId = req.body.userId;
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            console.log('Beginning');
            let sauceLike = new Sauce({_id: req.params.id});
            if (sauce.usersLiked.includes(userId)) {
                const filtered = sauce.usersLiked.filter((el) => {return el != userId;});
                switch (status) {
                    case -1:
                        sauce.dislikes ++;
                        sauce.likes --;
                        sauce.usersDisLiked.push(userId);
                        sauce.usersLiked = filtered;
                        break;
                    case 0:
                        sauce.likes --;
                        // const filtered = sauce.usersliked.filter((el) => {return el != userId;});
                        sauce.usersLiked = filtered;
                        break;
                    default:
                        //;
                }
                sauceLike = sauce;
                Sauce.updateOne({_id: req.params.id}, sauceLike)
                    .then(() => {res.status(201).json({message: 'Sauce like status updated successfully!'});})
                    .catch((error) => {res.status(400).json({error: error});});
                
            } else if (sauce.usersDisliked.includes(userId)) {
                const filtered = sauce.usersDisliked.filter((el) => {return el != userId;});
                switch (status) {
                    case 1:
                        sauce.likes ++;
                        sauce.dislikes --;
                        sauce.usersLiked.push(userId);
                        sauce.usersDisliked = filtered;
                        break;
                    case 0:
                        sauce.dislikes --;
                        sauce.usersDisliked = filtered;
                        break;
                    default:
                        //;
                }
                sauceLike = sauce;
                Sauce.updateOne({_id: req.params.id}, sauceLike)
                    .then(() => {res.status(201).json({message: 'Sauce like status updated successfully!'});})
                    .catch((error) => {res.status(400).json({error: error});});
                
            } else {
                switch (status) {
                    case -1:
                        sauce.dislikes ++;
                        sauce.usersDisliked.push(userId);
                        break;
                    case 1:
                        sauce.likes ++;
                        sauce.usersLiked.push(userId);
                        break;
                    default:
                        //;
                }
                sauceLike = sauce;
                Sauce.updateOne({_id: req.params.id}, sauceLike)
                    .then(() => {res.status(201).json({message: 'Sauce like status updated successfully!'});})
                    .catch((error) => {res.status(400).json({error: error});});
                
            }
        }
    ).catch(
        (error) => {res.status(400).json({error: error});}
    );
};