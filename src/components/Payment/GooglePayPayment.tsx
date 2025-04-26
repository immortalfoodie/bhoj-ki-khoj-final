import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface GooglePayPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error?: string) => void;
}

const GooglePayPayment: React.FC<GooglePayPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkGooglePay = async () => {
      try {
        if (!window.google?.payments?.api) {
          console.error('Google Pay API not available');
          setError('Google Pay is not available in your browser');
          onError?.('Google Pay is not available in your browser');
          return;
        }

        const paymentsClient = new google.payments.api.PaymentsClient({
          environment: import.meta.env.MODE === 'production' ? 'PRODUCTION' : 'TEST'
        });

        const isReadyToPay = await paymentsClient.isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA']
            }
          }]
        });

        setIsReady(isReadyToPay.result);
        
        if (!isReadyToPay.result) {
          setError('Google Pay is not available for your device');
          onError?.('Google Pay is not available for your device');
        }
      } catch (error) {
        console.error('Error checking Google Pay availability:', error);
        setError('Failed to initialize Google Pay');
        onError?.('Failed to initialize Google Pay');
      }
    };

    checkGooglePay();
  }, [onError]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!window.google?.payments?.api) {
        throw new Error('Google Pay API not available');
      }

      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: import.meta.env.MODE === 'production' ? 'PRODUCTION' : 'TEST'
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
              gateway: import.meta.env.VITE_GOOGLE_PAY_GATEWAY || 'example',
              gatewayMerchantId: import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID || 'exampleGatewayMerchantId'
            }
          }
        }],
        merchantInfo: {
          merchantId: import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID || '12345678901234567890',
          merchantName: 'Bhoj Basket'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount.toString(),
          currencyCode: 'INR',
          countryCode: 'IN'
        }
      };

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      
      if (!paymentData?.paymentMethodData?.tokenizationData?.token) {
        throw new Error('Invalid payment data received');
      }

      // Generate a random payment ID for demo purposes
      // In production, this would come from your payment gateway
      const paymentId = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      onSuccess(paymentId);
      
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully',
      });
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: "destructive"
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
                    src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                    alt="Google Pay" 
                    className="h-6 mr-2"
                  />
                  Pay ₹{amount}
                </>
              )}
            </button>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhoj-primary"></div>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <p className="text-sm text-gray-500">Test Mode</p>
        </div>
      </div>
    </div>
  );
};

export default GooglePayPayment; 