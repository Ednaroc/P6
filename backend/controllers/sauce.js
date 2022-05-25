const Sauce = require('../models/sauce');
const fs = require('fs');

// ROUTE 1: Returns all sauces from the database
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {res.status(200).json(sauces);})
        .catch((error) => {next(error);});
};

// ROUTE 2: Returns the sauce with the provided _id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {res.status(200).json(sauce);})
        .catch((error) => {next(error);});
};

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
        .catch((error) => {next(error);});
};

// ROUTE 4: Updates the sauce with the provided _id
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({_id: req.params.id});
    if (req.file) {
        req.body.sauce = JSON.parse(req.body.sauce);
        const url = req.protocol + '://' + req.get('host');
        sauce = {
            userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
        };
        Sauce.findOneAndUpdate(
            {_id: req.params.id}, sauce,
            {projection: {'imageUrl': 1}}
        )
            .then((promiseReturn) => {
                const filename = promiseReturn.imageUrl.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    res.status(201).json({message: 'Sauce updated successfully!'});
                });
            })
            .catch((error) => {next(error);});      
    } else {
        sauce = {
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat
        };
        Sauce.updateOne({_id: req.params.id}, sauce)
            .then(() => {res.status(201).json({message: 'Sauce updated successfully!'});})
            .catch((error) => {next(error);});
    }
};

// ROUTE 5: Deletes the sauce with the provided _id
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(
        (sauce) => {
            if (!sauce) {
                next({'message': 'No such thing!'});
            }
            if (sauce.userId !== req.auth.userId) {
                next({'message': 'Unauthorized request!'});
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            // To delete the associated image file
            fs.unlink('images/' + filename, () => {
               // Deleting once we know it exists and it belongs to the user
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => {res.status(200).json({message: 'Deleted!'});})
                    .catch((error) => {next(error);});
            });
        }
    )
    .catch((error) => {next(error);});
};

// ROUTE 6: Updates the sauce (dis)like with the provided _id
exports.likeSauce = (req, res, next) => {
    let status = req.body.like;
    let userId = req.body.userId;

    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            let sauceLike = new Sauce({_id: req.params.id});
            const filteredLiked = sauce.usersLiked.filter((el) => {return el != userId;});
            const filteredDisliked = sauce.usersDisliked.filter((el) => {return el != userId;});
            switch (status) {
                case -1:
                    if (!sauce.usersDisliked.includes(userId)) {
                        sauce.dislikes ++;
                        sauce.usersDisliked.push(userId);
                    }
                    if (sauce.usersLiked.includes(userId)) {
                        sauce.likes --;
                        sauce.usersLiked = filteredLiked;
                    }
                    break;
                case 1:
                    if (sauce.usersDisliked.includes(userId)) {
                        sauce.dislikes --;
                        sauce.usersDisliked = filteredDisliked;
                    }
                    if (!sauce.usersLiked.includes(userId)) {
                        sauce.likes ++;
                        sauce.usersLiked.push(userId);
                    }
                    break;
                case 0:
                    if (sauce.usersDisliked.includes(userId)) {
                        sauce.dislikes --;
                        sauce.usersDisliked = filteredDisliked;
                    }
                    if (sauce.usersLiked.includes(userId)) {
                        sauce.likes --;
                        sauce.usersLiked = filteredLiked;
                    }
                    break;
            }
            sauceLike = sauce;
            Sauce.updateOne({_id: req.params.id}, sauceLike)
                .then(() => {res.status(201).json({message: 'Sauce like status updated successfully!'});})
                .catch((error) => {next(error);});
        }
    ).catch((error) => {next(error);});
};