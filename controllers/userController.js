const userModel = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = (data) =>
  new Promise((resolve, reject) => {
    console.log("🟡 Data diterima di backend:", data);

    userModel.findOne({ username: data.username })
      .then((user) => {
        if (user) {
          return reject({
            sukses: false,
            msg: 'Username Telah Terdaftar',
          });
        }

        bcrypt.hash(data.password, 10, (err, hash) => {
          if (err) {
            return reject({
              sukses: false,
              msg: 'Gagal Enkripsi Password',
            });
          }

          data.password = hash;

          userModel.create(data)
            .then((createdUser) => {
              const { password, ...userWithoutPassword } = createdUser.toObject();
              resolve({
                sukses: true,
                msg: 'Berhasil Registrasi',
                data: userWithoutPassword,
              });
            })
            .catch(() => {
              reject({
                sukses: false,
                msg: 'Gagal Registrasi',
              });
            });
        });
      })
      .catch(() => {
        reject({
          sukses: false,
          msg: 'Terjadi kesalahan server saat cek username',
        });
      });
  });

exports.login = (data) =>
  new Promise((resolve, reject) => {
    userModel.findOne({ username: data.username })
      .then((user) => {
        if (!user) {
          return reject({
            sukses: false,
            msg: 'Username Tidak Terdaftar',
          });
        }

        const isPasswordValid = bcrypt.compareSync(data.password, user.password);

        if (!isPasswordValid) {
          return reject({
            sukses: false,
            msg: 'Password Anda Salah',
          });
        }

        const { password, ...userWithoutPassword } = user.toObject();
        resolve({
          sukses: true,
          msg: 'Berhasil Login',
          data: userWithoutPassword,
        });
      })
      .catch(() => {
        reject({
          sukses: false,
          msg: 'Terjadi kesalahan server saat login',
        });
      });
  });
