import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import { TeamOutlined, BookOutlined, ScheduleOutlined, FileTextOutlined, CheckSquareOutlined, TrophyOutlined } from '@ant-design/icons';
import { reportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    if (hasRole('admin', 'lecturer', 'advisor')) {
      reportAPI.dashboard().then(res => setStats(res.data.data)).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={3}>👋 Xin chào, {user?.full_name}!</Title>
      {stats && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng sinh viên" value={stats.total_students} prefix={<TeamOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
          <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng giảng viên" value={stats.total_lecturers} prefix={<TeamOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
          <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng môn học" value={stats.total_subjects} prefix={<BookOutlined />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
          <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng lớp học" value={stats.total_classes} prefix={<ScheduleOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
          <Col xs={24} sm={12} lg={8}><Card><Statistic title="Lớp đang hoạt động" value={stats.active_classes} prefix={<CheckSquareOutlined />} valueStyle={{ color: '#13c2c2' }} /></Card></Col>
          <Col xs={24} sm={12} lg={8}><Card><Statistic title="Tổng đăng ký" value={stats.total_enrollments} prefix={<FileTextOutlined />} valueStyle={{ color: '#eb2f96' }} /></Card></Col>
        </Row>
      )}
      {hasRole('student') && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}><Card><Title level={4}>🎓 Bảng điều khiển Sinh viên</Title><p>Sử dụng menu bên trái để xem lớp học, lịch học, điểm số và phúc khảo.</p></Card></Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardPage;
