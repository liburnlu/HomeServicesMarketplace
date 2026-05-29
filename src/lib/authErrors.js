const AUTH_ERROR_MESSAGES = {
    email_address_invalid:
        "That email address was rejected. Use a real inbox (e.g. yourname@gmail.com), not test@… or very short Gmail addresses like ab@gmail.com.",
    over_email_send_rate_limit:
        "Too many signup attempts. Wait a few minutes and try again.",
    user_already_exists:
        "An account with this email already exists. Try signing in instead.",
    invalid_credentials:
        "Incorrect email or password. If you just registered, confirm your email first.",
    email_not_confirmed:
        "Please confirm your email before signing in (check your inbox).",
};

export function normalizeEmail(email) {
    return String(email ?? "")
        .trim()
        .toLowerCase();
}

export function formatAuthError(error) {
    if (!error) return "Something went wrong. Please try again.";

    const code = error.code ?? error.error_code;
    if (code && AUTH_ERROR_MESSAGES[code]) {
        return AUTH_ERROR_MESSAGES[code];
    }

    return error.message ?? "Something went wrong. Please try again.";
}
