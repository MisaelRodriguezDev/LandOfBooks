function formattedDate(dateString: string) {
  if (!dateString) {
    return "Sin fecha"
  }
  if (dateString.length === 4) {
    return dateString
  }
  const date = new Date(dateString);

  const showTime = dateString.includes("T");

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  }).format(date);
}

export default formattedDate;