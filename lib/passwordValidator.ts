// Password strength checker and validator

export interface PasswordStrength {
    score: number; // 0-4 (0=weak, 4=very strong)
    label: string;
    color: string;
    suggestions: string[];
}

// Common weak passwords to check against
const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
    'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
    'qazwsx', 'michael', 'football', 'admin', 'welcome', 'login', 'password1'
];

export const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const suggestions: string[] = [];

    // Check length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length < 8) {
        suggestions.push('Use at least 8 characters');
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        suggestions.push('Add lowercase letters');
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        suggestions.push('Add uppercase letters');
    }

    // Check for numbers
    if (/\d/.test(password)) {
        score++;
    } else {
        suggestions.push('Add numbers');
    }

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score++;
    } else {
        suggestions.push('Add special characters (!@#$%^&*)');
    }

    // Check against common passwords
    if (commonPasswords.includes(password.toLowerCase())) {
        score = 0;
        suggestions.unshift('This is a commonly used password');
    }

    // Check for sequential characters
    if (/(.)\1{2,}/.test(password)) {
        score = Math.max(0, score - 1);
        suggestions.push('Avoid repeating characters');
    }

    // Normalize score to 0-4
    score = Math.min(4, Math.max(0, Math.floor(score / 1.5)));

    // Determine label and color
    let label = '';
    let color = '';

    switch (score) {
        case 0:
        case 1:
            label = 'Weak';
            color = 'text-red-500';
            break;
        case 2:
            label = 'Fair';
            color = 'text-orange-500';
            break;
        case 3:
            label = 'Good';
            color = 'text-yellow-500';
            break;
        case 4:
            label = 'Strong';
            color = 'text-green-500';
            break;
    }

    return { score, label, color, suggestions };
};

export const isPasswordWeak = (password: string): boolean => {
    const strength = checkPasswordStrength(password);
    return strength.score < 2;
};

export const isCommonPassword = (password: string): boolean => {
    return commonPasswords.includes(password.toLowerCase());
};
