import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Select, Space, message, Tag, Typography } from 'antd';
import { scheduleAPI, classAPI } from '../services/api';

const { Title } = Typography;

const SchedulesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => { classAPI.getAll({ limit: 100 }).then(r => setClasses(r.data.data)).catch(() => {}); }, []);

  const fetchSchedules = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try { const res = await scheduleAPI.getByClass(classId); setData(res.data.data || []); } catch (e) { message.error('Lỗi tải lịch học'); }
    setLoading(false);
  };

  const dayLabels = { 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7', 0: 'CN' };
  const columns = [
    { title: 'Buổi', dataIndex: 'session_number', width: 70 },
    { title: 'Ngày', dataIndex: 'session_date', width: 120 },
    { title: 'Thứ', dataIndex: 'day_of_week', width: 80, render: d => dayLabels[d] || d },
    { title: 'Bắt đầu', dataIndex: 'start_time', width: 90 },
    { title: 'Kết thúc', dataIndex: 'end_time', width: 90 },
    { title: 'Phòng', dataIndex: 'room', width: 90 },
    { title: 'Loại', dataIndex: 'type', width: 100, render: t => <Tag color={t === 'exam' ? 'red' : t === 'lab' ? 'blue' : 'green'}>{t === 'exam' ? 'Thi' : t === 'lab' ? 'Thực hành' : 'Lý thuyết'}</Tag> },
    { title: 'Trạng thái', dataIndex: 'is_cancelled', width: 100, render: c => c ? <Tag color="red">Đã hủy</Tag> : <Tag color="green">Bình thường</Tag> },
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>📅 Lịch học</Title>}
      extra={<Select showSearch optionFilterProp="children" placeholder="Chọn lớp học" style={{ width: 350 }}
        onChange={(v) => { setSelectedClass(v); fetchSchedules(v); }}
        options={classes.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))} />}>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={false} />
    </Card>
  );
};

export default SchedulesPage;
