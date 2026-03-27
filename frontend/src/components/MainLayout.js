import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography } from 'antd';
import {
  DashboardOutlined, BookOutlined, TeamOutlined, ScheduleOutlined,
  CheckSquareOutlined, FileTextOutlined, AlertOutlined, UserOutlined,
  BarChartOutlined, BellOutlined, LogoutOutlined, SettingOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationAPI.getAll({ limit: 1 }).then(res => {
      setUnreadCount(res.data.unreadCount || 0);
    }).catch(() => {});
  }, [location]);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/subjects', icon: <BookOutlined />, label: 'Môn học' },
    { key: '/classes', icon: <TeamOutlined />, label: 'Lớp học' },
    { key: '/schedules', icon: <ScheduleOutlined />, label: 'Lịch học' },
    { key: '/attendance', icon: <CheckSquareOutlined />, label: 'Điểm danh' },
    { key: '/grades', icon: <FileTextOutlined />, label: 'Điểm số' },
    { key: '/appeals', icon: <AlertOutlined />, label: 'Phúc khảo' },
    ...(hasRole('admin', 'lecturer', 'advisor') ? [{ key: '/reports', icon: <BarChartOutlined />, label: 'Báo cáo' }] : []),
    ...(hasRole('admin') ? [{ key: '/users', icon: <UserOutlined />, label: 'Người dùng' }] : []),
    { key: '/notifications', icon: <BellOutlined />, label: 'Thông báo' },
  ];

  const roleLabels = { admin: 'Quản trị viên', lecturer: 'Giảng viên', advisor: 'Cố vấn', student: 'Sinh viên' };

  const userMenu = {
    items: [
      { key: 'profile', icon: <SettingOutlined />, label: 'Hồ sơ cá nhân', onClick: () => navigate('/profile') },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: () => { logout(); navigate('/login'); } },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={240}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Text strong style={{ color: '#fff', fontSize: collapsed ? 14 : 16 }}>
            {collapsed ? 'QL' : '📚 Quản lý Đào tạo'}
          </Text>
        </div>
        <Menu
          theme="dark" mode="inline" selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)} items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <Space>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger', onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer' },
            })}
          </Space>
          <Space size="large">
            <Badge count={unreadCount} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => navigate('/notifications')} />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ lineHeight: '20px' }}>
                  <div style={{ fontWeight: 500 }}>{user?.full_name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{roleLabels[user?.role]}</div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#f0f2f5', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
