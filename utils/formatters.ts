export function formatRupee(price: string) {
  return new Intl.NumberFormat('hi-IN').format(Number(price));
}

export function capitalize(str: string) {
  if (str === '') return str;

  return str
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function removeCountryCode(phoneNumber: string) {
  if (phoneNumber.length === 10) {
    return phoneNumber;
  }
  return phoneNumber.slice(2);
}

export function getErrorTitle(error: any) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return 'Oops, something went wrong';
}
