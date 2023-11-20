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
  
