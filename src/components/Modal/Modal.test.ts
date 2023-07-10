import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Modal from './Modal.vue';

const setup = (props = {}) => ({
  user: userEvent.setup(),
  ...render(Modal, {
    props,
    slots: {
      title: {
        template: `
          <div data-testid="title-slot-content" />
        `
      },
      default: {
        template: `
          <div data-testid="default-slot-content" />
        `
      }
    },
  }),
});


describe('Modal component', () => {
  const getModalElement = () => screen.queryByRole('Modal');

  test('Does not display window when flag is falsy', () => {
    setup({ modelValue: false });

    expect(getModalElement()).toBeNull();
  });

  test('Closes modal on "close" button pressed', async () => {
    const { user } = setup({ modelValue: true });

    const closeButton = screen.getByRole('button', { name: '✕' });

    await user.click(closeButton);

    expect(getModalElement()).toBeNull();
  });

  test('Closes modal on click outside area', async () => {
    const { user } = setup({ modelValue: true });

    const closeButton = screen.getByRole('region', { name: 'modal-background' });

    await user.click(closeButton);

    expect(getModalElement()).toBeNull();
  });

  test('renders template inside "title" slot', () => {
    setup({ modelValue: true });

    const closeButton = screen.queryByTestId('title-slot-content');

    expect(closeButton).not.toBeNull();
  });

  test('renders template inside default slot', () => {
    setup({ modelValue: true });

    const closeButton = screen.queryByTestId('default-slot-content');

    expect(closeButton).not.toBeNull();
  });
});
