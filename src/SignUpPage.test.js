import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from './signUpPage';

describe('SignUpPage', () => {
  it('validates the password input', async () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'pass' } });

    await waitFor(() => {
      const uppercaseCondition = screen.getByText('Uppercase');
      const numberCondition = screen.getByText('Number');
      const specialCharCondition = screen.getByText('Special Char');
      const lengthCondition = screen.getByText('Length (8+)');

      expect(uppercaseCondition).toHaveClass('invalid');
      expect(numberCondition).toHaveClass('invalid');
      expect(specialCharCondition).toHaveClass('invalid');
      expect(lengthCondition).toHaveClass('invalid');
    });

    fireEvent.change(passwordInput, { target: { value: 'Password1!' } });

    await waitFor(() => {
      const uppercaseCondition = screen.getByText('Uppercase');
      const numberCondition = screen.getByText('Number');
      const specialCharCondition = screen.getByText('Special Char');
      const lengthCondition = screen.getByText('Length (8+)');

      expect(uppercaseCondition).toHaveClass('valid');
      expect(numberCondition).toHaveClass('valid');
      expect(specialCharCondition).toHaveClass('valid');
      expect(lengthCondition).toHaveClass('valid');
    });
  });
});