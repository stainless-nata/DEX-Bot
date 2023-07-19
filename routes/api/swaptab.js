const express = require('express');
const router = express.Router();

router.post('/set', async (req, res) => {
    console.log(req.body)
})

module.exports = router;