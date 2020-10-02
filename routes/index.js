// ============================
// ==== ROOT Routes ====
// ============================

const express = require('express');
const router = express.Router();

/* get landing page */
router.get('/', (req, res) => {
    res.render('landing');
});

module.exports = router;