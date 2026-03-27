import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Select, Space, Typography, Tabs } from 'antd';
import { reportAPI } from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const { Title } = Typography;

const ReportsPage = () => {
  const [passRate, setPassRate] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportAPI.passRate().then(r => setPassRate(r.data.data || [])),
      reportAPI.attendance().then(r => setAttendance(r.data.data || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const passRateColumns = [
    { title: 'Mã lớp', dataIndex: 'class_code', width: 180 },
    { title: 'Môn học', dataIndex: 'subject' },
    { title: 'Sĩ số', dataIndex: 'total_students', width: 80 },
    { title: 'Đã chấm', dataIndex: 'graded', width: 90 },
    { title: 'Đạt', dataIndex: 'passed', width: 70 },
    { title: 'Không đạt', dataIndex: 'failed', width: 100 },
    { title: 'Tỷ lệ đạt', dataIndex: 'pass_rate', width: 100, render: v => `${v}%` },
  ];

  const attendanceColumns = [
    { title: 'Mã lớp', dataIndex: 'class_code', width: 180 },
    { title: 'Môn học', dataIndex: 'subject' },
    { title: 'Buổi học', dataIndex: 'total_sessions', width: 90 },
    { title: 'SV', dataIndex: 'total_students', width: 60 },
    { title: 'Có mặt', dataIndex: 'present', width: 80 },
    { title: 'Vắng', dataIndex: 'absent', width: 70 },
    { title: 'Trễ', dataIndex: 'late', width: 60 },
    { title: '% Chuyên cần', dataIndex: 'attendance_rate', width: 120, render: v => `${v}%` },
    { title: 'SV cảnh báo', dataIndex: 'warned_students', width: 110 },
  ];

  const chartData = {
    labels: passRate.slice(0, 15).map(r => r.class_code),
    datasets: [{
      label: 'Tỷ lệ đạt (%)',
      data: passRate.slice(0, 15).map(r => parseFloat(r.pass_rate) || 0),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const items = [
    { key: '1', label: '📊 Tỷ lệ qua môn', children: (
      <div>
        <div style={{ height: 300, marginBottom: 24 }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Tỷ lệ đạt theo lớp' } } }} />
        </div>
        <Table columns={passRateColumns} dataSource={passRate} loading={loading} rowKey="class_id" scroll={{ x: 800 }} pagination={{ pageSize: 20 }} />
      </div>
    )},
    { key: '2', label: '✋ Chuyên cần', children: (
      <Table columns={attendanceColumns} dataSource={attendance} loading={loading} rowKey="class_id" scroll={{ x: 900 }} pagination={{ pageSize: 20 }} />
    )},
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>📈 Báo cáo & Thống kê</Title>}>
      <Tabs items={items} />
    </Card>
  );
};

export default ReportsPage;
