import { ref, Ref } from 'vue';
import { Subscriber } from '@/declarations/types';
import { apiUrl } from '@/config/api';

const subscribers: Ref<Subscriber[]> = ref([]);

const loadingSubscribers: Ref<boolean> = ref(false);
const loadingSetSubscriberQuota: Ref<boolean> = ref(false);

async function getSubscribers() {
  loadingSubscribers.value = true;

  await fetch(`${apiUrl}/200?sleep=1000`);

  subscribers.value = [
    { id: '71332', name: 'Subscriber 1', quota: 3 },
    { id: '71333', name: 'Subscriber 2', quota: 0 },
    { id: '71334', name: 'Subscriber 3', quota: 2 },
  ];

  loadingSubscribers.value = false;
}

async function setSubscriberQuota(
  id: string,
  data: { quota: number, motive: string }
) {
  loadingSetSubscriberQuota.value = true;

  const response = await fetch(`${apiUrl}/random/201,504?sleep=500`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  /*
     Save local changes only when a successful response is received
     by replacing the updated field in the original item's list.
  */
  if (response.ok) {
    subscribers.value = subscribers.value.map((subscriber) => {
      const updatedSubscriber = {
        ...subscriber,
      };
  
      if (subscriber.id === id) {
        updatedSubscriber.quota = data.quota;
      }
  
      return updatedSubscriber;
    });

    loadingSetSubscriberQuota.value = false;
    return;
  }
  loadingSetSubscriberQuota.value = false;
  
  throw new Error();
}

export default function useSubscriberState() {
  return {
    getSubscribers,
    loadingSubscribers,
    subscribers,
    setSubscriberQuota,
    loadingSetSubscriberQuota,
  };
};