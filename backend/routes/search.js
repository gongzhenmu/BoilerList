const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const checkAuth = require("../middleware/checkAuth");






router.get('',checkAuth,(req, res, next) => {
  Post.find(
    {
      title: { "$regex": req.body.keyword, "$options": "i" }
    }
  ).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'post fetched',
      posts: documents
    });
  });
});





// router.get('/SearchPost', function(req, res) {
//   console.log("Search post with make ...");
//   var condition = {};
//   var temOption = {};

//   console.log('the value of the sort is', req.query.sortOption);

//   if(req.query.option1 !== '' ){
//     condition.option1 = req.query.option1;
//     console.log('the req option1 is not null', condition.option1)
//   }
//   if (req.query.option2 !== ''){
//     condition.option2 = req.query.option2;
//     console.log('the req option2 is not null', condition.option2)
//   }

//   if (req.query.option3 !== ''){
//     condition.option3 = req.query.option3;
//     console.log('the req option3 is not null', condition.option3)
//   }
//   if (req.query.sortOption !== 'Option'){
//     temOption[req.query.sortOption] = req.query.sortOrder;
//     console.log('the tem option  is not null',temOption)
//   }
//   if (req.query.sortOption === 'Option') {
//     console.log('option null')
//   }


//   condition.status = {$nin : ["Archived", "Cancel Consignment"]};
//   condition.soldOrNot = {$ne : "Yes"};
//   Post.find(condition)
//     .sort(temOption)
//     .collation({locale: "en_US", numericOrdering: true})
//     .exec(function (err, post) {
//       if (err) {
//         console.log('Can not find the post ');
//         console.log(err)
//       }
//       else if(Post === undefined){
//         res.status(401).send('Cannot find the post');
//         console.log('Can not find the post');
//       }
//       else {
//         res.json(Post)
//       }
//     })
// });

// router.post('/SearchAndSort', function(req, res) {

//   const condition = {};
//   const sortOption = {};

//   if(req.body.option1 !== undefined && req.body.option1 !== null && req.body.option1 !== '' && req.body.option1 !== 'all'){
//     condition.option1 = req.body.option1;
//   }
//   if (req.body.option2 !== undefined && req.body.option2 !== null && req.body.option2 !== '' && req.body.option2 !== 'all'){
//     condition.option2 = req.body.option2;
//   }
//   if (isNaN(Number(req.body.MinTime)) || isNaN(Number(req.body.MaxTime)) || isNaN(Number(req.body.MinPrice)) ||
//     isNaN(Number(req.body.MaxPrice)) || isNaN(Number(req.body.MinOrder)) || isNaN(Number(req.body.MaxOrder))) {
//     res.status(400).send('Bad request: Please input valid Year/Price/Mileage parameters.');
//   } else {
//     condition.Time = {};
//     condition.Time.$gte = Number(req.body.MinTime);
//     condition.Time.$lte = Number(req.body.MaxTime);

//     condition.AskingPrice = {};
//     condition.AskingPrice.$gte = Number(req.body.MinPrice);
//     condition.AskingPrice.$lte = Number(req.body.MaxPrice);

//     condition.Corder = {};
//     condition.Corder.$gte = Number(req.body.AOrder);
//     condition.Corder.$lte = Number(req.body.ZOrder);
//   }


//   if (req.body.sortType !== 'Time' && req.body.sortType !== 'AskingPrice' && req.body.sortType !== 'Corder' &&
//     req.body.sortDirection !== 1 && req.body.sortDirection !== -1){
//     res.status(400).send('Bad request: Please input valid sort parameters.');
//   } else {
//     sortOption[req.body.sortType] = req.body.sortDirection;
//   }

//   if (isNaN(req.body.startIndex) || isNaN(req.body.count)){
//     res.status(400).send('Bad request: Please input valid start index and count number.');
//   } else {
//     if (!Number.isInteger(Number(req.body.startIndex)) || !Number.isInteger(Number(req.body.count))) {
//       res.status(400).send('Bad request: Please input valid start index and count number.');
//     }
//   }
//   Post.find(condition).exec(function (err, data) {
//     if (err) {
//       res.status(500).send('Internal Server Error.');
//     } else {
//       Post.find(condition, { FloorPrice: 0 }).sort(sortOption).limit(req.body.count).skip(req.body.startIndex).collation({locale: "en_US", numericOrdering: true})
//         .exec(function (err, post) {
//           if (err) {
//             res.status(500).send('Internal Server Error.');
//           } else {
//             res.status(200).send({ result: post, count: data.length });
//           }
//         })
//     }
//   });

// });

module.exports = router;
