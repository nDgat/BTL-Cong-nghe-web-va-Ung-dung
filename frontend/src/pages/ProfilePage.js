import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Descriptions, Tag, Divider } from 'antd';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const roleLabels = { admin: 'Quản trị viên', lecturer: 'Giảng viên', advisor: 'Cố vấn', student: 'Sinh viên' };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(values);
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      message.success('Cập nhật thành công');
      setEditMode(false);
    } catch (e) { message.error(e.response?.data?.error || 'Lỗi cập nhật'); }
    setLoading(false);
  };

  const handleChangePassword = async (values) => {
    try {
      await authAPI.changePassword(values);
      message.success('Đổi mật khẩu thành công');
      passwordForm.resetFields();
    } catch (e) { message.error(e.response?.data?.error || 'Lỗi đổi mật khẩu'); }
  };

  return (
    <div>
      <Card title={<Title level={4} style={{ margin: 0 }}>👤 Hồ sơ cá nhân</Title>}
        extra={!editMode && <Button type="primary" onClick={() => { setEditMode(true); form.setFieldsValue(user); }}>Chỉnh sửa</Button>}>
        {!editMode ? (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Họ tên">{user?.full_name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Username">{user?.username}</Descriptions.Item>
            <Descriptions.Item label="Vai trò"><Tag color="blue">{roleLabels[user?.role]}</Tag></Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{user?.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Mã SV/GV">{user?.student_code || user?.lecturer_code || '-'}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleUpdateProfile} style={{ maxWidth: 500 }}>
            <Form.Item name="full_name" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="phone" label="Điện thoại"><Input /></Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>Lưu</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setEditMode(false)}>Hủy</Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      <Card title="🔐 Đổi mật khẩu" style={{ marginTop: 24 }}>
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} style={{ maxWidth: 400 }}>
          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}><Input.Password /></Form.Item>
          <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true },
            ({ getFieldValue }) => ({ validator: (_, v) => !v || getFieldValue('newPassword') === v ? Promise.resolve() : Promise.reject('Mật khẩu không khớp') })
          ]}><Input.Password /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">Đổi mật khẩu</Button></Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
