import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { classAPI, subjectAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const ClassesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const { hasRole } = useAuth();

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await classAPI.getAll({ page, limit, search });
      setData(res.data.data);
      setPagination({ current: page, pageSize: limit, total: res.data.pagination?.totalItems || 0 });
    } catch (e) { message.error('Lỗi tải dữ liệu'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);
  useEffect(() => {
    subjectAPI.getAll({ limit: 100 }).then(r => setSubjects(r.data.data)).catch(() => {});
    if (hasRole('admin')) userAPI.getAll({ role: 'lecturer', limit: 100 }).then(r => setLecturers(r.data.data)).catch(() => {});
  }, []);

  const handleSave = async (values) => {
    try {
      if (editingItem) { await classAPI.update(editingItem.id, values); message.success('Cập nhật thành công'); }
      else { await classAPI.create(values); message.success('Tạo mới thành công'); }
      setModalVisible(false); form.resetFields(); setEditingItem(null); fetchData(pagination.current);
    } catch (e) { message.error(e.response?.data?.error || 'Lỗi'); }
  };

  const columns = [
    { title: 'Mã lớp', dataIndex: 'code', width: 180 },
    { title: 'Tên lớp', dataIndex: 'name' },
    { title: 'Môn học', dataIndex: ['subject', 'name'] },
    { title: 'Giảng viên', dataIndex: ['lecturer', 'full_name'] },
    { title: 'Niên khóa', dataIndex: 'academic_year', width: 110 },
    { title: 'HK', dataIndex: 'semester', width: 50 },
    { title: 'Phòng', dataIndex: 'room', width: 80 },
    { title: 'Trạng thái', dataIndex: 'status', width: 110, render: (s) => <Tag color={s === 'active' ? 'green' : s === 'completed' ? 'blue' : 'red'}>{s}</Tag> },
    ...(hasRole('admin') ? [{ title: 'Thao tác', width: 120, render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(r); form.setFieldsValue({ ...r, subject_id: r.subject?.id, lecturer_id: r.lecturer?.id }); setModalVisible(true); }} />
        <Popconfirm title="Xóa?" onConfirm={() => classAPI.delete(r.id).then(() => { message.success('Đã xóa'); fetchData(); })}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
      </Space>
    )}] : []),
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>🏫 Quản lý Lớp học</Title>}
      extra={<Space>
        <Input.Search placeholder="Tìm kiếm..." onSearch={setSearch} style={{ width: 250 }} allowClear />
        {hasRole('admin') && <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setModalVisible(true); }}>Thêm mới</Button>}
      </Space>}>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ ...pagination, onChange: (p, s) => fetchData(p, s), showSizeChanger: true }} scroll={{ x: 1000 }} />
      <Modal title={editingItem ? 'Sửa lớp học' : 'Thêm lớp học'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} okText="Lưu" width={600}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="code" label="Mã lớp" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="name" label="Tên lớp" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="subject_id" label="Môn học" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children" options={subjects.map(s => ({ value: s.id, label: `${s.code} - ${s.name}` }))} />
          </Form.Item>
          <Form.Item name="lecturer_id" label="Giảng viên">
            <Select showSearch optionFilterProp="children" options={lecturers.map(l => ({ value: l.id, label: l.full_name }))} />
          </Form.Item>
          <Form.Item name="academic_year" label="Niên khóa"><Input placeholder="2024-2025" /></Form.Item>
          <Form.Item name="semester" label="Học kỳ"><Select options={[{ value: 1, label: 'HK1' }, { value: 2, label: 'HK2' }, { value: 3, label: 'HK hè' }]} /></Form.Item>
          <Form.Item name="room" label="Phòng"><Input /></Form.Item>
          <Form.Item name="max_students" label="Sĩ số tối đa"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ClassesPage;
