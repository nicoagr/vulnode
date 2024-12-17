let express = require('express');
let router = express.Router();

router.post('/', (req, res) => {
    const { jsonString } = req.body;
    try {
        const parsedJson = eval(`(${jsonString})`);
        // do something with parsedJson
        res.status(200).send('OK');
    } catch (error) {
        res.status(400).send('Invalid input format');
    }
});

module.exports = router;
