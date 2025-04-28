import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Add Google Pay API types
declare global {
  interface Window {
    google?: {
      payments?: {
        api: {
          PaymentsClient: new (options: { environment: string }) => {
            isReadyToPay: (request: any) => Promise<{ result: boolean }>;
            loadPaymentData: (request: any) => Promise<any>;
          };
        };
      };
    };
  }
}

interface GooglePayPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error?: string) => void;
}

const GooglePayPayment: React.FC<GooglePayPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiBlocked, setIsApiBlocked] = useState(false);
  const { toast } = useToast();

  // Check if browser is supported
  const isBrowserSupported = () => {
    const isChromium = window.chrome !== undefined;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isChromium || isSafari;
  };

  useEffect(() => {
    const loadGooglePayScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google?.payments?.api) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Google Pay script'));
        document.body.appendChild(script);
      });
    };

    const checkGooglePay = async () => {
      if (!isBrowserSupported()) {
        setIsApiBlocked(true);
        setError('Please use Chrome, Brave, or another supported browser');
        return;
      }

      try {
        await loadGooglePayScript();
        
        if (!window.google?.payments?.api) {
          console.error('Google Pay API not available');
          setIsApiBlocked(true);
          return;
        }

        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: 'TEST' // Keep this as TEST for everyone
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
          setIsApiBlocked(true);
        }
      } catch (error) {
        console.error('Error checking Google Pay availability:', error);
        setIsApiBlocked(true);
        setError('Failed to initialize Google Pay');
      }
    };

    checkGooglePay();
  }, []);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Always simulate payment in test mode
      const simulatePayment = () => {
        const paymentId = 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        onSuccess(paymentId);
        toast({
          title: 'Test Payment Successful',
          description: 'This is a test payment - no actual charges made',
        });
      };

      if (isApiBlocked) {
        setTimeout(simulatePayment, 2000);
        return;
      }

      if (!window.google?.payments?.api) {
        throw new Error('Google Pay API not available');
      }

      const paymentsClient = new window.google.payments.api.PaymentsClient({
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
          merchantId: 'BCR2DN4T7S4K3WNJ', // Test merchant ID that works for everyone
          merchantName: 'Bhoj Basket (Test Mode)'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount.toFixed(2),
          currencyCode: 'INR',
          countryCode: 'IN',
          displayItems: [{
            label: 'Test Order',
            type: 'SUBTOTAL',
            price: amount.toFixed(2),
          }],
          totalPriceLabel: 'Total (Test)'
        }
      };

      try {
        await paymentsClient.loadPaymentData(paymentDataRequest);
        simulatePayment();
      } catch (paymentError: any) {
        // If it's a cancellation, handle it gracefully
        if (paymentError.statusCode === 'CANCELED') {
          throw new Error('Payment cancelled');
        }
        // For other errors, still complete the test payment
        console.log('Payment API error, falling back to test mode:', paymentError);
        simulatePayment();
      }
      
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Payment </h2>
          <p className="text-gray-600">Complete your test payment using Google Pay</p>
         
        </div>
        <div className="flex flex-col items-center space-y-4">
          {isReady || isApiBlocked ? (
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
          <p className="text-sm text-gray-500 font-semibold">Demo Mode - No actual charges</p>
          <button 
            onClick={() => onError?.('Payment cancelled')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default GooglePayPayment;