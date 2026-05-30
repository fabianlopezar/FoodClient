/** Validaciones de formularios reutilizables. */

export function validateEmail(email) {
  if (!email?.trim()) return "El correo es obligatorio";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return "Correo electrónico inválido";
  return null;
}

export function validatePassword(password, minLength = 6) {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < minLength) {
    return `Mínimo ${minLength} caracteres`;
  }
  return null;
}

export function validateRecipeForm(input) {
  const errors = {};
  if (!input.title?.trim()) errors.title = "You should enter a title";
  if (!input.summary?.trim()) errors.summary = "You should enter a summary";
  const score = Number(input.healthScore);
  if (
    input.healthScore !== "" &&
    (Number.isNaN(score) || score < 0 || score > 100)
  ) {
    errors.healthScore = "Enter a number between 0 and 100";
  }
  return errors;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateRegisterForm({ email, password, displayName }) {
  const errors = validateLoginForm({ email, password });
  if (!displayName?.trim()) errors.displayName = "El nombre es obligatorio";
  return errors;
}
