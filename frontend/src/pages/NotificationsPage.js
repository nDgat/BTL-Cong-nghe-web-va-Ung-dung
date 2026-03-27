import React, { useState, useEffect } from 'react';
import { List, Card, Button, Space, message, Tag, Typography, Badge } from 'antd';
import { CheckOutlined, DeleteOutlined, BellOutlined } from '@ant-design/icons';
import { notificationAPI } from '../services/api';

const { Title, Text } = Typography;

const NotificationsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await notificationAPI.getAll({ limit: 50 }); setData(res.data.data || []); } catch (e) { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkRead = async (id) => {
    try { await notificationAPI.markAsRead(id); fetchData(); } catch (e) { }
  };

  const handleMarkAllRead = async () => {
    try { await notificationAPI.markAllAsRead(); message.success('Đã đánh dấu tất cả'); fetchData(); } catch (e) { }
  };

  const handleDelete = async (id) => {
    try { await notificationAPI.delete(id); message.success('Đã xóa'); fetchData(); } catch (e) { }
  };

  const typeColors = { warning: 'orange', grade: 'blue', info: 'cyan', success: 'green', error: 'red' };

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>🔔 Thông báo</Title>}
      extra={<Button icon={<CheckOutlined />} onClick={handleMarkAllRead}>Đánh dấu tất cả đã đọc</Button>}>
      <List loading={loading} dataSource={data} renderItem={item => (
        <List.Item style={{ background: item.is_read ? '#fff' : '#e6f7ff', padding: '12px 16px', marginBottom: 8, borderRadius: 8 }}
          actions={[
            !item.is_read && <Button size="small" type="link" onClick={() => handleMarkRead(item.id)}>Đã đọc</Button>,
            <Button size="small" type="link" danger onClick={() => handleDelete(item.id)} icon={<DeleteOutlined />} />,
          ].filter(Boolean)}>
          <List.Item.Meta
            avatar={<Badge dot={!item.is_read}><BellOutlined style={{ fontSize: 20 }} /></Badge>}
            title={<Space><Tag color={typeColors[item.type]}>{item.type}</Tag><Text strong={!item.is_read}>{item.title}</Text></Space>}
            description={<><Text>{item.message}</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>{new Date(item.created_at).toLocaleString('vi')}</Text></>}
          />
        </List.Item>
      )} />
    </Card>
  );
};

export default NotificationsPage;
