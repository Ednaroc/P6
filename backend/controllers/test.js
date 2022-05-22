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
            .catch((error) => {res.status(400).json({error: error});});

            
            const status = req.body.like;
            const userId = req.body.userId;
            if ((status == 0 || status == -1) && sauce.usersLiked.includes(userId)) {
                Sauce.updateOne(
                    {_id: req.params.id},
                    {$inc: {likes: -1}},
                    {$filter: {input: usersLiked, as: 'el', cond: el != userId}}
                );
            }


            Sauce.updateOne(
                {_id: req.params.id},
                if (status == 0 || status == -1) {
                    {$inc: {'sauce.likes': -1}},
                    {$filter: {input: sauce.usersLiked, as: 'el', cond: el != userId}},
                }
                if (status == -1) {
                    {$inc: {'sauce.dislikes': 1}},
                    {$push: {'sauce.usersDisLiked': userId}}
                }
                
            );


case -1:
    sauce.dislikes ++;
    sauce.likes --;
    sauce.usersDisLiked.push(userId);
    sauce.usersLiked = filtered;
case -1:
    nothing
case -1:
    sauce.dislikes ++;
    sauce.usersDisliked.push(userId);             


case 1:
    nothing
case 1:
    sauce.likes ++;
    sauce.dislikes --;
    sauce.usersLiked.push(userId);
    sauce.usersDisliked = filtered;
case 1:
    sauce.likes ++;
    sauce.usersLiked.push(userId);


    case 0:
    sauce.likes --;
    sauce.usersLiked = filtered;
case 0:
    sauce.dislikes --;
    sauce.usersDisliked = filtered;
case 0:
    nothing


// ROUTE 6: Updates the sauce (dis)like with the provided _id
exports.likeSauce = (req, res, next) => {
    let status = req.body.like;
    let userId = req.body.userId;

    

    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
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
                        sauce.usersLiked = filtered;
                        break;
                    default:
                        //;
                }
                sauceLike = sauce;
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
            }
            Sauce.updateOne({_id: req.params.id}, sauceLike)
                    .then(() => {res.status(201).json({message: 'Sauce like status updated successfully!'});})
                    .catch((error) => {res.status(400).json({error: error});});
        }
    ).catch(
        (error) => {res.status(400).json({error: error});}
    );
};