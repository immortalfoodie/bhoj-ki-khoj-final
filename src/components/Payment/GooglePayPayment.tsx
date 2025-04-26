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
    phone: string;
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
  // Now you can use userData and paymentMethod in your component
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkGooglePay = async () => {
      try {
        if (!(window as any).google?.payments?.api) {
          console.error('Google Pay API not available');
          setError('Google Pay is not available in your browser');
          onError?.('Google Pay is not available in your browser');
          return;
        }

        const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
          environment: 'TEST' // Always use TEST for development
        });

        const isReadyToPay = await paymentsClient.isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER', 'JCB']
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

      if (!(window as any).google?.payments?.api) {
        throw new Error('Google Pay API not available');
      }

      // For testing purposes, use a fixed merchant ID and gateway
      const testMerchantId = '12345678901234567890';
      const testGateway = 'example';

      const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
        environment: 'TEST' // Always use TEST for development
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER', 'JCB']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: testGateway,
              gatewayMerchantId: testMerchantId
            }
          }
        }],
        merchantInfo: {
          merchantId: testMerchantId,
          merchantName: 'Bhoj Basket Test Store'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount.toFixed(2),
          currencyCode: 'INR',
          countryCode: 'IN'
        },
        // Add callback intents for better error handling
        callbackIntents: ['PAYMENT_AUTHORIZATION']
      };

      // For demo purposes, simulate a successful payment without actually calling Google Pay
      // This avoids the OR_BIBED_11 error in development
      
      // Comment this out for production:
      setTimeout(() => {
        // Generate a random payment ID for demo purposes
        const paymentId = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        onSuccess(paymentId);
        
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully',
        });
        setIsProcessing(false);
      }, 2000);
      
      // Uncomment this for production:
      /*
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      
      if (!paymentData?.paymentMethodData?.tokenizationData?.token) {
        throw new Error('Invalid payment data received');
      }

      // In production, send the token to your server for processing
      const paymentId = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      onSuccess(paymentId);
      
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully',
      });
      */
      
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
          <p className="text-sm text-gray-500">Test Mode - No actual payment will be processed</p>
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