import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, Space, message, Tag, Typography, Select } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { appealAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

const AppealsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [createModal, setCreateModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [createForm] = Form.useForm();
  const [reviewForm] = Form.useForm();
  const { hasRole } = useAuth();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await appealAPI.getAll({ page, limit: 10 });
      setData(res.data.data);
      setPagination(p => ({ ...p, current: page, total: res.data.pagination?.totalItems || 0 }));
    } catch (e) { message.error('Lỗi tải dữ liệu'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (values) => {
    try { await appealAPI.create(values); message.success('Gửi đơn phúc khảo thành công'); setCreateModal(false); createForm.resetFields(); fetchData(); }
    catch (e) { message.error(e.response?.data?.error || 'Lỗi'); }
  };

  const handleReview = async (values) => {
    try { await appealAPI.review(selectedAppeal.id, values); message.success('Xử lý thành công'); setReviewModal(false); reviewForm.resetFields(); fetchData(); }
    catch (e) { message.error(e.response?.data?.error || 'Lỗi'); }
  };

  const statusColors = { pending: 'orange', reviewing: 'blue', approved: 'green', rejected: 'red' };
  const statusLabels = { pending: 'Chờ xử lý', reviewing: 'Đang xem', approved: 'Chấp nhận', rejected: 'Từ chối' };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Sinh viên', dataIndex: ['student', 'full_name'] },
    { title: 'MSSV', dataIndex: ['student', 'student_code'], width: 120 },
    { title: 'Điểm hiện tại', dataIndex: 'current_score', width: 120 },
    { title: 'Điểm yêu cầu', dataIndex: 'requested_score', width: 120 },
    { title: 'Lý do', dataIndex: 'reason', ellipsis: true },
    { title: 'Trạng thái', dataIndex: 'status', width: 120, render: s => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'created_at', width: 120, render: d => new Date(d).toLocaleDateString('vi') },
    ...(hasRole('admin', 'lecturer') ? [{
      title: 'Thao tác', width: 100, render: (_, r) => r.status === 'pending' || r.status === 'reviewing' ? (
        <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => { setSelectedAppeal(r); reviewForm.resetFields(); setReviewModal(true); }}>Duyệt</Button>
      ) : null
    }] : []),
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>📋 Phúc khảo</Title>}
      extra={hasRole('student') && <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModal(true)}>Gửi đơn phúc khảo</Button>}>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ ...pagination, onChange: fetchData }} scroll={{ x: 900 }} />
      
      <Modal title="Gửi đơn phúc khảo" open={createModal} onCancel={() => setCreateModal(false)} onOk={() => createForm.submit()} okText="Gửi">
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="grade_id" label="ID Điểm" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="reason" label="Lý do phúc khảo" rules={[{ required: true }]}><TextArea rows={4} /></Form.Item>
          <Form.Item name="requested_score" label="Điểm yêu cầu"><InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Xử lý phúc khảo" open={reviewModal} onCancel={() => setReviewModal(false)} onOk={() => reviewForm.submit()} okText="Xác nhận">
        <Form form={reviewForm} layout="vertical" onFinish={handleReview}>
          <Form.Item name="status" label="Quyết định" rules={[{ required: true }]}>
            <Select options={[{ value: 'approved', label: 'Chấp nhận' }, { value: 'rejected', label: 'Từ chối' }]} />
          </Form.Item>
          <Form.Item name="final_score" label="Điểm cuối cùng"><InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="reviewer_comment" label="Nhận xét"><TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AppealsPage;
