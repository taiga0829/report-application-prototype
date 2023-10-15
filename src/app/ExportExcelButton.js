import React from 'react';
import Button from 'react-bootstrap/Button'; 
function ExportExcelButton() {
  const handleExportExcel = async () => {
    const response = await fetch('/api/exportExcel');
    console.log(response);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  return (
    <Button onClick={handleExportExcel}>Export to Excel</Button>
  );
}

export default ExportExcelButton;
