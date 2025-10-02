const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const { username, fullName } = req.query;
    let filter = { isDelete: false };

    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }
    if (fullName) {
      filter.fullName = { $regex: fullName, $options: 'i' };
    }

    const users = await User.find(filter)
      .populate('role', 'name description')
      .select('-password')
      .sort({ timestamp: -1 });

    res.status(200).json({
      status: 'success',
      message: 'Lấy danh sách users thành công',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy danh sách users',
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID không hợp lệ'
      });
    }

    const user = await User.findOne({ _id: id, isDelete: false })
      .populate('role', 'name description')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Lấy thông tin user thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy thông tin user',
      error: error.message
    });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username, isDelete: false })
      .populate('role', 'name description')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy user với username này'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Lấy thông tin user thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy thông tin user',
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Role ID không hợp lệ'
      });
    }

    const roleExists = await Role.findOne({ _id: role, isDelete: false });
    if (!roleExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Role không tồn tại'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullName: fullName || "",
      avatarUrl: avatarUrl || "",
      role
    });

    await newUser.save();

    const userResponse = await User.findById(newUser._id)
      .populate('role', 'name description')
      .select('-password');

    res.status(201).json({
      status: 'success',
      message: 'Tạo user thành công',
      data: userResponse
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field} đã tồn tại`
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi tạo user',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID không hợp lệ'
      });
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    if (updateData.role) {
      if (!mongoose.Types.ObjectId.isValid(updateData.role)) {
        return res.status(400).json({
          status: 'error',
          message: 'Role ID không hợp lệ'
        });
      }

      const roleExists = await Role.findOne({ _id: updateData.role, isDelete: false });
      if (!roleExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Role không tồn tại'
        });
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: id, isDelete: false },
      updateData,
      { new: true, runValidators: true }
    ).populate('role', 'name description').select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật user thành công',
      data: user
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field} đã tồn tại`
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi cập nhật user',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID không hợp lệ'
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, isDelete: false },
      { isDelete: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Xóa user thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi xóa user',
      error: error.message
    });
  }
};

const activateUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        status: 'error',
        message: 'Email và username là bắt buộc'
      });
    }

    const user = await User.findOneAndUpdate(
      { email, username, isDelete: false },
      { status: true },
      { new: true }
    ).populate('role', 'name description').select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy user với email và username này'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Kích hoạt user thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi kích hoạt user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  activateUser
};
