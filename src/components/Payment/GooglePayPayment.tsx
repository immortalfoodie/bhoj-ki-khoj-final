import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface GooglePayPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error?: string) => void;
  userData?: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod?: string;
}

const GooglePayPayment: React.FC<GooglePayPaymentProps> = ({ 
  amount, 
  onSuccess, 
  onError,
  userData,
  paymentMethod
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkGooglePay = async () => {
      try {
        if (!window.google?.payments?.api) {
          console.error('Google Pay API not available');
          onError?.('Google Pay is not available in your browser');
          return;
        }

        const paymentsClient = new google.payments.api.PaymentsClient({
          environment: 'TEST'
        });

        const isReadyToPay = await paymentsClient.isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId'
              }
            }
          }]
        });

        setIsReady(isReadyToPay.result);
        if (!isReadyToPay.result) {
          console.log('Google Pay is not ready:', isReadyToPay);
          onError?.('Google Pay is not available for your device');
        }
      } catch (error) {
        console.error('Error checking Google Pay availability:', error);
        onError?.('Failed to initialize Google Pay');
      }
    };

    checkGooglePay();
  }, [onError]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Validate user state
      if (!user || !profile) {
        throw new Error('User authentication required');
      }

      if (!window.google?.payments?.api) {
        throw new Error('Google Pay API not available');
      }

      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST'
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId'
            }
          }
        }],
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'Bhoj Basket'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount.toString(),
          currencyCode: 'INR',
          countryCode: 'IN'
        },
        callbackIntents: ['PAYMENT_AUTHORIZATION']
      };

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      
      // Validate payment data
      if (!paymentData?.paymentMethodData?.tokenizationData?.token) {
        throw new Error('Invalid payment data received');
      }

      // Process payment with backend
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          paymentMethodData: paymentData.paymentMethodData,
          amount,
          userId: user.id,
          userEmail: profile.email
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment processing failed');
      }

      const result = await response.json();
      onSuccess?.(result.paymentId);
      
      toast({
        title: 'Payment Successful',
        description: 'Your order has been placed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
      
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Google Pay</h2>
          <p className="text-gray-600">Complete your payment using Google Pay</p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          {isReady ? (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex items-center justify-center w-full max-w-xs px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" 
                    alt="Google Pay" 
                    className="h-6 mr-2"
                  />
                  ₹{amount}
                </>
              )}
            </button>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhoj-primary"></div>
          )}
          <p className="text-sm text-gray-500">Demo Mode</p>
        </div>
      </div>
    </div>
  );
};

export default GooglePayPayment; 