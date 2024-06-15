// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const dotenv = require('dotenv');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('./models/User.js');
// const Message = require('./models/Message.js');
// const ws = require('ws');
// const cors = require('cors');

// dotenv.config();

// async function connectDB() {
//     try {
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB', error);
//         process.exit(1);
//     }
// }

// connectDB();

// const jwtSecret = process.env.JWT_SECRET;
// const bcryptSalt = bcrypt.genSaltSync(10);
// const app = express();
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     credentials: true,
//     origin: process.env.CLIENT_URL,
// }));

// async function getUserDataFromRequest(req) {
//     return new Promise((resolve, reject) => {
//         const token = req.cookies?.token;
//         if (token) {
//             jwt.verify(token, jwtSecret, {}, (err, userData) => {
//                 if (err) reject(err);
//                 else resolve(userData);
//             });
//         } else {
//             reject('No token');
//         }
//     });
// }

// app.get('/test', (req, res) => {
//     res.json('test ok');
// });

// app.get('/messages/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const userData = await getUserDataFromRequest(req);
//         const ourUserId = userData.userId;
//         console.log({ userId, ourUserId });
//         const messages = await Message.find({
//             $or: [
//                 { sender: userId, recipient: ourUserId },
//                 { sender: ourUserId, recipient: userId }
//             ]
//         }).sort({ createdAt: 1 }).exec();
//         res.json(messages);
//     } catch (error) {
//         console.error('Error fetching messages', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.get('/people', async (req, res) => {
//     try {
//         const users = await User.find({}, { '_id': 1, username: 1 });
//         res.json(users);
//     } catch (error) {
//         console.error('Error fetching users', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.get('/profile', async (req, res) => {
//     try {
//         const userData = await getUserDataFromRequest(req);
//         res.json(userData);
//     } catch (error) {
//         console.error('Error fetching profile', error);
//         res.status(401).json('Unauthorized');
//     }
// });

// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const foundUser = await User.findOne({ username });
//         if (foundUser) {
//             const passOk = bcrypt.compareSync(password, foundUser.password);
//             if (passOk) {
//                 const token = jwt.sign({ userId: foundUser._id, username }, jwtSecret, {});
//                 res.cookie('token', token, { sameSite: 'none', secure: true }).json({
//                     id: foundUser._id,
//                     username: foundUser.username,
//                 });
//             } else {
//                 res.status(401).json('Incorrect password');
//             }
//         } else {
//             res.status(404).json('User not found');
//         }
//     } catch (error) {
//         console.error('Error logging in', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// app.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json('Username already exists');
//         }
//         const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
//         const createdUser = await User.create({ username, password: hashedPassword });

//         const token = jwt.sign({ userId: createdUser._id, username }, jwtSecret, {});
//         res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
//             id: createdUser._id,
//         });
//     } catch (error) {
//         console.error('Error registering user', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// const server = app.listen(4000, () => {
//     console.log('Server is running on port 4000');
// });

// const wss = new ws.WebSocketServer({ server });

// wss.on('connection', (connection, req) => {
//     const cookies = req.headers.cookie;
//     if (cookies) {
//         const tokenCookieString = cookies.split(';').find(str => str.trim().startsWith('token='));
//         if (tokenCookieString) {
//             const token = tokenCookieString.split('=')[1];
//             if (token) {
//                 jwt.verify(token, jwtSecret, {}, (err, userData) => {
//                     if (err) {
//                         console.error('Error verifying WebSocket token', err);
//                         connection.close(); // Close connection on error
//                     } else {
//                         const { userId, username } = userData;
//                         connection.userId = userId;
//                         connection.username = username;
//                     }
//                 });
//             }
//         }
//     }

//     connection.on('message', async (message) => {
//         try {
//             const messageData = JSON.parse(message.toString());
//             const { recipient, text } = messageData;
//             if (recipient && text) {
//                 const messageDoc = await Message.create({
//                     sender: connection.userId,
//                     recipient,
//                     text,
//                 });
//                 [...wss.clients].filter(c => c.userId === recipient)
//                     .forEach(c => c.send(JSON.stringify({
//                         text,
//                         sender: connection.userId,
//                         recipient,
//                         _id: messageDoc._id
//                     })));
//             }
//         } catch (error) {
//             console.error('Error handling WebSocket message', error);
//         }
//     });

//     // Notify everyone about online users
//     const onlineUsers = [...wss.clients].map(c => ({ userId: c.userId, username: c.username }));
//     connection.send(JSON.stringify({ online: onlineUsers }));
// });

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Message = require('./models/Message');
const ws = require('ws');
const fs = require('fs');

dotenv.config();
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

connectDB();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject('no token');
    }
  });

}

app.get('/test', (req,res) => {
  res.json('test ok');
});

app.get('/messages/:userId', async (req,res) => {
  const {userId} = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender:{$in:[userId,ourUserId]},
    recipient:{$in:[userId,ourUserId]},
  }).sort({createdAt: 1});
  res.json(messages);
});

app.get('/people', async (req,res) => {
  const users = await User.find({}, {'_id':1,username:1});
  res.json(users);
});

app.get('/profile', (req,res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/login', async (req,res) => {
  const {username, password} = req.body;
  const foundUser = await User.findOne({username});
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({userId:foundUser._id,username}, jwtSecret, {}, (err, token) => {
        res.cookie('token', token, {sameSite:'none', secure:true}).json({
          id: foundUser._id,
        });
      });
    }
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
});

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username:username,
      password:hashedPassword,
    });
    jwt.sign({userId:createdUser._id,username}, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
        id: createdUser._id,
      });
    });
  } catch(err) {
    if (err) throw err;
    res.status(500).json('error');
  }
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({server});
wss.on('connection', (connection, req) => {

  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }));
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const {userId, username} = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient, text, file} = messageData;
    let filename = null;
    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.'+ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = new Buffer(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:'+path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender:connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      console.log('created message');
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.userId,
          recipient,
          file: file ? filename : null,
          _id:messageDoc._id,
        })));
    }
  });

  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
});