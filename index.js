  const express = require('express');
  const app = express();

  // Custom "sanitization" function - does this actually prevent XSS?
  function cleanUserInput(input) {
    return input
      .replace(/<script>/gi, '')
      .replace(/<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror/gi, '')
      .replace(/onload/gi, '');
  }

  app.get('/profile', (req, res) => {
    const username = req.query.username;
    const sanitized = cleanUserInput(username);

    res.send(`
      <html>
        <body>
          <h1>Welcome ${sanitized}!</h1>
          <div id="user-data" data-name="${sanitized}">Profile</div>
        </body>
      </html>
    `);
  });

  const user = await User.findOne({
    where: sequelize.literal(`email = '${userEmail}'`)
  });

  function sanitizePath(filename) {
    return filename.replace('../', '');
  }

  app.get('/file', (req, res) => {
    const safe = sanitizePath(req.query.file);
    res.sendFile(`/uploads/${safe}`);
  });


  function verifyToken(token) {
    const decoded = jwt.decode(token); // Note: decode not verify
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
    return null;
  }
