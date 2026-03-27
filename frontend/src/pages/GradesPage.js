import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Space, message, Button, Tag, Typography } from 'antd';
import { DownloadOutlined, CalculatorOutlined, FilePdfOutlined } from '@ant-design/icons';
import { gradeAPI, classAPI, exportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const GradesPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    classAPI.getAll({ limit: 100 }).then(r => setClasses(r.data.data)).catch(() => {});
    if (hasRole('student')) {
      gradeAPI.getTranscript().then(r => setTranscript(r.data.data || [])).catch(() => {});
    }
  }, []);

  const handleCalculate = async () => {
    if (!selectedClass) return;
    try { const res = await gradeAPI.calculateFinal(selectedClass); message.success(res.data.message); } catch (e) { message.error('Lỗi tính điểm'); }
  };

  const handleExportExcel = async () => {
    try {
      const res = await exportAPI.gradesExcel(selectedClass);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url; link.download = `grades_${selectedClass}.xlsx`; link.click();
    } catch (e) { message.error('Lỗi xuất Excel'); }
  };

  const handleExportPDF = async () => {
    try {
      const res = await exportAPI.transcriptPDF(user?.id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url; link.download = `transcript_${user?.student_code}.pdf`; link.click();
    } catch (e) { message.error('Lỗi xuất PDF'); }
  };

  const gradeColors = { 'A+': 'green', 'A': 'green', 'B+': 'blue', 'B': 'blue', 'C+': 'cyan', 'C': 'cyan', 'D+': 'orange', 'D': 'orange', 'F': 'red' };

  const transcriptColumns = [
    { title: 'Mã lớp', dataIndex: 'class_code', width: 150 },
    { title: 'Môn học', dataIndex: 'subject_name' },
    { title: 'Số TC', dataIndex: 'credits', width: 70 },
    { title: 'Điểm TK', dataIndex: 'final_grade', width: 90, render: v => v !== null ? v?.toFixed(1) : '-' },
    { title: 'Xếp loại', dataIndex: 'letter_grade', width: 90, render: v => v ? <Tag color={gradeColors[v] || 'default'}>{v}</Tag> : '-' },
    { title: 'Trạng thái', dataIndex: 'status', width: 120, render: s => <Tag color={s === 'completed' ? 'green' : s === 'failed' ? 'red' : 'blue'}>{s === 'completed' ? 'Đạt' : s === 'failed' ? 'Không đạt' : 'Đang học'}</Tag> },
  ];

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>📊 Điểm số</Title>}
      extra={<Space>
        {hasRole('admin', 'lecturer') && <>
          <Select showSearch optionFilterProp="children" placeholder="Chọn lớp" style={{ width: 300 }} onChange={setSelectedClass}
            options={classes.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))} />
          <Button icon={<CalculatorOutlined />} onClick={handleCalculate} type="primary">Tính điểm TK</Button>
          {selectedClass && <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>Xuất Excel</Button>}
        </>}
        {hasRole('student') && <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>Xuất bảng điểm PDF</Button>}
      </Space>}>
      {hasRole('student') && <Table columns={transcriptColumns} dataSource={transcript} loading={loading} rowKey="class_code" pagination={false} />}
      {hasRole('admin', 'lecturer') && !selectedClass && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Vui lòng chọn lớp học để xem điểm</div>}
    </Card>
  );
};

export default GradesPage;
