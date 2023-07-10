export const minQuota = 0;
export const maxQuota = 3;

export const incrementMotives = [
  { label: 'Subscriber canceled flight', value: 'subscriber_canceled' },
  { label: 'Airline canceled flight', value: 'airline_canceled' },
];
export const decrementMotives = [
  { label: 'Flight not redeposited after a flight cancellation', value: 'flight_not_redeposited' },
  { label: 'Subscriber had log in or password issues', value: 'login_issues' },
  { label: 'Subscriber had issues when booking', value: 'booking_issues' },
  { label: 'Subscription has not renewed correctly', value: 'subscription_issues' },
];