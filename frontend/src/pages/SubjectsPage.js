import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { subjectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const SubjectsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const { hasRole } = useAuth();

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await subjectAPI.getAll({ page, limit, search });
      setData(res.data.data);
      setPagination({ current: page, pageSize: limit, total: res.data.pagination?.totalItems || 0 });
    } catch (e) { message.error('Lỗi tải dữ liệu'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);

  const handleSave = async (values) => {
    try {
      if (editingItem) {
        await subjectAPI.update(editingItem.id, values);
        message.success('Cập nhật thành công');
      } else {
        await subjectAPI.create(values);
        message.success('Tạo mới thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
      fetchData(pagination.current);
    } catch (e) { message.error(e.response?.data?.error || 'Lỗi'); }
  };

  const handleDelete = async (id) => {
    try { await subjectAPI.delete(id); message.success('Xóa thành công'); fetchData(); } catch (e) { message.error('Lỗi xóa'); }
  };

  const columns = [
    { title: 'Mã', dataIndex: 'code', key: 'code', width: 100 },
    { title: 'Tên môn học', dataIndex: 'name', key: 'name' },
    { title: 'Số TC', dataIndex: 'credits', key: 'credits', width: 80 },
    { title: 'Khoa', dataIndex: 'department', key: 'department' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? 'Hoạt động' : 'Ngừng'}</Tag> },
    ...(hasRole('admin') ? [{
      title: 'Thao tác', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setModalVisible(true); }} />
          <Popconfirm title="Xóa môn học này?" onConfirm={() => handleDelete(record.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>📚 Quản lý Môn học</Title>}
      extra={<Space>
        <Input.Search placeholder="Tìm kiếm..." onSearch={setSearch} style={{ width: 250 }} allowClear />
        {hasRole('admin') && <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setModalVisible(true); }}>Thêm mới</Button>}
      </Space>}>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ ...pagination, onChange: (p, s) => fetchData(p, s), showSizeChanger: true, showTotal: (t) => `Tổng ${t} môn học` }} />
      <Modal title={editingItem ? 'Sửa môn học' : 'Thêm môn học'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} okText="Lưu">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="code" label="Mã môn học" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true }]}><InputNumber min={1} max={10} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="department" label="Khoa"><Input /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SubjectsPage;
