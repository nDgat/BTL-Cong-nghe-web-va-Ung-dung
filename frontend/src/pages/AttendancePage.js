import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Space, message, Tag, Button, Typography } from 'antd';
import { DownloadOutlined, WarningOutlined } from '@ant-design/icons';
import { attendanceAPI, classAPI, scheduleAPI, exportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('session'); // 'session' or 'summary'
  const { hasRole } = useAuth();

  useEffect(() => { classAPI.getAll({ limit: 100 }).then(r => setClasses(r.data.data)).catch(() => {}); }, []);

  const onClassChange = async (classId) => {
    setSelectedClass(classId);
    setSelectedSchedule(null);
    setData([]);
    try {
      const res = await scheduleAPI.getByClass(classId);
      setSchedules(res.data.data || []);
      const sumRes = await attendanceAPI.getClassSummary(classId);
      setSummary(sumRes.data.data || []);
    } catch (e) { }
  };

  const onScheduleChange = async (scheduleId) => {
    setSelectedSchedule(scheduleId);
    setLoading(true);
    try { const res = await attendanceAPI.getBySession(scheduleId); setData(res.data.data || []); } catch (e) { message.error('Lỗi tải điểm danh'); }
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    try { await attendanceAPI.update(id, { status }); message.success('Cập nhật thành công'); onScheduleChange(selectedSchedule); } catch (e) { message.error('Lỗi'); }
  };

  const handleExport = async () => {
    try {
      const res = await exportAPI.attendanceExcel(selectedClass);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url; link.download = `attendance_${selectedClass}.xlsx`; link.click();
    } catch (e) { message.error('Lỗi xuất file'); }
  };

  const handleCheckWarnings = async () => {
    try { const res = await attendanceAPI.checkWarnings(selectedClass); message.success(res.data.message); } catch (e) { message.error('Lỗi'); }
  };

  const statusColors = { present: 'green', absent: 'red', late: 'orange', excused: 'blue' };
  const statusLabels = { present: 'Có mặt', absent: 'Vắng', late: 'Trễ', excused: 'Có phép' };

  const sessionColumns = [
    { title: 'MSSV', dataIndex: ['student', 'student_code'], width: 120 },
    { title: 'Họ tên', dataIndex: ['student', 'full_name'] },
    { title: 'Trạng thái', dataIndex: 'status', width: 150, render: (s, r) => hasRole('admin', 'lecturer') ? (
      <Select value={s} onChange={(v) => handleStatusChange(r.id, v)} style={{ width: 120 }}
        options={Object.entries(statusLabels).map(([k, v]) => ({ value: k, label: v }))} />
    ) : <Tag color={statusColors[s]}>{statusLabels[s]}</Tag> },
    { title: 'Giờ vào', dataIndex: 'check_in_time', width: 120, render: t => t ? new Date(t).toLocaleTimeString('vi') : '-' },
  ];

  const summaryColumns = [
    { title: 'MSSV', dataIndex: 'student_code', width: 120 },
    { title: 'Họ tên', dataIndex: 'student_name' },
    { title: 'Có mặt', dataIndex: 'present', width: 80 },
    { title: 'Vắng', dataIndex: 'absent', width: 80, render: v => <span style={{ color: v > 0 ? 'red' : 'inherit' }}>{v}</span> },
    { title: 'Trễ', dataIndex: 'late', width: 80 },
    { title: 'Có phép', dataIndex: 'excused', width: 80 },
    { title: '% Vắng', dataIndex: 'absent_percent', width: 100, render: v => <span style={{ color: v > 20 ? 'red' : 'inherit', fontWeight: v > 20 ? 'bold' : 'normal' }}>{v}%</span> },
    { title: 'Cảnh báo', dataIndex: 'is_warned', width: 100, render: v => v ? <Tag color="red">⚠️ Cảnh báo</Tag> : null },
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>✋ Điểm danh</Title>}
      extra={<Space>
        <Select showSearch optionFilterProp="children" placeholder="Chọn lớp" style={{ width: 300 }} onChange={onClassChange}
          options={classes.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))} />
        <Select value={viewMode} onChange={setViewMode} style={{ width: 130 }}
          options={[{ value: 'session', label: 'Theo buổi' }, { value: 'summary', label: 'Tổng hợp' }]} />
        {selectedClass && <Button icon={<DownloadOutlined />} onClick={handleExport}>Xuất Excel</Button>}
        {selectedClass && hasRole('admin', 'lecturer', 'advisor') && <Button icon={<WarningOutlined />} onClick={handleCheckWarnings} type="dashed" danger>Kiểm tra cảnh báo</Button>}
      </Space>}>
      {viewMode === 'session' && (
        <>
          <Select placeholder="Chọn buổi học" style={{ width: 400, marginBottom: 16 }} onChange={onScheduleChange}
            options={schedules.map(s => ({ value: s.id, label: `Buổi ${s.session_number} - ${s.session_date} (${s.type})` }))} />
          <Table columns={sessionColumns} dataSource={data} loading={loading} rowKey="id" pagination={false} />
        </>
      )}
      {viewMode === 'summary' && <Table columns={summaryColumns} dataSource={summary} rowKey="student_id" pagination={false} />}
    </Card>
  );
};

export default AttendancePage;
