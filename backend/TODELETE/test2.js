const { disableDebugTools } = require('@angular/platform-browser');
const { db } = require('../models/sauce');
const Sauce = require('../models/sauce');

Sauce.updateOne({_id: req.params.id}, {
    {$push: {usersDisliked: [userId]}},
    {$inc: {dislikes: 1}}
});

Sauce.updateOne(
    {_id: req.params.id}, 
    {
        {$set:{
            title: 'my new title',
            body: 'my new body'}},
        {$push: {usersDisliked: [userId]}},
        {$inc: {dislikes: 1}}
    },
    {uspert: true}
);


{
    "key": "value"
}
db
show dbs
use