const express = require('express');
const router = express.Router();

router.post('/set', async (req, res) => {
    console.log(req.body)
})

// router.get('/get', async (req, res) => {
//     res.send
// })

module.exports = router;