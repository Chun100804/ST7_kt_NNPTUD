const mongoose = require('mongoose');
const Role = require('../models/Role');

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDelete: false })
      .sort({ timestamp: -1 });

    res.status(200).json({
      status: 'success',
      message: 'Lấy danh sách roles thành công',
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy danh sách roles',
      error: error.message
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID không hợp lệ'
      });
    }

    const role = await Role.findOne({ _id: id, isDelete: false });

    if (!role) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy role'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Lấy thông tin role thành công',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy thông tin role',
      error: error.message
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newRole = new Role({
      name,
      description: description || ""
    });

    await newRole.save();

    res.status(201).json({
      status: 'success',
      message: 'Tạo role thành công',
      data: newRole
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Tên role đã tồn tại'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi tạo role',
      error: error.message
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID không hợp lệ'
      });
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, isDelete: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy role'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật role thành công',
      data: role
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Tên role đã tồn tại'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi cập nhật role',
      error: error.message
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID không hợp lệ'
      });
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, isDelete: false },
      { isDelete: true },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy role'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Xóa role thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi xóa role',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
