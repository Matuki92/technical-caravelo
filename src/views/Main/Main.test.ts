
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Main from './Main.vue';
import useSubscriberState from '@/state/useSubscriberState';

const mockGetSubscribers = vi.fn();
const mockSetSubscriberQuota = vi.fn();

vi.mock('@/state/useSubscriberState', async () => {
  const { default: actual } = await vi.importActual('@/state/useSubscriberState') as { default: typeof useSubscriberState };
  
  return {
    default: () => ({
      ...actual(),
      getSubscribers: mockGetSubscribers,
      setSubscriberQuota: mockSetSubscriberQuota,
    }),
  };
});

const setup = (props = {}) => ({
  user: userEvent.setup(),
  ...render(Main, {
    props,
  }),
});

describe('Main component', () => {
  test('Gets subscriber list on mount', () => {
    setup();
    expect(mockGetSubscribers).toHaveBeenCalled();
  });
});