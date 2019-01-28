const express = require('express');
const app = express();


app.use(express.static('public'));


let server = app.listen(3000, () => {
    console.log(`Server listening on ${server.address().port}`);
});