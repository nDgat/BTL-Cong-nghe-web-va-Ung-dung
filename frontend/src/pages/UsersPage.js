import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Typography, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { userAPI, exportAPI } from '../services/api';

const { Title } = Typography;

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [form] = Form.useForm();

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await userAPI.getAll({ page, limit, search, role: roleFilter || undefined });
      setData(res.data.data);
      setPagination({ current: page, pageSize: limit, total: res.data.pagination?.totalItems || 0 });
    } catch (e) { message.error('Lỗi tải dữ liệu'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search, roleFilter]);

  const handleSave = async (values) => {
    try {
      if (editingItem) { await userAPI.update(editingItem.id, values); message.success('Cập nhật thành công'); }
      else { await userAPI.create(values); message.success('Tạo mới thành công'); }
      setModalVisible(false); form.resetFields(); setEditingItem(null); fetchData(pagination.current);
    } catch (e) { message.error(e.response?.data?.error || 'Lỗi'); }
  };

  const handleImport = async (file) => {
    try { const res = await exportAPI.importStudents(file); message.success(res.data.message); fetchData(); }
    catch (e) { message.error('Lỗi import'); }
    return false;
  };

  const roleColors = { admin: 'red', lecturer: 'blue', advisor: 'purple', student: 'green' };
  const roleLabels = { admin: 'Admin', lecturer: 'Giảng viên', advisor: 'Cố vấn', student: 'Sinh viên' };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Username', dataIndex: 'username', width: 120 },
    { title: 'Họ tên', dataIndex: 'full_name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'MSSV/Mã GV', width: 120, render: (_, r) => r.student_code || r.lecturer_code || '-' },
    { title: 'Vai trò', dataIndex: 'role', width: 110, render: r => <Tag color={roleColors[r]}>{roleLabels[r]}</Tag> },
    { title: 'Trạng thái', dataIndex: 'is_active', width: 100, render: v => <Tag color={v ? 'green' : 'red'}>{v ? 'Active' : 'Inactive'}</Tag> },
    { title: 'Thao tác', width: 120, render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(r); form.setFieldsValue(r); setModalVisible(true); }} />
        <Popconfirm title="Xóa người dùng?" onConfirm={() => userAPI.delete(r.id).then(() => { message.success('Đã xóa'); fetchData(); })}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>👥 Quản lý Người dùng</Title>}
      extra={<Space>
        <Input.Search placeholder="Tìm kiếm..." onSearch={setSearch} style={{ width: 200 }} allowClear />
        <Select placeholder="Vai trò" style={{ width: 130 }} allowClear onChange={setRoleFilter}
          options={Object.entries(roleLabels).map(([k, v]) => ({ value: k, label: v }))} />
        <Upload beforeUpload={handleImport} showUploadList={false} accept=".xlsx,.xls">
          <Button icon={<UploadOutlined />}>Import Excel</Button>
        </Upload>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setModalVisible(true); }}>Thêm mới</Button>
      </Space>}>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ ...pagination, onChange: (p, s) => fetchData(p, s), showSizeChanger: true }} scroll={{ x: 900 }} />
      <Modal title={editingItem ? 'Sửa người dùng' : 'Thêm người dùng'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} okText="Lưu" width={500}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="username" label="Username" rules={[{ required: !editingItem }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          {!editingItem && <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}><Input.Password /></Form.Item>}
          <Form.Item name="full_name" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select options={Object.entries(roleLabels).map(([k, v]) => ({ value: k, label: v }))} />
          </Form.Item>
          <Form.Item name="phone" label="Điện thoại"><Input /></Form.Item>
          <Form.Item name="student_code" label="Mã sinh viên"><Input /></Form.Item>
          <Form.Item name="lecturer_code" label="Mã giảng viên"><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UsersPage;
