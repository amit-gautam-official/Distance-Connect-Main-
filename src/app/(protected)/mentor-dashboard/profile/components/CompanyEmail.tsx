'use client';

import { useState, useEffect } from 'react';
import { verifyCompanyEmail } from '../actions/verifyEmail';
import { validateOtp } from '../actions/validateOtp';
import { api } from '@/trpc/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Mail, Loader2 } from "lucide-react";

export default function CompanyEmail({ 
  company, 
  companyEmail, 
  companyEmailVerified = false 
}: { 
  company: string, 
  companyEmail: string, 
  companyEmailVerified: boolean 
}) {
  const [email, setEmail] = useState(companyEmail || '');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'done' | 'verified'>('form');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Set the initial state based on companyEmailVerified and companyEmail
  useEffect(() => {
    if (companyEmailVerified && companyEmail) {
      setStep('verified');
    } else {
      setStep('form');
    }
  }, [companyEmailVerified, companyEmail]);

  const updateMentorCompanyEmailMutation = api.mentor.updateMentorCompanyEmail.useMutation({
    onSuccess: () => {
      // Success is handled in the handleOtp function
    },
    onError: (error) => {
      setError("Failed to update company email. Please try again.");
    },
  });

  const startChangeEmail = () => {
    setEmail('');
    setStep('form');
  };

  const handleVerify = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      await verifyCompanyEmail(company, email);
      setError('');
      setStep('otp');
      handleResendCooldown();
    } catch (err: any) {
      setError('Company email domain does not match the company name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCooldown = () => {
    setResendDisabled(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await verifyCompanyEmail(company, email);
      setError('');
      handleResendCooldown();
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP sent to your email.');
      return;
    }

    try {
      setIsLoading(true);
      const data = await validateOtp(email, otp);
      // console.log('OTP validation response:', data);
      if(!data.verified) {
        throw new Error('Invalid OTP. Please try again.');
      }
      await updateMentorCompanyEmailMutation.mutateAsync({
        companyEmail: email,
      });
      setError('');
      setStep('done');
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'verified':
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Verified Company Email
              </CardTitle>
              <CardDescription>
                Your company email has been verified for {company}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center md:flex-row flex-col justify-between bg-slate-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{companyEmail}</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type='button'
                variant="outline" 
                onClick={startChangeEmail} 
                className="w-full"
              >
                Change Email
              </Button>
            </CardFooter>
          </>
        );

      case 'form':
        return (
          <>
            <CardHeader>
              <CardTitle>Verify Your Company Email</CardTitle>
              <CardDescription>
                {companyEmail ? 'Change your company email address' : `Verify your affiliation with ${company}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Company Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleVerify)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
              type='button'
                onClick={handleVerify}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : 'Send Verification Code'}
              </Button>
              
              {companyEmailVerified && (
                <Button 
                type='button'
                  variant="ghost" 
                  onClick={() => setStep('verified')} 
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </>
        );

      case 'otp':
        return (
          <>
            <CardHeader>
              <CardTitle>Enter Verification Code</CardTitle>
              <CardDescription>
                We&apos;ve sent a verification code to <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                onKeyPress={(e) => handleKeyPress(e, handleOtp)}
                disabled={isLoading}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
              type='button' 
                onClick={handleOtp}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : 'Verify Code'}
              </Button>
              
              <div className="flex justify-between w-full text-sm pt-2">
                <Button
                type='button'
                  variant="link"
                  onClick={() => setStep('form')}
                  disabled={isLoading || resendDisabled}
                  className="h-auto p-0"
                >
                  Use a different email
                </Button>
                
                <Button
                type='button'
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={resendDisabled || isLoading}
                  className="h-auto p-0"
                >
                  {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                </Button>
              </div>
            </CardFooter>
          </>
        );

      case 'done':
        return (
          <>
            <CardHeader>
              <div className="flex justify-center mb-2">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Email Successfully Verified</CardTitle>
              <CardDescription className="text-center">
                Your company email has been successfully verified and your account has been updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center bg-slate-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{email}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
              type='button'
                variant="outline" 
                onClick={() => setStep('verified')} 
                className="w-full"
              >
                Done
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      {renderContent()}
      
      {error && (
        <div className="px-6 pb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}