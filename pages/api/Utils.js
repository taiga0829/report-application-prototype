export function getLogSheetName() {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = currentDateTime.getDate();
    return `log_${year}/${month}/${day}`;
  }

  export function getSummarySheetName(){
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = currentDateTime.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = currentDateTime.getDate();
    return `summary_${year}/${month}`;
  }

  function getDaysInCurrentMonth() {
    // Get the current date
    const today = new Date();

    // Get the number of days in the current month
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    return daysInMonth;
}

function createUpdateCellsRequest(sheetId, rowIndex, columnIndex, formulaValue) {
  return {
      updateCells: {
          fields: '*',
          start: {
              sheetId: sheetId,
              rowIndex: rowIndex,
              columnIndex: columnIndex,
          },
          rows: [
              {
                  values: [
                      {
                          userEnteredValue: {
                              formulaValue: formulaValue,
                          },
                      },
                  ],
              },
          ],
      },
  };
}
  
