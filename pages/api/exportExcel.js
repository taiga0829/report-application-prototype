import { Workbook, Worksheet } from 'exceljs'; // Import required classes from the 'exceljs' library.
import { NextApiRequest, NextApiResponse } from 'next'; // Import the required types for Next.js API route.

export default async (req, res) => {

      // Parse the JSON data sent from the Python script
      const requestData = req.body;
      // Create a new Excel workbook
      const workbook = new Workbook();
      

      // Add a worksheet to the workbook
      const worksheet = workbook.addWorksheet('Sample Sheet');

      // Define columns for the worksheet
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 20 },
        { header: 'WorkingHours', key: 'workinghours', width: 30 },
      ];

      // Create a new Date object to get the current date and time
      const now = new Date();

      // Calculate the time offset for Central European Time (CET) or Central European Summer Time (CEST)
      // based on whether daylight saving time (DST) is in effect
      const isDaylightSavingTime = () => {
        const thisYear = now.getFullYear();
        // Determine the start and end dates of daylight saving time for the European time zone
        const dstStart = new Date(thisYear, 2, 31 - new Date(thisYear, 2, 31).getDay(), 2, 0, 0, 0); // Last Sunday in March
        const dstEnd = new Date(thisYear, 9, 31 - new Date(thisYear, 9, 31).getDay(), 3, 0, 0, 0); // Last Sunday in October
        return now >= dstStart && now < dstEnd;
      };

      // Calculate the time offset (in minutes) for CET or CEST
      const timeOffset = isDaylightSavingTime() ? 120 : 60;

      // Apply the time offset to get the current European time
      now.setMinutes(now.getMinutes() + timeOffset);

      // Define dynamic data with the current date, formatted as 'MM/DD'
      const data = [
        { date: formatDate(now), workinghours: '8' },
        // Add more data as needed
      ];

      // Add the data rows to the worksheet
      worksheet.addRows(data);

      // Generate an Excel buffer from the workbook
      const excelBuffer = await workbook.xlsx.writeBuffer();

      // Set response headers to indicate the Excel file format and attachment
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

      // Send the Excel buffer as a response, triggering the download
      res.end(excelBuffer);
    }

    // Function to format the date as 'MM/DD'
    function formatDate(date) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}`;
    } 

