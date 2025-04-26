import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GooglePayPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: () => void;
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
  const { toast } = useToast();
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGooglePay = async () => {
      try {
        // Wait for Google Pay API to load with a timeout
        await new Promise((resolve, reject) => {
          if ((window as any).google?.payments?.api?.PaymentsClient) {
            resolve(true);
          } else {
            const checkGooglePay = setInterval(() => {
              if ((window as any).google?.payments?.api?.PaymentsClient) {
                clearInterval(checkGooglePay);
                resolve(true);
              }
            }, 100);
            
            // Set a timeout of 10 seconds
            setTimeout(() => {
              clearInterval(checkGooglePay);
              reject(new Error('Google Pay API failed to load'));
            }, 10000);
          }
        });

        const client = new (window as any).google.payments.api.PaymentsClient({
          environment: 'TEST'
        });

        const isReady = await client.isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['VISA', 'MASTERCARD']
            }
          }]
        });

        setIsGooglePayReady(isReady.result);
        
        if (!isReady.result) {
          setError('Google Pay is not available on this device');
          toast({
            title: "Google Pay Not Available",
            description: "Google Pay is not available on this device. Please try a different payment method.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Google Pay initialization error:', error);
        setError('Failed to initialize Google Pay');
        toast({
          title: "Google Pay Not Available",
          description: "Google Pay is not available on this device. Please try a different payment method.",
          variant: "destructive"
        });
        onError();
      }
    };

    initializeGooglePay();
  }, [onError, toast]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const client = new (window as any).google.payments.api.PaymentsClient({
        environment: 'TEST'
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD']
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
          totalPriceLabel: 'Total',
          totalPrice: amount.toString(),
          currencyCode: 'INR',
          countryCode: 'IN'
        }
      };

      const paymentData = await client.loadPaymentData(paymentDataRequest);
      console.log('Payment data:', paymentData);

      // Track analytics
      console.log('Payment Analytics:', {
        amount,
        timestamp: new Date().toISOString(),
        paymentMethod: 'Google Pay',
        status: 'success',
        transactionId: paymentData?.transactionId || `TXN_${Math.random().toString(36).substr(2, 9)}`,
        currency: 'INR',
        merchantName: 'Bhoj Basket'
      });

      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
      });

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed');
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again or choose a different payment method.",
        variant: "destructive"
      });
      onError();
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
          {isGooglePayReady ? (
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
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <p className="text-sm text-gray-500">Demo Mode</p>
        </div>
      </div>
    </div>
  );
};

export default GooglePayPayment; 