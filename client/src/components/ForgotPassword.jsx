import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tempToken, setTempToken] = useState('');
    const [loading, setLoading] = useState(false);
    const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

    useEffect(() => {
        let interval;
        if (timer > 0 && step === 2) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, step]);

    const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API}/api/auth/forgot-password`, { email });
            setSuccess('OTP sent successfully to your email.');
            setStep(2);
            setTimer(300);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow numbers
        
        if (value.length > 1) value = value.slice(0, 1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1].current.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].current.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter complete OTP');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${API}/api/auth/verify-otp`, {
                email,
                otp: otpString
            });
            setTempToken(response.data.tempToken);
            setSuccess('OTP verified successfully');
            setStep(3);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API}/api/auth/reset-password`, {
                tempToken,
                newPassword
            });
            setSuccess('Password reset successful!');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setLoading(true);
        try {
            await axios.post(`${API}/api/auth/forgot-password`, { email });
            setSuccess('OTP resent successfully');
            setTimer(300);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
                <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="forgot-password-form">
                    <h2>Forgot Password</h2>
                    <p style={{textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px'}}>
                        Enter your email address to receive a verification code
                    </p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <button type="submit" className="forgot-password-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="forgot-password-form">
                    <h2>Enter OTP</h2>
                    <p style={{textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px'}}>
                        Enter the 6-digit code sent to {email}
                    </p>
                    <div className="otp-input-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={otpRefs.current[index]}
                                type="text"
                                className="otp-input"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onFocus={(e) => e.target.select()}
                                maxLength={1}
                                required
                                disabled={loading}
                            />
                        ))}
                    </div>
                    <div className="timer">
                        Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </div>
                    <button
                        type="button"
                        className="resend-button"
                        onClick={handleResendOtp}
                        disabled={timer > 0 || loading}
                    >
                        {loading ? 'Resending...' : 'Resend OTP'}
                    </button>
                    <button type="submit" className="forgot-password-button" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
                    <h2>Reset Password</h2>
                    <p style={{textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px'}}>
                        Create your new password
                    </p>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                    />
                    <button type="submit" className="forgot-password-button" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default ForgotPassword;