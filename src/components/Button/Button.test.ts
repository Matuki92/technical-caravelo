import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Button from './Button.vue';

const setup = (props = {}) => ({
  user: userEvent.setup(),
  ...render(Button, {
    props,
  }),
});

const getButtonElement = () => screen.getByRole('button');

describe('Button component default props', () => {
  test('"disabled" prop default value', () => {
    setup();

    const buttonElement = getButtonElement();

    expect(buttonElement.getAttribute('disabled')).toBe(false);
    expect(buttonElement.classList.contains('disabled')).toBe(false);
  });

  test('"style" prop default value', () => {
    setup();

    const buttonElement = getButtonElement();

    expect(buttonElement.classList.contains('default')).toBe(true);
  });

  test('"size" prop default value', () => {
    setup();

    const buttonElement = getButtonElement();

    expect(buttonElement.classList.contains('md')).toBe(true);
  });
});

describe('Button component - custom props', () => {
  test('Sets disabled status and class when "disabled" prop is provided', () => {
    setup({ disabled: true });

    const buttonElement = getButtonElement();

    expect(buttonElement.getAttribute('disabled')).toBe(true);
    expect(buttonElement.classList.contains('disabled')).toBe(true);
  });

  test('Sets style class when "style" prop is provided', () => {
    setup({ style: 'custom' });

    const buttonElement = screen.getByRole('button');

    expect(buttonElement.classList.contains('custom')).toBe(true);
  });

  test('Sets size class when "size" prop is provided', () => {
    setup({ size: 'sm' });

    const buttonElement = screen.getByRole('button');

    expect(buttonElement.classList.contains('sm')).toBe(true);
  });
});

describe('Button component - actions', () => {
  test('emits a click event when clicked', async () => {
    const {
      user,
      emitted,
    } = setup();

    const buttonElement = screen.getByRole('button');

    await user.click(buttonElement);

    expect('click' in emitted()).toBe(true);
  })
});