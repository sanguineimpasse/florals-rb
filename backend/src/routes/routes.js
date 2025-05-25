const express = require('express');
const router = express.Router();

router.post('/survey/submit', async (req, res) => {
    console.log('doing post operation');
    const { surveyID, details, responses } = req.body;
    
    console.log( '\nsurvey query from: ' + details.name + ' of year ' + details.year + '\n');
    console.log( 'their responses: ' + responses + '\n');
    const response = { message : 'valid inputs 👍'} //emoji on code???? AHHHHHHH HELLL NAWWWW 😭💀
    res.status(201).json({ response })
    // try {
    //     const movie = await Movie.create({ title, director, year_released: yearReleased, rating, genre });
    //     res.status(201).json(movie);
    // } catch (error) {
    //     console.error('Error creating movie:', error);
    //     res.status(500).json({ error: 'Failed to create movie' });
    // }
});

router.get('/test', (req, res) => {
  const data = {
    message: 'Hello, world!',
    timestamp: new Date(),
    status: 'success'
  };
  res.status(200).json({ data: data });
});

router.get('/brew', (req, res) => {
  const date = new Date();
  res.status(418).json({message:"I'm a teapot. I cannot brew coffee.", timestamp: date});
});

// Handle requests by serving index.html for all routes
router.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

module.exports = router;