const bcrypt = require('bcrypt');

const users = [
  {
    _id: '60e28430bfcb96376c9ce2f0',
    name: 'Sulthon Abdul Malik',
    email: 'samara98@mailsac.com',
    username: 'samara98',
    password: bcrypt.hashSync('asdf1234', bcrypt.genSaltSync(12)),
    admin: true,
    avatar: 'img/avatar/default.webp',
    birthdate: '1998-12-29',
    sex_type: 'Male',
  },
];

module.exports = users;
